# Pet Finder Capstone :

A small full-stack capstone demonstrating a clean 3-layer architecture:

**React (Frontend)** → **Core API (Express)** → **Supabase (DB)** + **Microservice (Express)** → *External API

This app supports a simple user flow:
1) View pets (stored in Supabase)
2) Add a pet
3) Mark a pet as adopted
4) View enrichment data (fact + image) pulled through the microservice

---

## Live Links (Local Dev)
Frontend: http://localhost:5173
Core API: http://localhost:3001/health
Microservice: http://localhost:3002/health
---

## Architecture (Why 3 Layers)

### Frontend (React on Netlify)
Displays pets
Sends requests to the *Core API
Contains **no secrets** (only safe public config)

### Core API (Express on Render)
Reads/writes pet data in Supabase
Calls the microservice server-to-server
Combines database + enrichment data into one response

### Microservice (Express on Render)
Owns external API keys (stored in `.env`)
Calls an external API (ex: The Dog API)
Is *never called directly by the frontend

 **Why microservice?** 
To keep API keys and external integrations isolated from the frontend, reduce risk of key exposure, and keep the Core API focused on orchestration.

---

## Repository Structure***
pet-finder-capstone/
client/        # React (Vite)
api/           # Core API (Express) - Supabase access + orchestration
microservice/  # External API calls + secrets (Express)
supabase/






## API Routes

### Core API (`http://localhost:3001`)
GET /pets-with-enrichment
Returns pets from Supabase + enrichment from the microservice (fact + image + imageUrl)
POST /pets
Creates a new pet in Supabase
PATCH /pets/:id/status
Updates pet status (ex: `available` → `adopted`)
### Microservice (`http://localhost:3002`)
GET /enrich?species=dog
Returns enrichment data from an external API (fact + image)
Note: Visiting `/` on `:3001` or `:3002` may show `Cannot GET /` unless a health route is added. The main routes above are the intended endpoints.
---

## Supabase Tables
This project uses at least **two** Supabase tables:

pets
`id` (uuid)
`name` (text)
`species` (text)
`status` (text, ex: `available`, `adopted`)
`created_at` (timestamp)
`applications` (or your second table name)
`id` (uuid)
`pet_id` (FK → pets.id)
`adopter_name` (text)
`created_at` (timestamp)
If your second table has a different name, replace `applications` with your actual table name + columns.
---

## Environment Variables (DO NOT COMMIT)

### client/.env
```bash
VITE_CORE_API_URL=http://localhost:3001



SUPABASE_URL=https://qsdruezmobfqcapdxryl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZHJ1ZXptb2JmcWNhcGR4cnlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgzMTY0MywiZXhwIjoyMDgzNDA3NjQzfQ.smybYp8rFcUqFNjYWg_Xmprwahq3WP7GtLpQmUlOTUk
MICROSERVICE_URL=http://localhost:3002


THEDOGAPI_KEY=live_zfIOdYpjfWv4DJZghmJKyuGl5wBNWVAhPJ1plCn5BGDDudlMjQHA3ayyGDAw6dRd
