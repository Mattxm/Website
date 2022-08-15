import { FirebaseError, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore/lite';
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollectionData } from "react-firebase-hooks/firestore"
import fbConfig from "../components/fbconfig"

const app = initializeApp(fbConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const scoresRef = collection(db, "scores");
const scoresSnap = await getDocs(scoresRef)


import { useEffect, useState } from "react";

function ScoreHistory() {
    return (
        <>
            a
        </>
    );
};

const beat = () => {
    const [user] = useAuthState(auth);


    useEffect(() => {
      console.log(scoresSnap)
    }, [scoresSnap])
    

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
                    prev stores
                    <div>
                        {ScoreHistory()}
                    </div>
                </div>
            </div>
        </>
        
    );
}



export default beat;