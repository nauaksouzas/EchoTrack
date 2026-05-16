import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({ prompt: 'select_account' });

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export async function signInWith(providerName: 'google' | 'microsoft' | 'apple') {
  const provider =
    providerName === 'google' ? googleProvider :
    providerName === 'microsoft' ? microsoftProvider :
    appleProvider;
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    return {
      idToken,
      email: result.user.email,
      name: result.user.displayName,
      photoURL: result.user.photoURL,
      provider: providerName,
    };
  } catch (err: any) {
    if (err.code === 'auth/operation-not-allowed') {
      throw new Error(`${providerName} sign-in is not enabled. Use Google or email/password.`);
    }
    if (err.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in window closed.');
    }
    throw err;
  }
}
