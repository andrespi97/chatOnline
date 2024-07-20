import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";

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
  doc,
  onSnapshot,
  setDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

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
  return (
    <button className="green" onClick={useSignInWithGoogle}>
      Conéctate con Google
    </button>
  );
}
function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => signOut(auth)}>
        Sign Out
      </button>
    )
  );
}

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat by andrés piñeiro</h1>
      </header>
      <SignOut />
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}
function ChatRoom() {
  const dummy = useRef();
  //hook para almacenar la información de firebase
  const [mensajes, setMensajes] = useState([]);
  const [formValue, setFormValue] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();
    const q = collection(db, "chat");
    const { uid, photoURL } = auth.currentUser;
    await addDoc(q, {
      texto: formValue,
      // Update the timestamp field with the value from the server
      momento: serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    //cogemos colección con filtro o sin filtro
    const q = query(collection(db, "chat"), orderBy("momento", "asc"));
    //Hacemos que cuando cambie la colección
    //onSnapshot: Establece una suscripción en tiempo real a la colección referenciada por q.
    //querySnapshot: Es un objeto que contiene los resultados actuales de la consulta
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const mensajesTemp = [];
      querySnapshot.forEach((doc) => {
        mensajesTemp.push({ id: doc.id, data: doc.data() });
      });
      //actualizar el estado
      setMensajes(mensajesTemp);
    });
    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez, al montar el componente
  useEffect(() => {
    // Imprimir los mensajes cada vez que se actualicen
    console.log(mensajes);
  }, [mensajes]); // Dependencia en mensajes para que el efecto se ejecute solo cuando los mensajes cambien

  return (
    <>
      <div className="margin">
        {mensajes.map((msj) => (
          <MensajeChat key={msj.id} data={msj.data} />
        ))}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        ></input>
        <button type="submit">ENVIAR</button>
      </form>
      <SignOut />
    </>
  );
}
function MensajeChat(props) {
  const { texto, uid, photoURL, momento } = props.data;
  const tipo = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`${tipo} message`}>
      <img src={photoURL} /> <p>{texto}</p>
    </div>
  );
}

export default App;
