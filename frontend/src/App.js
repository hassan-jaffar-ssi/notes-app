import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = async () => {
    const res = await axios.get(API_URL);
    setNotes(res.data);
  };

  const addNote = async () => {
    await axios.post(API_URL, { title, content });
    setTitle("");
    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={{ margin: 40, fontFamily: "Arial, sans-serif", padding: '10px 200px' }}>
      <h1 style={{ color: "#333", marginBottom: 20 }}>📝 Notes App</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
          marginBottom: 10,
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      <br />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        rows="4"
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
          marginBottom: 10,
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      <br />
      <button
        onClick={addNote}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        Add Note
      </button>

      <hr />

      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: 15,
            marginBottom: 15,
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ margin: "0 0 10px" }}>{note.title}</h3>
          <p style={{ margin: "0 0 10px" }}>{note.content}</p>
          <button
            onClick={() => deleteNote(note.id)}
            style={{
              padding: "6px 12px",
              fontSize: 14,
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>

  );
}

export default App;
