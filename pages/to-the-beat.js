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



import { useEffect, useState } from "react";
import { async } from '@firebase/util';

const beat = () => {
    /*
    const [User] = useAuthState(auth);
    const scoresRef = collection(db, "scores");

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider);
    }
    return (
        <>

            <div className="min-h-screen bg-secondary text-white">
                beat
                <div id="playarea" className="bg-red-900 flex flex-col">
                    {User ?
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
                        
                    </div>
                </div>
            </div>
        </>
        
    );
    */
   return (
    <>
        wip
    </>
   )
}



export default beat;