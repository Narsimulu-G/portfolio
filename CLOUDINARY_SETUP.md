# Cloudinary Setup Guide

This guide explains how to set up Cloudinary for image uploads in the portfolio application.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service that provides:
- Automatic image optimization
- Format conversion (WebP, AVIF, etc.)
- Responsive image delivery
- CDN distribution
- Image transformations and effects

## Environment Variables

Add these environment variables to your `.env` file in the backend directory:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Getting Cloudinary Credentials

1. **Sign up for Cloudinary**: Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. **Get your credentials**: 
   - Log into your Cloudinary dashboard
   - Go to the "Dashboard" section
   - Copy your:
     - Cloud Name
     - API Key
     - API Secret

## Features Enabled

### Automatic Image Optimization
- **Format optimization**: Automatically serves WebP/AVIF when supported by the browser
- **Quality optimization**: Uses `auto:good` quality setting for optimal file size
- **Responsive images**: Automatically resizes images to appropriate dimensions

### Image Transformations
- **Max dimensions**: 1200x800 pixels (with aspect ratio preserved)
- **Crop mode**: `limit` - ensures images fit within bounds without cropping
- **Quality**: `auto:good` - balances quality and file size
- **Format**: `auto` - serves optimal format for each browser

### File Organization
- **Folder structure**: All uploads go to `portfolio-uploads/` folder
- **Unique filenames**: Prevents filename conflicts
- **Original filename preservation**: Keeps original names when possible

### Supported Formats
- **Images**: JPG, JPEG, PNG, GIF, WebP, SVG
- **Auto-detection**: Automatically detects file type

## Fallback System

If Cloudinary is not configured or fails:
- **Local storage**: Files are saved to the `uploads/` directory
- **Automatic fallback**: No code changes needed
- **Same API**: Frontend uses the same upload endpoint

## Health Check

Check Cloudinary status at: `GET /api/upload/health`

Response includes:
```json
{
  "status": "ok",
  "cloudinary": "configured",
  "cloudinaryTest": "connected",
  "uploads": "available",
  "storage": "cloudinary",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Usage in Frontend

The upload functionality works the same regardless of storage backend:

```javascript
const formData = new FormData()
formData.append('file', file)

const response = await apiFetch('/api/upload', {
  method: 'POST',
  body: formData
})

if (response.success) {
  console.log('Image URL:', response.url)
  console.log('Provider:', response.provider) // 'cloudinary' or 'local'
}
```

## Benefits of Cloudinary

1. **Performance**: CDN delivery for faster loading
2. **Optimization**: Automatic image compression and format conversion
3. **Scalability**: Handles high traffic without server load
4. **Reliability**: 99.9% uptime SLA
5. **Cost-effective**: Free tier includes 25GB storage and 25GB bandwidth

## Troubleshooting

### Common Issues

1. **"Cloudinary not configured"**
   - Check environment variables are set correctly
   - Restart the server after adding env vars

2. **"Cloudinary connection failed"**
   - Verify API credentials are correct
   - Check if Cloudinary account is active

3. **Uploads falling back to local storage**
   - Check Cloudinary configuration
   - Verify API key and secret are correct

### Debug Steps

1. Check health endpoint: `GET /api/upload/health`
2. Check server logs for Cloudinary errors
3. Verify environment variables in production
4. Test with a simple image upload

## Production Deployment

For production deployment:

1. **Set environment variables** in your hosting platform
2. **Verify Cloudinary account** is not in trial mode
3. **Test uploads** after deployment
4. **Monitor usage** in Cloudinary dashboard

## Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Uploads**: 1,000/month

For higher limits, consider upgrading to a paid plan.
