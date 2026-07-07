import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAlvVk2kf5AVJVT9fULW_MyStkPU52LSsE",
  authDomain: "eic-24f38.firebaseapp.com",
  projectId: "eic-24f38",
  storageBucket: "eic-24f38.appspot.com",
  messagingSenderId: "327674153043",
  appId: "1:327674153043:web:54b48a6a877440d2fc9ea6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const storageRef = ref(storage, 'test.txt');
const fileContent = new TextEncoder().encode("hello world");

uploadBytes(storageRef, fileContent)
  .then((snapshot) => {
    console.log("Uploaded successfully!", snapshot);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Upload failed!", error);
    process.exit(1);
  });
