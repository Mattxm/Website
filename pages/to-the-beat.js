import { FirebaseError, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollectionData } from "react-firebase-hooks/firestore"

const app = initializeApp({    
    apiKey: "AIzaSyDW1hfoqP2TdoxWS9_mauO-3EGmP2KPnO8",
    authDomain: "beat-d4291.firebaseapp.com",
    projectId: "beat-d4291",
    storageBucket: "beat-d4291.appspot.com",
    messagingSenderId: "198057526075",
    appId: "1:198057526075:web:07e20e8f8772026cf52d1e",
    measurementId: "G-73ETXJF12Y"
});
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();



import { useEffect, useState } from "react";

const beat = () => {
    const [user] = useAuthState(auth);

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider);
    }
    return (
        <>

            <div className="min-h-screen bg-secondary text-white">
                beat
                <div id="playarea" className="bg-red-900 flex flex-col">
                    {user ?
                    <div>
                        <button onClick={()=>auth.signOut()}>
                            sign out
                        </button>
                    </div>
                    :
                    <div>
                        <button onClick={signInWithGoogle}>
                            sign in
                        </button>
                    </div>
                    }
                </div>
            </div>
        </>
        
    );
}

export default beat;