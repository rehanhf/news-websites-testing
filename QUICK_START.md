# TAJAM Firebase CMS - Quick Start Guide

## What We've Built

You now have a complete full-stack news platform with:
- Dark/Light mode toggle (fixed and working)
- Firebase Authentication for authors
- Firestore database for content management
- Firebase Storage for image uploads
- Real-time CMS dashboard
- Responsive design for all devices

## Step 1: Set Environment Variables

Click the "Vars" section in the left sidebar and add these Firebase credentials:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here-change-in-production
\`\`\`

**To get these values:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project called "tajam"
3. Go to Project Settings (gear icon)
4. Under "Your apps", click the web app icon
5. Copy the `firebaseConfig` object values

## Step 2: Enable Firebase Services

### Authentication
1. In Firebase Console, click "Authentication" in the left menu
2. Click "Get Started"
3. Enable "Email/Password" authentication
4. Click "Enable"

### Firestore Database
1. Click "Firestore Database" in the left menu
2. Click "Create database"
3. Select a region close to you
4. Choose **Production mode**
5. Wait for database to initialize

### Cloud Storage
1. Click "Storage" in the left menu
2. Click "Get Started"
3. Select a region close to you
4. Accept defaults and create

## Step 3: Create Firestore Security Rules

1. In Firestore Database, click the "Rules" tab
2. Replace all content with:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /content/{document=**} {
      allow read: if resource.data.published == true;
      allow write: if request.auth.uid != null && 
                      request.auth.uid == resource.data.authorId;
      allow create: if request.auth.uid != null;
      allow delete: if request.auth.uid != null && 
                       request.auth.uid == resource.data.authorId;
    }
    
    match /users/{userId} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }
    
    match /categories/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null;
    }
  }
}
\`\`\`

3. Click "Publish"

## Step 4: Set Cloud Storage Rules

1. In Storage, click the "Rules" tab
2. Replace with:

\`\`\`
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid != null;
    }
  }
}
\`\`\`

3. Click "Publish"

## Step 5: Create Your First User

1. In Firebase Authentication, click "Add user"
2. Enter an email and password (you'll use this to login)
3. Click "Add user"

## Step 6: Test Your Setup

1. In v0, click "Publish" (top right) to deploy
2. Go to your published site
3. Click the moon icon (top right) to test dark mode - it should toggle between light and dark!
4. Click "Login" in the header
5. Enter the email and password you created in Step 5
6. You should see the Dashboard with tabs for "My Articles" and "New Article"

## Creating Your First Article

1. Click "New Article" tab
2. Fill in:
   - **Title**: Your article title
   - **Category**: Choose from Design, Editorial, Technology, Culture
   - **Excerpt**: A brief summary
   - **Tags**: Comma-separated keywords (optional)
   - **Thumbnail**: Upload an image for the article
   - **Content**: Your full article text
3. Click "Publish Article"
4. Go back to the homepage - your article should appear!

## Key Features

- **Dark Mode**: Fixed! Click the moon/sun icon to toggle. Your preference is saved.
- **Upload Images**: Drag and drop or click to upload article thumbnails
- **Edit Articles**: Click the pencil icon next to any article to edit
- **Delete Articles**: Click the trash icon to remove articles
- **Real-time Publishing**: Articles appear on the homepage immediately
- **Automatic Tags**: Tags are extracted from your content (you can override them)

## Troubleshooting

### Dark mode still not working?
- Clear browser cache (Ctrl+Shift+Delete)
- Clear localStorage: Open DevTools → Console → `localStorage.clear()`
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### Can't log in?
- Make sure user exists in Firebase Authentication
- Check email/password is correct
- Verify Authentication is enabled in Firebase Console

### Articles not appearing?
- Check that "published" is true
- Verify Firestore has data (check Firebase Console)
- Check browser console for errors (F12)

### Image upload fails?
- Check Storage bucket exists and is initialized
- Verify Storage rules allow writes
- Check image file size (should be under 5MB)

### Environment variables not working?
- Make sure you're in the "Vars" section of v0 sidebar
- Prefix variables with `NEXT_PUBLIC_` for client-side access
- Restart/redeploy after adding variables

## Next Steps

1. Customize categories in Firestore
2. Add more authors by creating new Firebase users
3. Set up custom domain in Vercel
4. Add social sharing buttons
5. Set up analytics

## Need Help?

- Firebase docs: https://firebase.google.com/docs
- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs
