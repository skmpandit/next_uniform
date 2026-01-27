// src/auth/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, functions } from "@/firebase";
import { httpsCallable } from "firebase/functions";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, type User, } from "firebase/auth";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

type SignUpInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type SignInInput = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  initializing: boolean;
  signUp: (input: SignUpInput) => Promise<User>;
  signIn: (input: SignInInput) => Promise<User>;
  signOutUser: () => Promise<void>;
  subscribeNewsLetter: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (fbUser) => {
    setUser(fbUser ?? null);
    setInitializing(false);

    if (!fbUser) return;

    try {
      const ref = doc(db, "users", fbUser.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        const [firstName, ...rest] = (fbUser.displayName || "").split(" ");
        if(auth.currentUser) {
          await auth.currentUser.getIdToken(true);
        }
        await setDoc(ref, {
          uid: fbUser.uid,
          email: fbUser.email,
          firstName: firstName || "",
          lastName: rest?.join(" ") || "",
          displayName: fbUser.displayName || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err: any) {
      if (err?.code === "permission-denied") {
        console.warn(
          "Firestore rules are blocking /users access for this user. Verify your rules for `users/{uid}`."
        );
      } else {
        console.error("Ensure Firestore profile failed:", err);
      }
      // Do not rethrow; avoid uncaught promise rejection
    }
  });
  return () => unsub();
  }, []);

  const signUp = async ({ firstName, lastName, email, password }: SignUpInput): Promise<User> => {
    // Firebase Auth securely hashes the password; you never store it.
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    const displayName = [firstName, lastName].filter(Boolean).join(" ").trim();
    if (displayName) {
      try {
        await updateProfile(cred.user, { displayName });
      } catch(e) {
        console.warn("Update Profile Failed", e);
      }
    }

    if(auth.currentUser) {
      await auth.currentUser.getIdToken(true);
    }
    // Create user profile document
  
    try {
        await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email,
        firstName,
        lastName,
        displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch(e) {
      console.error("Error creating user profile", e);
    }

    return cred.user;
  };

  const signIn = async ({ email, password }: SignInInput) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const signOutUser = () => signOut(auth);

  // Newsletter
  const subscribeNewsLetter = async ( rawEmail: string) => {
    const email = rawEmail.trim().toLowerCase();
    if(!email || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid Email");
    }
    try {
      await addDoc(collection(db, "newsletter"), {
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } catch(err: any) {
      console.error("SubscribeNewsLetter Error:", err?.code, err?.message, err);
      throw err;
    }
  }

  const value: AuthContextType = { user, initializing, signUp, signIn, signOutUser, subscribeNewsLetter };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
