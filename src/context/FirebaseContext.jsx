import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createContext, useContext, useState, useEffect } from "react";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from 'firebase/auth'
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    setDoc,
    query,
    where,
    updateDoc,
    serverTimestamp,
    orderBy,
    limit
} from "firebase/firestore";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);


const FirebaseContext = createContext();

const firebaseAuth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const FirebaseProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
            if (user) setUser(user)
            else setUser(null)
            setLoading(false);
        });

        return () => unsubscribe();
    }, [])

    // Register new user
    const signUpUserWithEmailAndPassword = async (email, password, name) => {
        try {
            const result = await createUserWithEmailAndPassword(firebaseAuth, email, password)
            if (name) {
                await updateProfile(result.user, { displayName: name })
            }
            // Create user profile in Firestore
            await createUserProfile({ ...result.user, displayName: name });
            return result;
        } catch (error) {
            console.log("Error in FirebaseContext :: signUpUserWithEmailAndPassword: ", error)
        }
    }

    // Login new user
    const signInUserWithEmailAndPassword = (email, password) => {
        try {
            return signInWithEmailAndPassword(firebaseAuth, email, password)
        } catch (error) {
            console.log("Error in FirebaseContext :: signInUserWithEmailAndPassword: ", error)
        }
    }

    // Signup with google
    const signInWithGoogle = () => {
        try {
            signInWithPopup(firebaseAuth, googleProvider);
        } catch (error) {
            console.log("Error in FirebaseContext :: signInWithGoogle: ", error)
        }
    }

    // Check if user logged in
    const isLoggedIn = user ? true : false;

    // Sign out user
    const logout = () => signOut(firebaseAuth)

    // Create user document in firestore after registration
    const createUserProfile = async (user) => {
        if (!user) return;
        try {
            const userRef = doc(firestore, 'users', user.uid);
            await setDoc(userRef, {
                displayName: user.displayName || "",
                email: user.email,
                photoURL: user.photoURL || "",
                createdAt: serverTimestamp(),
                score: 0,
                quizzesTaken: 0
            }, { merge: true });
        } catch (error) {
            console.log("Error in FirebaseContext :: createUserProfile: ", error)
        }
    };

    // Fetch user profile
    const fetchUserProfile = async (uid) => {
        try {
            const userRef = doc(firestore, 'users', uid);
            const userSnap = await getDoc(userRef);
            return userSnap.exists() ? userSnap.data() : null;
        } catch (error) {
            console.log("Error in FirebaseContext :: fetchUserProfile: ", error)
        }
    };

    // --- CATEGORY FUNCTIONS ---

    // Add a new category
    const addCategory = async (category) => {
        try {
            await addDoc(collection(firestore, 'categories'), category);
        } catch (error) {
            console.log("Error in FirebaseContext :: addCategory: ", error)
        }
    };

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            const snapshot = await getDocs(collection(firestore, 'categories'));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.log("Error in FirebaseContext :: fetchCategories: ", error)
        }
    };

    // --- QUIZ FUNCTIONS ---

    // Add a new quiz
    const addQuiz = async (quiz) => {
        try {
            await addDoc(collection(firestore, 'quizzes'), {
                ...quiz,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.log("Error in FirebaseContext :: addQuiz: ", error)
        }
    };

    // Fetch all quizzes (optionally by category)
    const fetchQuizzes = async (categoryId = null) => {
        try {
            let q = collection(firestore, 'quizzes');
            if (categoryId) {
                q = query(q, where('categoryId', '==', categoryId));
            }
            const snapshot = await getDocs(q);
            console.log("snapshot fetch quizzes", snapshot);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.log("Error in FirebaseContext :: fetchQuizzes: ", error)
        }
    };

    // Fetch single quiz by ID
    const fetchQuizById = async (quizId) => {
        try {
            const quizRef = doc(firestore, 'quizzes', quizId);
            const quizSnap = await getDoc(quizRef);
            return quizSnap.exists() ? { id: quizSnap.id, ...quizSnap.data() } : null;
        } catch (error) {
            console.log("Error in FirebaseContext :: fetchQuizById: ", error)
        }
    };

    // --- USER QUIZ RESULT FUNCTIONS ---

    // Store a user's quiz result
    const addUserQuizResult = async (result) => {
        try {
            await addDoc(collection(firestore, 'userQuizResults'), {
                ...result,
                completedAt: serverTimestamp()
            });
            const userRef = doc(firestore, 'users', result.userId)  
            const userSnap = await getDoc(userRef);
            if(userSnap.exists()) {
                const userData = userSnap.data();
                const prevQuizzesTaken = userData.quizzesTaken || 0;
                await updateDoc(userRef, {
                    quizzesTaken: prevQuizzesTaken + 1,
                    score: result.score  // latest score update
                    // score: Math.max(userData.score || 0, result.score)  // highest score update
                });
            }
        } catch (error) {
            console.log("Error in FirebaseContext :: addUserQuizResult: ", error)
        }
    };

    // Fetch all quiz results for a user
    const fetchUserQuizResults = async (userId) => {
        try {
            const q = query(collection(firestore, 'userQuizResults'), where('userId', '==', userId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.log("Error in FirebaseContext :: fetchUserQuizResults: ", error)
        }
    };

    // Fetch top N users by score for leaderboard
    const fetchLeaderboard = async (limitCount = 10) => {
        try {
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('score', '>=', 0), orderBy('score', 'desc'), limit(limitCount));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.log("Error in FirebaseContext :: fetchLeaderboard: ", error)
        }
    };

    return (
        <FirebaseContext.Provider value={{
            signUpUserWithEmailAndPassword,
            signInUserWithEmailAndPassword,
            signInWithGoogle,
            isLoggedIn,
            logout,
            user,
            loading,
            setUser,
            createUserProfile,
            fetchUserProfile,
            addCategory,
            fetchCategories,
            addQuiz,
            fetchQuizzes,
            fetchQuizById,
            addUserQuizResult,
            fetchUserQuizResults,
            fetchLeaderboard
        }}>
            {children}
        </FirebaseContext.Provider>
    )
}

export const useFirebase = () => useContext(FirebaseContext);