# TwinFin AI - MSME Loan & Credit Advisory Application

An AI-powered MSME Credit Risk Assessment and Loan Advisory application. This app leverages the **Gemini 2.5/3.5 Flash** models to securely analyze financial documents (such as GST filings, bank statements, and invoices) and provide custom borrowing limits, probability of approvals, and improvement roadmaps.

---

## 🔒 Security & GitHub Safety Check
**Is it safe to push to GitHub? Yes!**
- **No API Keys are committed in the code.**
- The application securely references your `GEMINI_API_KEY` from environment variables (`process.env.GEMINI_API_KEY`) on the server-side.
- The `.gitignore` is fully configured to prevent temporary artifacts or credentials from being committed.
- Keep your actual values inside your local `.env` file, and **never** commit that `.env` file.

---

## 🚀 Vercel Deployment Instructions

Since this is a full-stack application featuring a Vite client and an Express backend, we have configured it to deploy seamlessly on Vercel as a hybrid project using Vercel Serverless Functions.

### Step 1: Install Vercel CLI (Optional but helpful)
You can deploy directly through the Vercel Dashboard or using their CLI:
```bash
npm install -g vercel
```

### Step 2: Push to GitHub
Create a new repository on GitHub and push this project:
```bash
git init
git add .
git commit -m "feat: vercel deployment configuration"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 3: Import into Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/) and click **"Add New"** -> **"Project"**.
2. Import your GitHub repository.
3. Under **Framework Preset**, select **Vite** (Vercel will auto-detect Vite).
4. Keep the default build and output settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Configure Environment Variables (CRITICAL):**
   Expand the **Environment Variables** section and add:
   - `GEMINI_API_KEY`: Your Google Gemini API key (you can generate one from Google AI Studio).
   - `APP_URL`: The URL where your Vercel project will be hosted (e.g., `https://your-app-name.vercel.app` - you can update this once the project is deployed).

6. Click **Deploy**!

---

## 🛠️ How the Vercel Configuration Works
To make this full-stack React + Express setup compatible with Vercel's Serverless environment, the following adjustments have been implemented:

1. **`vercel.json`**:
   Configured URL routing so that all backend API calls starting with `/api/` are routed to the Express serverless function, while all other routes are handled by the Vite single-page app (`index.html`).
2. **`/api/index.ts`**:
   Created a serverless entry point that exports the Express server.
3. **`server.ts`**:
   Exported the `app` instance and ensured the standalone `app.listen()` call only fires when running locally (not in the serverless environment).

---

## 📦 Local Development

To run the application locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Create a `.env` file in the root directory:**
   ```env
   GEMINI_API_KEY="your_api_key_here"
   APP_URL="http://localhost:3000"
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
