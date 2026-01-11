const CORE = import.meta.env.VITE_CORE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const res = await fetch(`${CORE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  // :white_check_mark: Core API combined route
  getPetsWithEnrichment: () => request("/pets-with-enrichment"),

  // :white_check_mark: create pet
  addPet: (payload) =>
    request("/pets", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // :white_check_mark: update status (matches Core API)
  setStatus: (id, status) =>
    request(`/pets/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
