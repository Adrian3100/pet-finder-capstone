import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await api.getPetsWithEnrichment();
      setPets(data.pets || []);
    } catch (e) {
      setError(e.message || "Failed to load pets.");
      setPets([]);
    } finally {
      setLoading(false);
    }
  }
  async function addPet(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Name is required.");
    setSaving(true);
    try {
      await api.addPet({ name: name.trim(), species });
      setName("");
      await load();
    } catch (e) {
      setError(e.message || "Failed to add pet.");
    } finally {
      setSaving(false);
    }
  }
  async function markAdopted(id) {
    setError("");
    try {
      await api.setStatus(id, "adopted");
      await load();
    } catch (e) {
      setError(e.message || "Failed to update.");
    }
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Pet Finder Capstone</h1>
      <form onSubmit={addPet} style={{ display: "flex", gap: 8, margin: "16px 0" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pet name" />
        <select value={species} onChange={(e) => setSpecies(e.target.value)}>
          <option value="dog">dog</option>
          <option value="cat">cat</option>
          <option value="other">other</option>
        </select>
        <button disabled={saving}>{saving ? "Saving..." : "Add Pet"}</button>
      </form>
      {error && <p style={{ color: "crimson" }}><b>Error:</b> {error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : pets.length === 0 ? (
        <p>No pets yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {pets.map((p) => (
            <li key={p.id} style={{ border: "1px solid #333", padding: 12 }}>
              <b>{p.name}</b> — {p.species} — <i>{p.status}</i>
              {p.fact && (
                <div style={{ marginTop: 6 }}>
                  <small><b>Fact:</b> {p.fact}</small>
                </div>
              )}
              {p.imageUrl && (
                <div style={{ marginTop: 8 }}>
                  <img src={p.imageUrl} alt={p.species} style={{ width: 240, borderRadius: 10 }} />
                </div>
              )}
              <div style={{ marginTop: 10 }}>
                <button onClick={() => markAdopted(p.id)} disabled={p.status === "adopted"}>
                  Mark Adopted
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}