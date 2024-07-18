import "./App.css";
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  collection,
  Timestamp,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { func } from "prop-types";

const firebaseConfig = {
  apiKey: "AIzaSyAFnDIS-RaJz6onzwc3FJhxN1GRpK9QLDA",
  authDomain: "onlinechat-3d1c7.firebaseapp.com",
  projectId: "onlinechat-3d1c7",
  storageBucket: "onlinechat-3d1c7.appspot.com",
  messagingSenderId: "510886869500",
  appId: "1:510886869500:web:1f6cda4cc09d436a7f1a79",
  measurementId: "G-V83Q1Q4J5V",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function SignIn() {
  const useSignInWithGoogle = () => {
    const provider = new app.auth.GoogleAuthProvider();
    auth.useSignInWithPopup(provider);
  };
  return <button onClick={useSignInWithGoogle}>Conéctate con Google</button>;
}
function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut}>Sign Out</button>
  );
}

function App() {
  const user = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">hello</header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}
function ChatRoom() {
  const mensajes = doc(db, "chat", "mensajes");
  setDoc(mensajes, {
    momento: serverTimestamp(),
    texto: "hola Andres!",
  });

  const [formValue, setFormValue] = useState("");

  return (
    <>
      <div>
        {onSnapshot(doc(mensajes), (msj) => {
          <ChatMessage key={msj.id} texto={msj.texto} />;
        })}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        ></input>
        <button type="submit">ENVIAR</button>
      </form>
    </>
  );
}
function ChatMessage(props) {
  const { text, uid, photoURL } = props.mensaje;
  const tipo = uid === auth.currentUser.uid ? "sent" : "recieved";
  return (
    <div className={"message ${tipo}"}>
      <p>{text}</p>
    </div>
  );
}
const sendMessage = async (e) => {
  e.preventDefault();
  const { uid, photoURL } = auth.currentUser;
  const mensajes = doc(db, "chat", "mensajes");

  // Update the timestamp field with the value from the server
  const updateTimestamp = await updateDoc(mensajes, {
    momento: serverTimestamp(),
  });

  await addDoc(collection(db, "chat"), {
    momento: "12 jul 2024",
    texto: "hola Andres!",
  });
};
export default App;
