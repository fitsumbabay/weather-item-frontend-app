import React, { useState, useEffect } from "react";
import axios from "axios";
import './ItemManager.css';

const ItemManager = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        "https://my-mern-backend-wiel.onrender.com/api/items"
      );
      const itemsWithId = response.data.map((item) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
      }));
      setItems(itemsWithId);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price) return;

    setLoading(true);

    if (editingItemId) {
      // Update existing item
      try {
        await axios.put(
          `https://my-mern-backend-wiel.onrender.com/api/items/${editingItemId}`,
          {
            name,
            description,
            price: Number(price),
          }
        );
        setItems(items.map(item => item.id === editingItemId ? { ...item, name, description, price: Number(price) } : item));
        setEditingItemId(null);
      } catch (err) {
        setError(err.message || "Failed to update item");
      }
    } else {
      // Add new item
      const tempItem = {
        id: Date.now(),
        name,
        description,
        price: Number(price),
      };
      setItems([...items, tempItem]);
      try {
        const response = await axios.post(
          "https://my-mern-backend-wiel.onrender.com/api/items",
          {
            name,
            description,
            price: Number(price),
          }
        );
        setItems([
          ...items,
          { id: response.data._id, name, description, price: Number(price) },
        ]);

      } catch (err) {
        setError(err.message || "Failed to add item");
        setItems((items) => items.filter((item) => item.id !== tempItem.id));
      }
    }

    setName("");
    setDescription("");
    setPrice("");
    setLoading(false);
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setLoading(true);
    try {
      await axios.delete(
        `https://my-mern-backend-wiel.onrender.com/api/items/${id}`
      );
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  const editItem = (item) => {
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setEditingItemId(item.id);
  };

  return (
    <div>
      <h2>Item Manager</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingItemId ? "Update Item" : "Add Item"}
        </button>
        {editingItemId && (
          <button
            type="button"
            onClick={() => {
              setEditingItemId(null);
              setName("");
              setDescription("");
              setPrice("");
            }}
          >
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <p>Loading items...</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
              <button onClick={() => editItem(item)}>Edit</button>
              <button onClick={() => deleteItem(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemManager;







