# Deployment & Launch Checklist

This document provides a production release checklist, environment variable settings, verification tests, and rollback procedures for PrepAI.

---

## 📋 PRE-DEPLOYMENT CHECKS

- [ ] Confirm frontend Vite builds locally with zero errors (`npm run build`).
- [ ] Confirm no hardcoded `http://localhost` routes exist inside client request services.
- [ ] Verify CORS settings in `backend/app.js` read origin configurations from environment settings.
- [ ] Confirm local database seeding scripts execute cleanly to initialize testing collections.

---

## 🛠️ DEPLOYMENT PROCEDURES

### 1. MongoDB Atlas Configuration
- [ ] Sign up or log in to [MongoDB Atlas](https://www.mongodb.com).
- [ ] Provision a shared cluster (e.g. `Cluster0` on M0 tier).
- [ ] Create a database user with read and write permissions (note username and password).
- [ ] Whitelist the API server IP (or set `0.0.0.0/0` for dynamic Render IPs under **Network Access**).
- [ ] Retrieve the cluster connection string:
  `mongodb+srv://<username>:<password>@cluster0.mongodb.net/prepai?retryWrites=true&w=majority`

### 2. Render Backend Web Service Setup
- [ ] Sign up or log in to [Render](https://render.com).
- [ ] Click **New** -> **Web Service** and connect the GitHub repository.
- [ ] Set configuration settings:
  * **Root Directory**: `backend`
  * **Build Command**: `npm install`
  * **Start Command**: `node server.js`
- [ ] Configure the following **Environment Variables**:
  * `MONGODB_URI` — *MongoDB Atlas connection URI retrieved in Step 1*
  * `PORT` — `5000`
  * `NODE_ENV` — `production`
  * `JWT_SECRET` — *A secure randomly-generated string*
  * `JWT_EXPIRES_IN` — `7d`
  * `GEMINI_API_KEY` — *Google Gemini Developer API Token*
  * `CLIENT_URL` — *Target Vercel frontend URL (will be updated once Vercel is deployed)*
- [ ] Click **Deploy** and copy the generated Web Service URL.

### 3. Vercel Frontend Client Setup
- [ ] Sign up or log in to [Vercel](https://vercel.com).
- [ ] Click **Add New** -> **Project** and connect the GitHub repository.
- [ ] Configure Vite build settings:
  * **Root Directory**: `frontend`
  * **Framework Preset**: `Vite`
  * **Build Command**: `npm run build`
  * **Output Directory**: `dist`
- [ ] Add the following **Environment Variable**:
  * `VITE_API_URL` — *Deployed Render backend API URL (e.g. `https://prepai-api.onrender.com/api/v1`)*
- [ ] Click **Deploy**. Copy the deployed client domain (e.g., `https://prepai-client.vercel.app`).
- [ ] Return to your Render Web Service dashboard and update the `CLIENT_URL` environment variable to match this Vercel domain.

---

## 🚦 DEPLOYMENT VERIFICATION TESTS

- [ ] **Health Check**: Access `https://<render-backend-url>/api/v1/health` in a browser. Confirm it returns a `200 OK` JSON response with `{ "status": "success" }`.
- [ ] **Registration & JWT**: Open the Vercel URL, click register, input credentials, and verify registration. Open Browser dev tools (Application -> Local Storage) and confirm that `token` exists.
- [ ] **CORS Verification**: Confirm that profile updates and dashboards load without console CORS policy blocking logs.
- [ ] **Gemini AI Connection**: Upload a sample PDF resume, initiate parsing, and verify that structured skills are parsed and displayed on the console.

---

## 🛑 ROLLBACK PROCEDURES

If the production release introduces critical errors or breaks system workflows:

1. **Vercel Client Rollback**:
   - In the Vercel project dashboard, navigate to **Deployments**.
   - Locate the last stable deployment build.
   - Click the three dots icon and select **Promote to Production** to roll back immediately.
2. **Render Backend Rollback**:
   - In the Render Web Service dashboard, select **Events**.
   - Locate the last stable deployment commit.
   - Select **Rollback to this deploy** to redeploy the previous stable build.
3. **Database Restore**:
   - If database models or indexes require a restore, navigate to MongoDB Atlas -> **Backup**.
   - Select the last automated snapshot and click **Restore** to roll back collection data.
