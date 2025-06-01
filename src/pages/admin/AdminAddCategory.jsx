import { useState } from "react";
import { useFirebase } from "../../context/FirebaseContext";

export default function AdminAddCategory() {
  const firebase = useFirebase();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await firebase.addCategory({ name, icon, description });
    setSuccess("Category added!");
    setName(""); setIcon(""); setDescription("");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Category</h2>
      {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border px-3 py-2 rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="w-full border px-3 py-2 rounded" placeholder="Icon (emoji)" value={icon} onChange={e => setIcon(e.target.value)} />
        <input className="w-full border px-3 py-2 rounded" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">Add Category</button>
      </form>
    </div>
  );
}