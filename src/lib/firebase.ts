/* Firebase Auth adapter (optional alternative to the demo login).
   1) npm i firebase
   2) fill NEXT_PUBLIC_FIREBASE_* in .env.local
   3) uncomment below and call fbSignIn() from the login page. */

// import { initializeApp, getApps } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
//
// const config = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// };
// const app = getApps().length ? getApps()[0] : initializeApp(config);
// export const fbSignIn = (email: string, pass: string) =>
//   signInWithEmailAndPassword(getAuth(app), email, pass);

export const firebaseReady = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
