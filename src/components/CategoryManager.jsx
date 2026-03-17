import { useState, useEffect } from "react";
import "./CategoryManager.css";

export default function CategoryManager({ refreshFurniture }) {
  const [category, setCategory] = useState("");
  const [designName, setDesignName] = useState("");
  const [size, setSize] = useState("1,1,1");
  const [color, setColor] = useState("#888888");

  const [modelFile, setModelFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [furnitureList, setFurnitureList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Load furniture
  const loadFurniture = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/furniture/all");
      const data = await res.json();
      setFurnitureList(data);
    } catch (err) {
      console.error("Fetch furniture error", err);
    }
  };

  useEffect(() => {
    loadFurniture();
  }, []);

  // Upload furniture
  const handleUpload = async () => {
    if (!category || !designName || !modelFile)
      return alert("Please fill all required fields");

    const formData = new FormData();
    formData.append("category", category);
    formData.append("name", designName);
    formData.append("size", size);
    formData.append("color", color);
    formData.append("model", modelFile);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:5000/api/furniture/add", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Furniture uploaded successfully");
        resetForm();
        loadFurniture();
        refreshFurniture && refreshFurniture();
      } else alert("Upload failed");
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }
  };

  // Delete furniture
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this furniture?")) return;
    await fetch(`http://localhost:5000/api/furniture/delete/${id}`, {
      method: "DELETE",
    });
    loadFurniture();
    refreshFurniture && refreshFurniture();
  };

  // Edit furniture
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
      const res = await fetch(
        `http://localhost:5000/api/furniture/update/${editingId}`,
        { method: "PUT", body: formData }
      );
      if (res.ok) {
        alert("Furniture updated");
        resetForm();
        loadFurniture();
        refreshFurniture && refreshFurniture();
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

  return (
    <div className="category-manager">
      <h3>Manage Categories & Furniture</h3>

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="text"
        placeholder="Design Name"
        value={designName}
        onChange={(e) => setDesignName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Size (1,1,1)"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />

      <div className="input-color">
        <label>Color:</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>

      <div className="input-file">
        <label>Upload 3D Model (.glb):</label>
        <input type="file" accept=".glb,.gltf" onChange={(e) => setModelFile(e.target.files[0])} />
      </div>

      <div className="input-file">
        <label>Upload Preview Image:</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
      </div>

      <div className="form-buttons">
        {editingId ? (
          <button className="update-btn" onClick={handleUpdate}>
            Update Furniture
          </button>
        ) : (
          <button onClick={handleUpload}>Upload Furniture</button>
        )}
      </div>

      <h4>Existing Furniture</h4>
      <div className="existing-furniture">
        {furnitureList.length === 0 && <p className="no-furniture">No furniture found.</p>}
        {furnitureList.map((item) => (
          <div key={item._id} className="existing-furniture-item">
            <div className="furniture-info">
              {item.image && (
                <img src={`http://localhost:5000${item.image}`} alt={item.name} />
              )}
              <span>
                {item.category} → {item.name}
              </span>
            </div>
            <div className="furniture-item-buttons">
              <button onClick={() => startEdit(item)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}