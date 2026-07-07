const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "test",
  projectId: "eic-web",
};
// We need to use admin sdk or standard sdk. Wait, I don't have the real firebase config.
