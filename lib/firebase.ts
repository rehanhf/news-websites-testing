import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCKLOe1hp_RmoAQmPU_l4C0NqG_XSXsbSQ",
  authDomain: "database-test-b50aa.firebaseapp.com",
  projectId: "database-test-b50aa",
  storageBucket: "database-test-b50aa.firebasestorage.app",
  messagingSenderId: "864335423664",
  appId: "1:864335423664:web:d061ee2ca555e58fa3b375",
  measurementId: "G-L9QFTMCG31"
}

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
