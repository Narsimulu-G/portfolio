# Deployment Guide

## Vercel Deployment Steps

### 1. Prepare Repository
```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "first commit"

# Set main branch
git branch -M main

# Add remote origin
git remote add origin https://github.com/Narsimulu-G/portfolio.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub: `Narsimulu-G/portfolio`

2. **Configure Environment Variables**:
   - In Vercel project settings, go to "Environment Variables"
   - Add: `VITE_API_BASE` = `https://portfolio-backend-4h8x.onrender.com`

3. **Deploy**:
   - Vercel will automatically detect it's a Vite project
   - Build command: `npm run build`
   - Output directory: `dist`
   - Deploy automatically

### 3. Backend Configuration

Make sure your backend is deployed on Render with:
- CORS enabled for your Vercel domain
- Environment variables properly set
- Database connection working

### 4. Post-Deployment

1. **Test the deployment**:
   - Visit your Vercel URL
   - Check if all API calls work
   - Test admin login functionality

2. **Custom Domain** (Optional):
   - Add your custom domain in Vercel settings
   - Update DNS records as instructed

## Troubleshooting

### Common Issues:

1. **API Connection Failed**:
   - Check if backend is running on Render
   - Verify CORS settings in backend
   - Check environment variables in Vercel

2. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

3. **Environment Variables**:
   - Ensure all required env vars are set in Vercel
   - Use correct variable names (VITE_ prefix for client-side)

### Environment Variables Required:

- `VITE_API_BASE`: Your backend API URL
  - Production: `https://portfolio-backend-4h8x.onrender.com`
  - Development: `http://localhost:4000`
