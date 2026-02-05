import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

export default function InsightsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await api.getPetsWithEnrichment();
        if (!alive) return;
        setPets(data.pets || []);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Failed to load insights");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = pets.length;
    const adopted = pets.filter((p) => p.status === "adopted").length;
    const available = pets.filter((p) => p.status !== "adopted").length;

    const speciesCount = pets.reduce((acc, p) => {
      const key = (p.species || "unknown").toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const newest = [...pets]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .at(0);

    return { total, adopted, available, speciesCount, newest };
  }, [pets]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h2>Insights</h2>
      {loading && <p>Loading insights...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      
      {!loading && !error && (
        <>
          
          <div
            style={{
              display: "grid",
              gap: 10,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            
            <StatCard label="Total Pets" value={stats.total} />
            
            <StatCard label="Available" value={stats.available} />
            
            <StatCard label="Adopted" value={stats.adopted} />
            
          </div>
          <h3 style={{ marginTop: 22 }}>By Species</h3>
          
          <ul>
            
            {Object.entries(stats.speciesCount).map(([species, count]) => (
              <li key={species}>
                {species}: {count}
                
              </li>
            ))}
            
          </ul>
          <h3 style={{ marginTop: 22 }}>Newest Listing</h3>
        
          {stats.newest ? (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
              }}
            >
              
              <p>
                <b>Name:</b> {stats.newest.name}
              </p>
              
              <p>
                <b>Species:</b> {stats.newest.species}
              </p>
              
              <p>
                <b>Status:</b> {stats.newest.status}
              </p>
              
              <p>
                <b>Created:</b> {stats.newest.created_at}
              </p>
              
              {stats.newest.imageUrl && (
                <img
                  src={stats.newest.imageUrl}
                  alt={stats.newest.name}
                  style={{ width: 280, borderRadius: 12, marginTop: 10 }}
                />
              )}
              
            </div>
          ) : (
            <p>No pets yet.</p>
          )}
          
        </>
      )}
      
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
      <div style={{ color: "#666", fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      
    </div>
  );
}
