<div align="center">
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#2563eb" />
    <path d="M 50 30 L 25 70 L 50 55 Z" fill="#ffffff" />
    <path d="M 50 30 L 75 70 L 50 55 Z" fill="#ffffff" />
  </svg>
  
  <h1>ContextCV</h1>
  <p><strong>An AI resume generator that builds a tailored, ATS-friendly resume (and its LaTeX source) for every job you apply to.</strong></p>
  <p>
    <a href="https://contextcv.vercel.app"><strong>https://contextcv.vercel.app</strong></a>
  </p>
</div>

## Overview

ContextCV is a project I built to stop the cycle of manually rewriting my resume for every single job application. The idea is simple: instead of editing one resume file over and over, you build a "Career Vault" once for every project, internship, and hackathon you've ever worked on goes in there.

When you find a job you want to apply to, you paste in the job description and pick a template. ContextCV then does the rest: it searches your vault for the experiences that actually match what the job is asking for, rewrites those bullet points around the job's keywords using AI, and compiles everything into a clean PDF resume along with the raw LaTeX source if you want to tweak it further on Overleaf.

## How it Works

### 1. The Career Vault (Vector Search)
Every entry you add to your vault which are projects, work experience, hackathons gets converted into a vector embedding using Google's `gemini-embedding-001` model and stored in MongoDB Atlas with a Vector Search index. This means your vault isn't just a list, it's searchable by *meaning*, not just keywords.

### 2. Matching Your Experience to the Job (RAG)
When you paste a job description, the backend generates an embedding for it too, then runs a MongoDB `$vectorSearch` query against your vault to pull out the projects that are most relevant to that specific job — instead of dumping your entire history at the AI and hoping for the best.

### 3. AI Resume Rewriting + Validation
Your core profile, the matched projects, and the job description get sent to Groq's `llama-3.3-70b-versatile` model, which rewrites your bullet points to highlight the skills and keywords the job is looking for without inventing new experience. Before the backend trusts this response, it's checked against a strict Zod schema, so if the AI ever returns malformed JSON, it gets caught and retried instead of crashing the server.

### 4. Compiling to a Real PDF (No Puppeteer)
Instead of using a heavy HTML-to-PDF converter, the validated, AI-rewritten data is injected directly into a LaTeX template. The backend sends this to a LaTeX compilation service and gets back a properly typeset PDF — plus the `.tex` source itself, so you can keep editing it on Overleaf if you want full control.

## Features

- **Master Career Vault** — store your entire work history once, reuse it for every application
- **Vector Search (RAG)** — only the most relevant projects get sent to the AI, keeping output focused
- **Schema Validation Guardrails** — Zod ensures the AI's JSON output is always safe to use
- **LaTeX-based PDF Compilation** — real typesetting, not a screenshot of an HTML page
- **Dual Export** — download both the final PDF and the editable `.tex` source
- **Multiple Resume Templates** — choose between Minimalist, Executive, and Modern layouts

## Tech Stack Used

* **Frontend:** React.js (Vite), Tailwind CSS, React Router, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (standard collections + Vector Search)
* **AI — Resume Rewriting:** Groq (`llama-3.3-70b-versatile`)
* **AI — Embeddings / Search:** Google Gemini (`gemini-embedding-001`)
* **Validation:** Zod
* **PDF Engine:** LaTeX, compiled via a LaTeX-on-HTTP service
* **Auth:** JWT, bcryptjs

---

## How to Run This on Your Computer

### Prerequisites
- Node.js installed
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini embeddings)
- A [Groq](https://console.groq.com/) API key (for resume rewriting)

### 1. Set up MongoDB Atlas

1. Create a free (M0) cluster.
2. Create a database user and whitelist your IP under Network Access.
3. Inside your cluster, go to **Search & Vector Search** and create a Vector Search index on your `vaultentries` collection, named `vector_index`, on the `embedding` field. Example index definition:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 3072,
      "similarity": "cosine"
    }
  ]
}
```

> Note: `numDimensions` must match the output size of the embedding model you're using — double check this against what `gemini-embedding-001` returns for your configuration.

### 2. Start the Backend

Open a terminal, go to the `backend` folder, and install the packages:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=put_any_secret_string_here
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Start the Frontend

Open a new terminal, go to the `frontend` folder, and install the packages:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:8000/api
```

Now run:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser — the app should be running.

---

## Available Resume Templates

- **Minimalist** — clean, single-column, standard ATS-friendly layout
- **Executive** — traditional, impact-driven layout for experienced roles
- **Modern** — two-column skills table with icon-based contact info

