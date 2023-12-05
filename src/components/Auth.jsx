import React, { useEffect, useState } from "react";
import { auth, gooleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { db, storage } from "../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [movieList, setMovieList] = useState([]);

  //new movies to add
  const [newtitle, setNewTitle] = useState("");
  const [newreleaseDate, setNewReleaseDate] = useState(0);
  const [newreceivedAnOscar, setNewReceivedAnOscar] = useState(false);
  //update title
  const [updatedTitle, setUpdatedTitle] = useState("");
  //upload file
  const [uploadfile, setUploadFile] = useState(null);
  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, gooleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const movieCollectionRef = collection(db, "movies");
  useEffect(() => {
    const getMovieList = async () => {
      try {
        const data = await getDocs(movieCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMovieList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getMovieList();
  }, [movieList]);

  const onSubmit = async () => {
    try {
      await addDoc(movieCollectionRef, {
        title: newtitle,
        releaseDate: newreleaseDate,
        receivedAnOscar: newreceivedAnOscar,
        userId: auth?.currentUser.uid,
      });
    } catch (err) {
      console.error(err);
    }
  };
  const deleteMovie = async (id) => {
    const movie = doc(db, "movies", id);
    await deleteDoc(movie);
  };
  const updateMovie = async (id) => {
    const movie = doc(db, "movies", id);
    await updateDoc(movie, { title: updatedTitle });
  };

  const uploadFile = async () => {
    if (!uploadfile) return;
    if (!auth.currentUser) {
      alert("Please sign in first");
      return;
    }
    const fileRef = ref(storage, `projectFiles/${uploadfile.name}`);
    try {
      await uploadBytes(fileRef, uploadfile);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <input
        type="email"
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password..."
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>sign in</button>
      <button onClick={signInWithGoogle}>sign in with google</button>
      <button onClick={logOut}>logout</button>
      <div>
        <input
          type="text"
          placeholder="title..."
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="release date..."
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          onChange={(e) => setNewReceivedAnOscar(!newreceivedAnOscar)}
        />
        <label>received an oscar</label>
        <button onClick={onSubmit}>add movie</button>
      </div>

      <h1>Movies</h1>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete movie</button>
            <input
              type="text"
              placeholder="update title..."
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovie(movie.id)}>Update Title</button>
          </div>
        ))}
      </div>
      <div>
        <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default Auth;
