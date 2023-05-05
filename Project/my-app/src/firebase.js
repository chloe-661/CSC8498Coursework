import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
  } from "firebase/auth";
  import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
  } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyChGQDzXMAlc11Df5pY9am5gPc3y7ZoDeM",
    authDomain: "csc8498-87aa2.firebaseapp.com",
    projectId: "csc8498-87aa2",
    storageBucket: "csc8498-87aa2.appspot.com",
    messagingSenderId: "766128888595",
    appId: "1:766128888595:web:0b69a8b19c5a1bee5098e6",
    measurementId: "G-KF9HT7ZZGE"
  };

// Initialize Firebase --------------------------------------------------------------------------------------------
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

//Google --------------------------------------------------------------------------------------------
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

//Email & Password --------------------------------------------------------------------------------------------
const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

//Log out --------------------------------------------------------------------------------------------

const logout = () => {
    signOut(auth);
};

//Tasks ---------------------------------------------------------------------------------------------

//Gets all the different webstacks available
const getWebStacks = async () => {
    var webStacks = [];
    try {
        const querySnapshot = await getDocs(collection(db, "allTasks", "tNMFllVyNU0EAb9OLFOD", "webStacks"));
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            const x = {
                webStackId: doc.id,
                languages: doc.data()
            }
            webStacks.push(x);
        });
        return webStacks;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

//Gets all task set ids that match a webstack type
const getAllTaskSetsIdsWithWebStack = async (webStackId) => {
    var taskSets = [];
    try {
        const q = query(collection(db, "allTasks", "tNMFllVyNU0EAb9OLFOD", "taskSets"), where("webStackId", "==", webStackId));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            const x = {
                taskSetId: doc.id,
                webStackId: doc.data().webStackId,
            }
            taskSets.push(x);
        });
        return taskSets;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

//Gets all task sets but NOT the tasks within
const getAllTaskSets = async () => {
    var taskSets = [];
    try {
        const querySnapshot = await getDocs(collection(db, "allTasks", "tNMFllVyNU0EAb9OLFOD", "taskSets"));
        
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            const x = {
                taskId: doc.id,
                roles: doc.data().roles,
                senarioDescription: doc.data().senarioDescription,
                webStackId: doc.data().webStackId,
            }
            taskSets.push(x);
        });
        return taskSets;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

//Gets all sets + the tasks in them
const getAllTaskSetsAndTasks = async () => {
    var taskSets = [];
    try {
        const querySnapshot = await getDocs(collection(db, "allTasks", "tNMFllVyNU0EAb9OLFOD", "taskSets"));
        
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            const x = {
                taskSetId: doc.id,
                roles: doc.data().roles,
                senarioDescription: doc.data().senarioDescription,
                webStackId: doc.data().webStackId,
                tasks: getAllTaskswithinTaskSet(doc.id),
            }
            taskSets.push(x);
        });
        return taskSets;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

//Gets all the tasks within a task set
//Only gets the task information
const getAllTaskswithinTaskSet = async (taskSetId) => {
    var tasks = [];
    try {
        const querySnapshot = await getDocs(collection(db, "allTasks", "tNMFllVyNU0EAb9OLFOD", "taskSets", taskSetId, "tasks"));
        
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            const x = {
                taskId: doc.id,
                name: doc.data().name,
                description: doc.data().description,
                language: doc.data().language,
                role: doc.data().role,
                type: doc.data().type,
                taskDependancies: doc.data().taskDependancies,
                content: doc.data().content,
            }
            tasks.push(x);
        });
        return tasks;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

// Sessions ----------------------------------------------------------------------------------------------------

const startSessionInDb = async (sessionKey, taskSetId, uid, userRole) => {      
    try {
        const dbRef = collection(db, "sessions");
        var tempId;
        await addDoc(dbRef, {
            key: sessionKey,
            active: true,
            started: false,
            taskSetId: taskSetId,
        })
        .then(dbRef => {
            tempId=dbRef.id;
        });

        if (tempId != null){
            await addDoc (collection(db, "sessions", tempId, "users"), {
                uid: uid,
                role: userRole,
                leader: true,
            });

            const dbRef = collection(db, "sessions", tempId, "tasks")
            var tasks =  await getAllTaskswithinTaskSet(taskSetId);
            tasks.forEach((t) => {
                addDoc (dbRef, {
                    taskId: t.taskId,
                    role: t.role,
                    taskDependancies: t.taskDependancies,
                    completed: false,
                });
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
      }
}

const joinSessionInDb = async (sessionKey, taskSetId, uid, userRole) => {   
    try {

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

//Exports all functions --------------------------------------------------------------------------------------------

export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    getWebStacks,
    getAllTaskSets,
    getAllTaskSetsAndTasks,
    getAllTaskSetsIdsWithWebStack,
    getAllTaskswithinTaskSet,
    startSessionInDb,
};