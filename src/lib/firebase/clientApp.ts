import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  getFunctions,
  connectFunctionsEmulator,
  Functions,
} from "firebase/functions";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { firebaseConfig } from "./firebase.config";

// Lazy initialization variables
let firebaseApp: FirebaseApp;
let firestoreDb: Firestore;
let firebaseFunctions: Functions;
let firebaseAuth: Auth;

/**
 * Gets the Firebase App instance, initializing it if necessary.
 */
function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  }
  return firebaseApp;
}

/**
 * Gets the Firestore instance, initializing it if necessary.
 */
function getFirestoreDb(): Firestore {
  if (!firestoreDb) {
    firestoreDb = getFirestore(getFirebaseApp());

    // Connect to emulator if in development
    if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
      // Only connect if not already connected
      if (window.location.hostname === "localhost") {
        connectFirestoreEmulator(firestoreDb, "localhost", 8080);
        console.log("Connected to Firestore emulator at localhost:8080");
      }
    }
  }
  return firestoreDb;
}

/**
 * Gets the Firebase Functions instance, initializing it if necessary.
 */
function getFirebaseFunctions(): Functions {
  if (!firebaseFunctions) {
    firebaseFunctions = getFunctions(getFirebaseApp());

    // Connect to emulator if in development
    if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
      if (window.location.hostname === "localhost") {
        connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);
        console.log("Connected to Functions emulator at localhost:5001");
      }
    }
  }
  return firebaseFunctions;
}

/**
 * Gets the Firebase Auth instance, initializing it if necessary.
 */
function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp());

    // Connect to emulator if in development
    if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
      if (window.location.hostname === "localhost") {
        connectAuthEmulator(firebaseAuth, "http://localhost:9099", {
          disableWarnings: true,
        });
        console.log("Connected to Auth emulator at localhost:9099");
      }
    }
  }
  return firebaseAuth;
}

// Custom hook for checking if we're in development environment
const isDevelopment = () => process.env.NODE_ENV === "development";

export {
  getFirebaseApp,
  getFirestoreDb,
  getFirebaseFunctions,
  getFirebaseAuth,
  isDevelopment,
};
