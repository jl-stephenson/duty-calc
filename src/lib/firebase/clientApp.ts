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
import {
  getAuth,
  connectAuthEmulator,
  Auth,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import { firebaseConfig } from "./firebase.config";

let firebaseApp: FirebaseApp;
let firestoreDb: Firestore;
let firebaseFunctions: Functions;
let firebaseAuth: Auth;

function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  }
  return firebaseApp;
}

function getFirestoreDb(): Firestore {
  if (!firestoreDb) {
    firestoreDb = getFirestore(getFirebaseApp());

    if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
      if (window.location.hostname === "localhost") {
        connectFirestoreEmulator(firestoreDb, "localhost", 8080);
        console.log("Connected to Firestore emulator at localhost:8080");
      }
    }
  }
  return firestoreDb;
}

function getFirebaseFunctions(): Functions {
  if (!firebaseFunctions) {
    firebaseFunctions = getFunctions(getFirebaseApp());

    if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
      if (window.location.hostname === "localhost") {
        connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);
        console.log("Connected to Functions emulator at localhost:5001");
      }
    }
  }
  return firebaseFunctions;
}

function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp());

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

function initAnonymousAuth() {
  const auth = getFirebaseAuth();
  console.log("initAnonymous called");

  if (auth.currentUser) {
    console.log("User already signed in:", auth.currentUser.uid);
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth)
        .then((credential) => {
          console.log("User signed in anonymously:", credential.user.uid);
        })
        .catch((error) => {
          console.error("Anonymous sign-in error:", error);
        });
    }
  });
}

const isDevelopment = () => process.env.NODE_ENV === "development";

export {
  getFirebaseApp,
  getFirestoreDb,
  getFirebaseFunctions,
  getFirebaseAuth,
  initAnonymousAuth,
  isDevelopment,
};
