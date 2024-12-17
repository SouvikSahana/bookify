import { initializeApp } from "firebase/app";
import {getFirestore} from  "firebase/firestore"
import { getStorage } from "firebase/storage";
import {getAuth} from "firebase/auth"
import firebaseConfig from "./credential";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db= getFirestore(app)
const authGet=getAuth(app)
const storage = getStorage(app);

export default db
export {authGet, storage}