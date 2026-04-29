# Cricket Live Scoring App

## Deployment Instructions

### 1. Export to GitHub
- Open the settings/export menu in Google AI Studio.
- Choose **Export to GitHub**.
- Authenticate and select/create a repository.

### 2. Deploy to Vercel
- Go to [Vercel](https://vercel.com) and click **Add New** > **Project**.
- Import the repository you just created.
- **Environment Variables**: You MUST add the following variables in the Vercel project settings:
  - `VITE_SUPABASE_URL`: Your Supabase Project URL
  - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon/Public Key
- **Framework Preset**: Select **Vite**.
- **Root Directory**: `./` (default).
- **Build Command**: `npm run build`.
- **Output Directory**: `dist`.

### 3. Supabase Setup
Ensure your Supabase project is configured with the correct redirect URLs (e.g., your Vercel deployment URL) if you are using OAuth/Google Login.

## local development
```bash
npm install
npm run dev
```
