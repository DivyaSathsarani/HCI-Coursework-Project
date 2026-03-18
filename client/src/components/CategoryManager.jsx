import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export default function CategoryManager() {
  const [category, setCategory] = useState("");
  const [designName, setDesignName] = useState("");
  const [size, setSize] = useState("1,1,1");
  const [color, setColor] = useState("#888888");

  const [modelFile, setModelFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [furnitureList, setFurnitureList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const loadFurniture = async () => {
    try {
      const res = await apiFetch("/api/furniture/all");
      const data = await res.json();
      setFurnitureList(data);
    } catch (err) {
      console.error("Fetch furniture error", err);
    }
  };

  useEffect(() => {
    loadFurniture();
  }, []);

  const handleUpload = async () => {
    if (!category || !designName || !modelFile) return alert("Please fill all required fields");

    const formData = new FormData();
    formData.append("category", category);
    formData.append("name", designName);
    formData.append("size", size);
    formData.append("color", color);
    formData.append("model", modelFile);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await apiFetch("/api/furniture/add", { method: "POST", body: formData });
      if (res.ok) {
        alert("Furniture uploaded successfully");
        resetForm();
        loadFurniture();
      } else alert("Upload failed");
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this furniture?")) return;
    await apiFetch(`/api/furniture/delete/${id}`, { method: "DELETE" });
    loadFurniture();
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setCategory(item.category);
    setDesignName(item.name);
    setSize(item.size.join(","));
    setColor(item.color || "#888888");
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("category", category);
    formData.append("name", designName);
    formData.append("size", size);
    formData.append("color", color);
    if (modelFile) formData.append("model", modelFile);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`/api/furniture/update/${editingId}`, { method: "PUT", body: formData });
      if (res.ok) {
        alert("Furniture updated");
        resetForm();
        loadFurniture();
      } else alert("Update failed");
    } catch (err) {
      console.error(err);
      alert("Update error");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setCategory("");
    setDesignName("");
    setSize("1,1,1");
    setColor("#888888");
    setModelFile(null);
    setImageFile(null);
  };

  const groupedFurniture = furnitureList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="text-gray-800">
      <div className="text-[15px] font-semibold mb-2.5 text-gray-800">Manage Furniture</div>
      <div className="flex flex-col gap-2.5">

        {/* Upload Form */}
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input type="text" value={category} placeholder="Category" onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

        <label className="block text-sm font-medium text-gray-700">Design Name</label>
        <input type="text" value={designName} placeholder="Design Name" onChange={(e) => setDesignName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

        <label className="block text-sm font-medium text-gray-700">Size (1,1,1)</label>
        <input type="text" value={size} placeholder="1,1,1" onChange={(e) => setSize(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

        <label className="block text-sm font-medium text-gray-700">Color</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500" />

        <p className="text-[11px] text-gray-500 italic">3D Model: .glb or .gltf | Preview Image: any image format</p>

        <label className="block text-sm font-medium text-gray-700">Upload 3D Model</label>
        <input type="file" accept=".glb,.gltf" onChange={(e) => setModelFile(e.target.files[0])} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />

        <label className="block text-sm font-medium text-gray-700">Upload Preview Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />

        {imageFile && (
          <div>
            <img src={URL.createObjectURL(imageFile)} alt="preview" className="w-20 h-20 rounded-lg object-cover mt-1.5 border border-gray-200" />
          </div>
        )}

        <button className="mt-2.5 py-2.5 rounded-lg border-none bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold cursor-pointer transition-colors" onClick={editingId ? handleUpdate : handleUpload}>
          {editingId ? "Update Furniture" : "Upload Furniture"}
        </button>

        {/* Scrollable Furniture Library */}
        <div className="max-h-[300px] overflow-y-auto pr-1.5 mt-2.5 border-t border-gray-100 pt-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-lg">
          <div className="flex flex-col gap-3">
            {Object.keys(groupedFurniture).length === 0 && <p className="text-xs italic text-gray-500">No furniture found</p>}
            {Object.keys(groupedFurniture).map((cat) => (
              <div key={cat} className="flex flex-col gap-1.5">
                <div className="text-[13px] font-semibold text-orange-500 uppercase tracking-wider">{cat}</div>
                {groupedFurniture[cat].map((item) => (
                  <div key={item._id} className="flex items-center gap-2.5 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />}
                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                      <span className="text-[13px] font-semibold text-gray-800 truncate">{item.name}</span>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => startEdit(item)} className="py-1.5 px-2.5 rounded-lg border-none text-[11px] font-medium cursor-pointer bg-orange-500 hover:bg-orange-600 text-white transition-colors">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="py-1.5 px-2.5 rounded-lg border-none text-[11px] font-medium cursor-pointer bg-red-500 hover:bg-red-600 text-white transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}