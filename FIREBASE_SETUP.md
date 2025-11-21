# Firebase Setup Guide for TAJAM

This guide will help you set up Firebase for the TAJAM news platform.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `tajam` (or your preferred name)
4. Follow the setup wizard and create the project

## Step 2: Get Your Firebase Credentials

1. In Firebase Console, go to Project Settings (gear icon)
2. Copy your `Web API Key` and other config details
3. Add these to your Vercel project as environment variables (in the Vars section of v0 sidebar):

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

## Step 3: Enable Firebase Services

### Authentication
1. In Firebase Console, go to Authentication
2. Click "Get Started"
3. Enable "Email/Password" provider
4. (Optional) Set up additional providers like Google

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Select region closest to you
4. Start in **Production mode**
5. Create the following collections and security rules:

### Cloud Storage
1. Go to Storage
2. Click "Get Started"
3. Create a bucket in your preferred region

## Step 4: Set Firestore Security Rules

In Firestore Database, go to "Rules" tab and paste:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public read for published content
    match /content/{document=**} {
      allow read: if resource.data.published == true;
      allow write: if request.auth.uid != null && 
                      request.auth.uid == resource.data.authorId;
      allow create: if request.auth.uid != null;
      allow delete: if request.auth.uid != null && 
                       request.auth.uid == resource.data.authorId;
    }
    
    // User profiles
    match /users/{userId} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }
    
    // Categories
    match /categories/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null;
    }
  }
}
\`\`\`

## Step 5: Create Test User

1. In Firebase Console, go to Authentication
2. Click "Add user"
3. Enter email and password
4. This user can now login to the TAJAM dashboard

## Step 6: Create Categories (Optional)

In Firestore Database, add a `categories` collection with documents:

\`\`\`
documents:
- Design
- Editorial
- Technology
- Culture
\`\`\`

## Environment Variables Summary

Make sure all these are in your Vercel project Variables (Vars section):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_BASE_URL`
- `JWT_SECRET`

## Troubleshooting

### Dark Mode Not Working
- Check that ThemeProvider is wrapping your app in layout.tsx
- Clear browser cache and localStorage
- Check browser console for errors

### Firebase Connection Issues
- Verify all environment variables are correct
- Check Firebase project settings
- Ensure CORS is configured if using from different domain

### Authentication Fails
- Confirm user exists in Firebase Authentication
- Check email/password are correct
- Verify security rules allow create operations

## Next Steps

1. Create your first user in Firebase Authentication
2. Log in to the dashboard at `/login`
3. Start uploading articles
4. Articles will appear on the homepage once published
\`\`\`

```typescript file="" isHidden
