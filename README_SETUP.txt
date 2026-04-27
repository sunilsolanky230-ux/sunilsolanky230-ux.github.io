SUNIL SOLANKY PORTFOLIO ADMIN - SETUP GUIDE
===========================================

What this ZIP contains:
- index.html              Public portfolio page
- style.css               Public portfolio styling
- script.js               Public portfolio scrolling/menu logic
- dynamic-data.js         Loads projects and education from Firebase Firestore
- firebase-config.js      Paste your Firebase config here
- admin.html              Admin login + dashboard
- admin.css               Admin dashboard styling
- admin.js                Admin CRUD logic
- FIRESTORE_RULES.txt     Secure rules to paste in Firebase

Why Firebase is used:
GitHub Pages is static hosting. It cannot run Python/Flask backend code directly.
Firebase Auth + Firestore lets your static portfolio have secure admin login and live editable data.

STEP 1 - Create Firebase Project
1. Open Firebase Console.
2. Create a project, for example: sunil-portfolio-admin.
3. Add a Web App.
4. Copy the Firebase config.

STEP 2 - Update firebase-config.js
Open firebase-config.js and replace:
- PASTE_YOUR_API_KEY_HERE
- PASTE_YOUR_PROJECT_ID
- PASTE_YOUR_MESSAGING_SENDER_ID
- PASTE_YOUR_APP_ID

Keep ADMIN_EMAIL as:
sunilsolanky230@gmail.com

STEP 3 - Enable Firebase Login
1. Firebase Console > Authentication.
2. Click Get Started.
3. Enable Email/Password.
4. Add a user with your admin email and password.

STEP 4 - Enable Firestore
1. Firebase Console > Firestore Database.
2. Create database.
3. Start in production mode.
4. Choose any nearby region.

STEP 5 - Add Firestore Security Rules
Open FIRESTORE_RULES.txt.
Copy the full rules.
Paste them into Firebase Console > Firestore Database > Rules.
Publish the rules.

STEP 6 - Upload to GitHub
Replace your current GitHub Pages files with all files from this ZIP.
Push changes:

git add .
git commit -m "Add Firebase admin dashboard to portfolio"
git push origin main

STEP 7 - Open Admin Page
After GitHub Pages updates, open:
/admin.html

Login with the Firebase admin user.
Click "Insert Default Data" once.
Then add/edit/delete projects and education from the dashboard.

Important Notes:
- Do not hardcode a password in JavaScript.
- Your Firebase apiKey is not a password. The Firestore rules protect your database.
- Only your admin email can create, update, or delete content.
- Everyone can read Projects and Education so your portfolio can display them publicly.
