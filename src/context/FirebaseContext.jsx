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
    console.log("User is", user);
    console.log("User display name", user ? (user.displayName || user.email) : null);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, user => {
            if (user) setUser(user)
            else setUser(null)
        })
    }, [])

    const signupUserWithEmailAndPassword = async (email, password, name) => {
        const result = await createUserWithEmailAndPassword(firebaseAuth, email, password)
        if (name) {
            await updateProfile(result.user, { displayName: name })
        }
        // Optionally create user profile in Firestore
        // await createUserProfile({ ...result.user, displayName: name });
        return result;

    }

    const signInUserWithEmailAndPassword = (email, password) => {
        return signInWithEmailAndPassword(firebaseAuth, email, password)
    }

    const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider);
    const isLoggedIn = user ? true : false;
    const logout = () => signOut(firebaseAuth)

    // Create user document after registration
    const createUserProfile = async (user) => {
        if (!user) return;
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
            displayName: user.displayName || "",
            email: user.email,
            photoURL: user.photoURL || "",
            createdAt: serverTimestamp(),
            score: 0,
            quizzesTaken: 0
        }, { merge: true });
    };

    // Fetch user profile
    const fetchUserProfile = async (uid) => {
        const userRef = doc(firestore, 'users', uid);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data() : null;
    };

    // --- CATEGORY FUNCTIONS ---

    // Add a new category
    const addCategory = async (category) => {
        await addDoc(collection(firestore, 'categories'), category);
    };

    // Fetch all categories
    const fetchCategories = async () => {
        const snapshot = await getDocs(collection(firestore, 'categories'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    // --- QUIZ FUNCTIONS ---

    // Add a new quiz
    const addQuiz = async (quiz) => {
        await addDoc(collection(firestore, 'quizzes'), {
            ...quiz,
            createdAt: serverTimestamp()
        });
    };

    // Fetch all quizzes (optionally by category)
    const fetchQuizzes = async (categoryId = null) => {
        let q = collection(firestore, 'quizzes');
        if (categoryId) {
            q = query(q, where('categoryId', '==', categoryId));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    // Fetch single quiz by ID
    const fetchQuizById = async (quizId) => {
        const quizRef = doc(firestore, 'quizzes', quizId);
        const quizSnap = await getDoc(quizRef);
        return quizSnap.exists() ? { id: quizSnap.id, ...quizSnap.data() } : null;
    };

    // --- USER QUIZ RESULT FUNCTIONS ---

    // Store a user's quiz result
    const addUserQuizResult = async (result) => {
        await addDoc(collection(firestore, 'userQuizResults'), {
            ...result,
            completedAt: serverTimestamp()
        });
    };

    // Fetch all quiz results for a user
    const fetchUserQuizResults = async (userId) => {
        const q = query(collection(firestore, 'userQuizResults'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    // Fetch top N users by score for leaderboard
    const fetchLeaderboard = async (limitCount = 10) => {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('score', '>=', 0), orderBy('score', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    return (
        <FirebaseContext.Provider value={{
            signupUserWithEmailAndPassword,
            signInUserWithEmailAndPassword,
            signinWithGoogle,
            isLoggedIn,
            logout,
            user,
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