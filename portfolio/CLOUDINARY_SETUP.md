# Cloudinary Image Upload Setup

This guide will help you set up Cloudinary for image uploads in the admin panel.

## 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloud Name

1. Log into your Cloudinary dashboard
2. Your Cloud Name is displayed at the top of the dashboard
3. Copy this value (e.g., `my-cloud-name`)

## 3. Create an Upload Preset

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `portfolio_uploads`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `portfolio` (optional)
   - **Allowed file types**: `Images`
   - **Max file size**: `5 MB`
   - **Transformations**: Leave default
5. Click **Save**

## 4. Environment Variables

1. Copy `.env.example` to `.env` in your portfolio directory
2. Update the values:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=portfolio_uploads
```

## 5. Features Included

### Image Upload Component
- **Drag & Drop**: Drag images directly onto the upload area
- **Click to Upload**: Click the upload area to select files
- **File Validation**: Only allows image files up to 5MB
- **Preview**: Shows current image with remove option
- **Loading States**: Shows upload progress
- **Error Handling**: Displays helpful error messages
- **Fallback**: Manual URL input as backup

### Integration Points
- **Hero Section**: Profile avatar upload
- **About Section**: About image upload  
- **Project Management**: Project image upload

### Folder Structure
Images are organized in Cloudinary folders:
- `portfolio/avatars/` - Profile images
- `portfolio/about/` - About section images
- `portfolio/projects/` - Project images

## 6. Usage

The ImageUpload component is now integrated into:
- Hero section management (Profile Image)
- About section management (About Image)
- Project management (Project Image)

Each upload area supports:
- Drag and drop functionality
- Click to select files
- Real-time preview
- Error handling
- Manual URL input as fallback

## 7. Security Notes

- Upload presets are unsigned for simplicity
- File size is limited to 5MB
- Only image files are accepted
- Consider adding authentication for production use

## 8. Troubleshooting

### Common Issues:
1. **"Upload failed"**: Check your Cloudinary cloud name and upload preset
2. **CORS errors**: Ensure your upload preset allows unsigned uploads
3. **File too large**: Check file size (max 5MB)
4. **Invalid file type**: Only image files are accepted

### Debug Steps:
1. Check browser console for error messages
2. Verify environment variables are loaded
3. Test upload preset in Cloudinary dashboard
4. Check network tab for failed requests





