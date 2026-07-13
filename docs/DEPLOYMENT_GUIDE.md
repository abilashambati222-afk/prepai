# PrepAI – Deployment & Infrastructure Configuration Guide

This guide details the procedures for staging and production hosting of PrepAI's Decoupled workspaces.

---

## ☁️ 1. MongoDB Atlas Provisioning

PrepAI requires a persistent MongoDB database. For production, provision a MongoDB Atlas cluster:

1. Sign up/Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new shared project and provision a free **M0 Sandbox** cluster.
3. Under **Database Access**, create a database user (e.g. `prepai-admin`) with read/write privileges.
4. Under **Network Access**, whitelist `0.0.0.0/0` (or the IP ranges of your Render/hosting environment).
5. Copy the connection string:
   `mongodb+srv://prepai-admin:<password>@cluster0.abcde.mongodb.net/prepai?retryWrites=true&w=majority`

---

## ⚙️ 2. Backend Hosting (on Render)

Render provides direct integration with GitHub repositories for continuous Node.js deployment.

1. Log in to [Render](https://render.com) and click **New** -> **Web Service**.
2. Connect your PrepAI GitHub repository.
3. Configure the following parameters:
   * **Name**: `prepai-api-service`
   * **Runtime**: `Node`
   * **Build Command**: `cd backend && npm install`
   * **Start Command**: `cd backend && node server.js`
4. Add the following **Environment Variables**:
   * `PORT` — `5000`
   * `NODE_ENV` — `production`
   * `MONGODB_URI` — *Your MongoDB Atlas connection URI*
   * `JWT_SECRET` — *A secure randomly-generated cryptographical string*
   * `JWT_EXPIRES_IN` — `7d`
   * `CLIENT_URL` — *The web origin URL of your React frontend (e.g. https://prepai.vercel.app)*
   * `GEMINI_API_KEY` — *Your Google Gemini Developer API Token*

---

## 💻 3. Frontend Web Hosting (on Vercel)

Vercel is optimized for building and deploying React SPAs with automated CDN routing.

1. Log in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
2. Connect your GitHub repository.
3. Configure the build parameters:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Add the following **Environment Variable**:
   * `VITE_API_URL` — *Your deployed backend service URL (e.g. https://prepai-api-service.onrender.com/api/v1)*
5. Click **Deploy**. Vercel will build the React SPA and serve it over global edge servers.

---

## 🚦 4. Verification Checklists

### Deployed System Checks
- **CORS Boundary Testing**: Verify that requests from the frontend client origin are accepted by the backend API.
- **Dynamic AI Response Speed**: Test a mock placement simulation to verify that the Gemini API responds and evaluates candidates correctly.
- **Session Persistent Cookies / Headers**: Ensure that JWT headers are sent with the `Authorization: Bearer` format.
