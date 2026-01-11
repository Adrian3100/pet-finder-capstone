import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/pet-enrich", async (req, res) => {
  const species = (req.query.species || "dog").toString().toLowerCase();

  const fallbackFact =
    species === "cat"
      ? "Cats sleep 12–16 hours a day."
      : species === "dog"
      ? "Dogs can learn over 100 words."
      : "Animals benefit from routine and enrichment.";

  try {
    let imageUrl = "";

    if (species === "dog") {
      const apiKey = process.env.THEDOGAPI_KEY; // :white_check_mark: env var used here
      const r = await fetch("https://api.thedogapi.com/v1/images/search", {
        headers: apiKey ? { "x-api-key": apiKey } : {}
      });
      const j = await r.json();
      imageUrl = Array.isArray(j) && j[0]?.url ? j[0].url : "";
    } else if (species === "cat") {
      const apiKey = process.env.THECATAPI_KEY; // :white_check_mark: env var used here
      const r = await fetch("https://api.thecatapi.com/v1/images/search", {
        headers: apiKey ? { "x-api-key": apiKey } : {}
      });
      const j = await r.json();
      imageUrl = Array.isArray(j) && j[0]?.url ? j[0].url : "";
    }

    return res.json({ species, fact: fallbackFact, imageUrl });
  } catch {
    return res.json({ species, fact: fallbackFact, imageUrl: "" });
  }
});

app.listen(PORT, () => {
  console.log(`Microservice running on http://localhost:${PORT}`);
});










