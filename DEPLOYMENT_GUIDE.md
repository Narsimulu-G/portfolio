# 🚀 Portfolio Deployment Guide

This guide will help you deploy your portfolio project to Render (Backend) and Vercel (Frontend).

## 📋 Prerequisites

1. **GitHub Account** - Your code should be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
4. **MongoDB Atlas Account** - For production database
5. **Cloudinary Account** - For image uploads (optional)

## 🔧 Backend Deployment (Render)

### Step 1: Create MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for Render
5. Get your connection string

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository
5. Configure the service:
   - **Name**: `portfolio-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

### Step 3: Set Environment Variables in Render
Go to your service → Environment tab and add:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Step 4: Deploy
Click "Deploy Web Service" and wait for deployment to complete.

## 🎨 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `portfolio`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Set Environment Variables in Vercel
Go to your project → Settings → Environment Variables and add:

```
VITE_API_BASE=https://your-render-app.onrender.com
```

### Step 3: Deploy
Click "Deploy" and wait for deployment to complete.

## 🔄 Update CORS Origin

After both deployments are complete:

1. **Get your Vercel URL** (e.g., `https://your-app.vercel.app`)
2. **Update Render environment variable**:
   - Go to Render dashboard
   - Select your backend service
   - Go to Environment tab
   - Update `CORS_ORIGIN` to your Vercel URL
3. **Redeploy** the backend service

## 🧪 Testing Your Deployment

### Backend Health Check
Visit: `https://your-render-app.onrender.com/health`

### Frontend
Visit: `https://your-vercel-app.vercel.app`

### Admin Panel
Visit: `https://your-vercel-app.vercel.app/admin`

## 🔐 Admin Credentials

Default admin credentials:
- **Email**: `admin123@gmail.com`
- **Password**: `admin123`

**Important**: Change these credentials after first login!

## 📝 Notes

- **Free Plans**: Both Render and Vercel free plans have limitations
- **Database**: MongoDB Atlas free tier has 512MB storage
- **Images**: Cloudinary free tier has 25GB storage
- **Custom Domain**: You can add custom domains to both services

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure CORS_ORIGIN is set correctly
2. **Database Connection**: Check MongoDB Atlas IP whitelist
3. **Build Failures**: Check environment variables are set
4. **Image Uploads**: Verify Cloudinary credentials

### Support:
- Render: [docs.render.com](https://docs.render.com)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
