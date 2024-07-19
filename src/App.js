import "./App.css";
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithRedirect,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  Timestamp,
  addDoc,
  serverTimestamp,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { doc, onSnapshot, setDoc, query, where } from "firebase/firestore";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function SignIn() {
  const useSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const resultado = await signInWithPopup(auth, provider);
    const usuario = resultado.user;
    const credential = GoogleAuthProvider.credentialFromResult(resultado);
    const token = credential.accessToken;
    console.log(auth.currentUser);
  };
  return <button onClick={useSignInWithGoogle}>Conéctate con Google</button>;
}
function SignOut() {
  return (
    auth.currentUser && <button onClick={() => signOut(auth)}>Sign Out</button>
  );
}

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <SignOut></SignOut>
      <SignIn />
      <header className="App-header">
        <p>{user ? "logged" : "unlogged"}</p>
      </header>
      <ChatRoom />
      {/* <section>{user ? <ChatRoom /> : }</section> */}
    </div>
  );
}
function ChatRoom() {
  const q = collection(db, "chat");
  const mensajes = [];
  const unsubscribe = onSnapshot(q, (capturaMensajes) => {
    capturaMensajes.forEach((msj) => {
      mensajes.push(msj.data());
      return (
        <div>
          <p>hola</p>
          <MensajeChat></MensajeChat>
        </div>
      );
    });
  });
  console.log(mensajes);

  // return (
  //   <>
  //     <div>
  //       {onSnapshot(doc(mensajes), (msj) => {
  //         <ChatMessage key={msj.id} texto={msj.texto} />;
  //       })}
  //     </div>
  //     <form onSubmit={sendMessage}>
  //       <input
  //         value={formValue}
  //         onChange={(e) => setFormValue(e.target.value)}
  //       ></input>
  //       <button type="submit">ENVIAR</button>
  //     </form>
  //   </>
  // );
}
function MensajeChat(props) {
  const { texto, uid, photoURL } = props.data;
  const tipo = uid === auth.currentUser.uid ? "sent" : "recieved";
  return (
    <div className={"${tipo}"}>
      <p>hola</p>
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
};
export default App;
