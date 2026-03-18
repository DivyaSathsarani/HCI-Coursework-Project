import {
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  auth,
  isConfigured,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "./firebase";

/**
 * Sign in with Google. Works for both login and signup (Firebase creates account if new).
 * @returns {Promise<{email: string, displayName?: string} | null>} User info or null on error
 */
export async function signInWithGoogle() {
  if (!isConfigured || !auth) {
    return null;
  }
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  return {
    email: user.email,
    displayName: user.displayName,
    uid: user.uid,
  };
}

/**
 * Sign in with Facebook. Works for both login and signup.
 * @returns {Promise<{email: string, displayName?: string} | null>} User info or null on error
 */
export async function signInWithFacebook() {
  if (!isConfigured || !auth) {
    return null;
  }
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  return {
    email: user.email,
    displayName: user.displayName,
    uid: user.uid,
  };
}

/**
 * Sign out from Firebase
 */
export async function signOut() {
  if (auth) {
    await firebaseSignOut(auth);
  }
}

/**
 * Persist user to localStorage (for app compatibility with existing flow)
 */
export function persistUserForApp(email, displayName) {
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userPassword", "oauth-demo");
  localStorage.setItem("loggedIn", "true");
  if (displayName) {
    localStorage.setItem("userDisplayName", displayName);
  }
}

export { isConfigured };
