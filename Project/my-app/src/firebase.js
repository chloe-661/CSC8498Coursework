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
    doc,
    getDoc,
    getDocs,
    deleteDoc,
    collection,
    where,
    addDoc,
    updateDoc,
    onSnapshot,
    arrayUnion, 
    arrayRemove, 
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

//Gets taskSet info using TaskSetId
const getTaskSet = async (taskSetId) => {
    let taskSet;
    try {
        const q = query(doc(db, "allTasks", "tNMFllVyNU0EAb9OLFOD", "taskSets", "2rZdId43DTc2Mrgrt2kG"));
        const querySnapshot = await getDoc(q);

        taskSet = {
            taskId: querySnapshot.id,
            roles: querySnapshot.data().roles,
            senarioDescription: querySnapshot.data().senarioDescription,
            webStackId: querySnapshot.data().webStackId,
        }
        
        // querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log("loop");
        //     taskSet = {
        //         taskId: doc.id,
        //         roles: doc.data().roles,
        //         senarioDescription: doc.data().senarioDescription,
        //         webStackId: doc.data().webStackId,
        //     }
        // });
        return taskSet;
    } catch (err) {
        console.error(err);
        // alert(err.message);
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
                questions: doc.data().questions,
                answers: doc.data().questions,
                answerLines: doc.data().answerLines,
                longDescription: doc.data().longDescription,
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

const startNewSessionInDb = async (sessionKey, taskSetId, uid) => {      
    try {
        const dbRef = collection(db, "sessions");

        const q = query(collection(db, "sessions"), where("key", "==", sessionKey));
        const querySnapshot = await getDocs(q);

        let result = {
            success: true
        };

        //If the session key already exists in the database
        //It will delete all session that are no longer active
        //Or it will tell us that it already exists
        if (!querySnapshot.empty){
            querySnapshot.forEach((d) => {
                if (!d.data().active){
                    //Cleans up
                    deleteDoc(doc(db, "sessions", d.id));
                }
                else {
                    result.success = false;
                    result.errMes = "Key is already in use";
                }
            });
        }

        //If we now know that there is an active session using this key
        if (!result.success){
            return result;
        }

        //Otherwise, go ahead and make the session
        var tempId;
        await addDoc(dbRef, {
            key: sessionKey,
            active: true,
            started: false,
            ended: false,
            taskSetId: taskSetId,
        })
        .then(dbRef => {
            tempId=dbRef.id;
        });

        if (tempId != null){
            await addDoc (collection(db, "sessions", tempId, "users"), {
                uid: uid,
                leader: true,
                role: [],
            });

            const dbRef = collection(db, "sessions", tempId, "tasks")
            var tasks =  await getAllTaskswithinTaskSet(taskSetId);
            tasks.forEach((t) => {
                addDoc (dbRef, {
                    taskId: t.taskId,
                    content: t.content,
                    description: t.description,
                    language: t.language,
                    name: t.name,
                    type: t.type,
                    role: t.role,
                    taskDependancies: t.taskDependancies,
                    completed: false,
                    inUse: false,
                    questions: t.questions,
                    answers: t.questions,
                    answerLines: t.answerLines,
                    longDescription: t.longDescription,
                });
            });
        }
        return {
            success: true,
            sessionId: tempId,
        }
    } catch (err) {
        console.error(err);
    }
}

const joinSessionInDb = async (inputtedSessionKey, uid) => {   
    try {
        console.log(uid);
        console.log(inputtedSessionKey);
        var sessionId;
        
        //Checks for the session
        const q = query(collection(db, "sessions"), where("key", "==", inputtedSessionKey));
        const querySnapshot1 = await getDocs(q);
        if (!querySnapshot1.empty){
            console.log(querySnapshot1.size);
            querySnapshot1.forEach((doc) => {
                if (!doc.data().active){
                    console.log("session isn't active");
                    return {
                        success: false,
                        errMes: "The session doesn't exist"
                    }  
                }
                else if (doc.data().started){
                    console.log("session is started");
                    return {
                        success: false,
                        errMes: "You can't join a session that has been started by the leader"
                    }
                }
                else {
                    sessionId = doc.id;
                }
                console.log(doc.data());
            });
        }
        else {
            return {
                success: false,
                errMes: "The session doesn't exist"
            }
        }

        const q2 = query(collection(db, "sessions", sessionId, "users"));
        const querySnapshot2 = await getDocs(q2);

        //Checks to see if the user is already in the session
        const q3 = query(collection(db, "sessions", sessionId, "users"), where("uid", "==", uid));
        const querySnapshot3 = await getDocs(q3);
        if (querySnapshot3.empty){
            console.log("1");
            if (querySnapshot2.size < 5) {
                console.log("helllllllllllllllllllllllllll");
                addDoc (collection(db, "sessions", sessionId, "users"), {
                    uid: uid,
                    leader: false,
                    role: [],
                });
            }
        }
        console.log("2");

        return {
            success: true, //Session joined
            sessionId: sessionId,
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const startSessionInDb = async (sessionId) => {
    try {      
        await updateDoc(doc(db, "sessions", sessionId), {
            started: true,
            startTime: (Date.now()).toString(),
        });

        return {
            success: true
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const endSessionInDb = async(sessionId) => {
    try {
        await updateDoc(doc(db, "sessions", sessionId), {
            active: false,
            endTime: (Date.now()).toString(),
        });

        return {
            success: true
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const deleteSessionInDb = async(sessionId) => {
    try {
        const request = await deleteDoc(doc(db, "sessions", sessionId));

        return {
            success: true
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const getUsersInSessionInDb = async(sessionId) => {
    try {
        const request = await getDocs(collection(db, "sessions", sessionId, "users"));

        return request;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const deleteUserInSessionInDb = async(sessionId, userId) => {
    try {
        console.log("Deleting");
        const request = await deleteDoc(doc(db, "sessions", sessionId, "users", userId));

        return {
            success: true
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const setUserRoleInDb = async(sessionId, userId, role) => {
    try {
        console.log("user: " + userId);
        console.log("role: " + role);
        await updateDoc(doc(db, "sessions", sessionId, "users", userId), {
            role: arrayUnion(role),
        });

        return {
            success: true
        }

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const openTaskInDb = async (sessionId, taskId) => {
    try {
        await updateDoc(doc(db, "sessions", sessionId, "tasks", taskId), {
            inUse: true
        });

        return {
            success: true
        }

    } catch (err) {
        console.error(err);
        // alert(err.message);
    }
}

const closeTaskInDb = async (sessionId, taskId) => {
    try {
        await updateDoc(doc(db, "sessions", sessionId, "tasks", taskId), {
            inUse: false
        });

        return {
            success: true
        }

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const completeTaskInDb = async (sessionId, taskId) => {
    try {
        await updateDoc(doc(db, "sessions", sessionId, "tasks", taskId), {
            inUse: false,
            completed: true
        });

        return {
            success: true
        }

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const cleanUpSessions = async () => {
    try {
        // const q = query(collection(db, "sessions"));
        // const querySnapshot = await getDocs(q);
        // let ids = []

        // querySnapshot.forEach(d => {
        //     if (!d.data().active){
        //         const users = getUsersInSessionInDb(d.id) 
        //         users.forEach(u => {
        //             deleteDoc(doc(db, "sessions", d.id, "users", u.id));
        //         })
                
        //     }
        // })

        // const q2 = query(collection(db, "sessions", d.id, "users"));
        // const querySnapshot2 = getDocs(q2);

        // deleteDoc(doc(db, "sessions", d.id));


        console.log("RUNNING DATABASE CLEAN UP");
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
    getTaskSet,
    getAllTaskSets,
    getAllTaskSetsAndTasks,
    getAllTaskSetsIdsWithWebStack,
    getAllTaskswithinTaskSet,
    startNewSessionInDb,
    startSessionInDb,
    joinSessionInDb,
    deleteSessionInDb,
    deleteUserInSessionInDb,
    endSessionInDb,
    setUserRoleInDb,
    openTaskInDb,
    closeTaskInDb,
    completeTaskInDb,
    cleanUpSessions,
};