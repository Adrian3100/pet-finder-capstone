import "dotenv/config";
import express from "express";
import cors from "cors";
import { supabase } from "./supabase.js";
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;
const MICROSERVICE_URL = process.env.MICROSERVICE_URL || "http://localhost:3002";
app.get("/health", (req, res) => res.json({ ok: true }));
// :white_check_mark: Core API routes interacting with Supabase (at least 2)
app.get("/pets", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ pets: data || [] });
  } catch (e) {
    return res.status(500).json({ error: "Unexpected server error" });
  }
});
app.post("/pets", async (req, res) => {
  try {
    const { name, species } = req.body;
    if (!name || !species) {
      return res.status(400).json({ error: "name and species are required" });
    }
    const clean = String(name).trim();
    if (clean.length < 1) return res.status(400).json({ error: "name is required" });
    const { data, error } = await supabase
      .from("pets")
      .insert([{ name: clean, species, status: "available" }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ pet: data });
  } catch {
    return res.status(500).json({ error: "Unexpected server error" });
  }
});
app.patch("/pets/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["available", "adopted"].includes(status)) {
      return res.status(400).json({ error: "status must be available or adopted" });
    }
    const { data, error } = await supabase
      .from("pets")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ pet: data });
  } catch {
    return res.status(500).json({ error: "Unexpected server error" });
  }
});
// :white_check_mark: Route that calls microservice and returns combined data
app.get("/pets-with-enrichment", async (req, res) => {
  try {
    const { data: pets, error } = await supabase
      .from("pets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    const enriched = await Promise.all(
      (pets || []).map(async (p) => {
        try {
          const r = await fetch(
            `${MICROSERVICE_URL}/pet-enrich?species=${encodeURIComponent(p.species)}`
          );
          const j = await r.json().catch(() => ({}));
          return { ...p, fact: j.fact || "", imageUrl: j.imageUrl || "" };
        } catch {
          return { ...p, fact: "", imageUrl: "" };
        }
      })
    );
    return res.json({ pets: enriched });
  } catch {
    return res.status(500).json({ error: "Unexpected server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Core API running on http://localhost:${PORT}`);
});