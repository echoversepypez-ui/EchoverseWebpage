# Teacher Images Guide

This directory stores teacher profile images that are displayed on the Teachers page. Images are stored locally in the GitHub repository rather than in Supabase storage.

## How to Add Teacher Images

### Step 1: Prepare Your Image
- Image format: **JPG, PNG, WebP** (recommended: JPG or PNG)
- Image size: **500x500px to 1000x1000px** (square images work best)
- File size: Keep under **500KB** for optimal performance
- Name format: Use lowercase, hyphens for spaces (e.g., `john-doe.jpg`, `sarah-johnson.png`)

### Step 2: Upload the Image to This Folder
1. Save your image file to `public/teachers/` directory
2. Example filename: `john-smith.jpg`

### Step 3: Update Teacher Profile in Database

You need to add the `image` field when creating or updating a teacher profile in Supabase:

**When creating a teacher profile:**
```sql
INSERT INTO teacher_profiles (name, email, qualification, image, ...)
VALUES ('John Smith', 'john@example.com', 'MA English, TEFL Certified', 'john-smith.jpg', ...);
```

**When updating an existing teacher profile:**
```sql
UPDATE teacher_profiles
SET image = 'john-smith.jpg'
WHERE id = 'teacher-uuid';
```

**Or via the Admin Panel:**
- Go to Admin Dashboard → Teachers
- Edit a teacher profile
- Add the image filename to the `image` field (e.g., `john-smith.jpg`)

## Image Display Rules

- **Teacher Cards (Grid View):**
  - Displays as 80x80px circular image
  - Falls back to colored avatar with initials if no image is provided

- **Teacher Modal (Detail View):**
  - Displays as 64x64px circular image in header
  - Falls back to colored avatar with initials if no image is provided

## Example Images Structure

```
public/teachers/
├── john-doe.jpg
├── sarah-johnson.png
├── michael-chen.jpg
└── emma-wilson.webp
```

## Testing Images Locally

1. Place your image files in the `public/teachers/` folder
2. Update the teacher profile `image` field in Supabase with the filename
3. Run `npm run dev`
4. Visit the Teachers page at `http://localhost:3000/teachers`
5. Images should appear automatically

## Image Optimization Tips

- **Resize images before uploading**: Use tools like TinyPNG, ImageOptim, or ImageMagick
- **Use appropriate formats**: 
  - JPG for photographs (best compression)
  - PNG for images with transparency
  - WebP for modern browsers (smaller file size)
- **Maintain aspect ratio**: Keep images square (1:1 ratio) for best display

## Troubleshooting

### Image Not Appearing?
1. Check filename spelling matches exactly (case-sensitive)
2. Verify the `image` field in database exactly matches the filename
3. Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
4. Restart development server (`npm run dev`)

### Image Quality Issues?
1. Resize to recommended dimensions (e.g., 800x800px)
2. Compress using an online tool or imagemin
3. Use WebP format for smaller file sizes

### File Size Too Large?
- Compress the image using:
  - Online: TinyPNG.com, Compressor.io
  - CLI: `imagemin input.jpg --out-dir=output`
  - Native: Use Photoshop or Preview (Mac)

## Development vs Production

The image files are stored in the GitHub repository's `public/teachers/` folder. This approach:
- ✅ Keeps images in version control with code
- ✅ Faster loading (served from same server)
- ✅ Works offline during development
- ✅ No additional Supabase storage costs
- ✅ Easy to manage alongside code changes

When deploying to production (Vercel, etc.), the entire `public/` folder is automatically deployed.
