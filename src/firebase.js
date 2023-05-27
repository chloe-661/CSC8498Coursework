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
    arrayUnion, 
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

const getWebStacks = async () => {
    var webStacks = [];
    try {
        const querySnapshot = await getDocs(collection(db, "allTasks", "tNMFllVyNU0EAb9OLFOD", "webStacks"));
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            const x = {
                webStackId: doc.id,
                languages: doc.data().languages,
            }
            webStacks.push(x);
        });
        return webStacks;
    } catch (err) {
        console.error(err);
    }
}

const getWebStacksById = async (webStackId) => {
    try {
        const querySnapshot = await getDoc(doc(db, "allTasks", "tNMFllVyNU0EAb9OLFOD", "webStacks", webStackId));
        let result = {
            languages: querySnapshot.data().languages   
        }

        return result
    } catch (err) {
        console.error(err);
    }
}

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
    }
}

//Gets taskSet info using TaskSetId
const getTaskSet = async (taskSetId) => {
    let taskSet;
    try {
        const q = query(doc(db, "allTasks", "tNMFllVyNU0EAb9OLFOD", "taskSets", taskSetId));
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
    }
}

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
                answers: doc.data().answers,
                answerLines: doc.data().answerLines,
                longDescription: doc.data().longDescription,
                hints: doc.data().hints,
            }
            tasks.push(x);
        });
        return tasks;
    } catch (err) {
        console.error(err);
    }
}

const getTaskName = async (taskSetId, taskId) => {
    var tasks = [];
    try {
        const querySnapshot = await getDoc(doc(db, "allTasks", "tNMFllVyNU0EAb9OLFOD", "taskSets", taskSetId, "tasks", taskId));
        const data = {
            name: querySnapshot.data().name,
            role: querySnapshot.data().role,
            language: querySnapshot.data().language,
        }
        return {
            success: true,
            data: data,
        }
    } catch (err) {
        console.error(err);
    }
}

const getTaskDependanciesDetails = async(taskSetId, dependancies) => {
    let details = []
    
    try {
        if (dependancies.length > 0 ){
            dependancies.forEach(d => {
                const x = getTaskName(taskSetId, d);
                details.push({
                    name: x.data.name,
                    role: x.data.role,
                    language: x.data.language,
                })
            })
            return {
                success: true,
                data: details,
            }
        }
        return {
            sucess: true,
            data: {
                name: "",
                language: "",
                role: "",
            }
        }
    } catch (err) {
        console.error(err);
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
                    answers: t.answers,
                    answerLines: t.answerLines,
                    longDescription: t.longDescription,
                    hints: t.hints,
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

const getUserResults = async (uid) => {
    try {

        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        let tempId;

        if(!querySnapshot.empty) {
            const snapshot = querySnapshot.docs[0]  // use only the first document, but there could be more
            tempId = snapshot.id  
        }

        const q2 = query(collection(db, "users", tempId, "results"));
        const queryShot2 = await getDocs(q2);
        let result = [];

        queryShot2.forEach(doc => {
            result.push(
                {
                    resultId: doc.id,
                    startTime: doc.data().startTime,
                    endTime: doc.data().endTime,
                    webStackId: doc.data().webStackId,
                    taskSetId: doc.data().taskSetId,
                    sessionPeople: doc.data().sessionPeople,
                    role: doc.data().role,
                }
            )
        })

        return result;

    } catch (err){
        console.error(err);
    }
}

const saveSessionDataToUser = async (uid, startTime, endTime, webStackId, taskSetId, sessionPeople, role) => {
    try {

        //Find user doc using uid
        //save that doc.id
        //use that to update
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        let tempId;

        if(!querySnapshot.empty) {
            const snapshot = querySnapshot.docs[0]  // use only the first document, but there could be more
            tempId = snapshot.id  
        }

        const q2 = query(collection(db, "users", tempId, "results"));
        const queryShot2 = await getDocs(q2);
        
        let alreadyAdded = false;
        queryShot2.forEach(doc => {
            if (doc.startTime == startTime){
                alreadyAdded = true;
            }
        })

        if (!alreadyAdded){
            addDoc (collection(db, "users", tempId, "results"), {
                startTime: startTime,
                endTime: endTime,
                webStackId: webStackId,
                taskSetId, taskSetId,
                sessionPeople, sessionPeople,
                role, role,
            });  
        }
    }catch (err){
        console.error(err);
    }
}

const joinSessionInDb = async (inputtedSessionKey, uid) => {   
    try {
        var sessionId;
        
        //Checks for the session
        const q = query(collection(db, "sessions"), where("key", "==", inputtedSessionKey));
        const querySnapshot1 = await getDocs(q);
        if (!querySnapshot1.empty){
            querySnapshot1.forEach((doc) => {
                if (!doc.data().active){
                    return {
                        success: false,
                        errMes: "The session doesn't exist"
                    }  
                }
                else if (doc.data().started){
                    return {
                        success: false,
                        errMes: "You can't join a session that has been started by the leader"
                    }
                }
                else {
                    sessionId = doc.id;
                }
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
            if (querySnapshot2.size < 5) {
                addDoc (collection(db, "sessions", sessionId, "users"), {
                    uid: uid,
                    leader: false,
                    role: [],
                });
            }
        }

        return {
            success: true, //Session joined
            sessionId: sessionId,
        }
    } catch (err) {
        console.error(err);
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
    }
}

const endSessionInDb = async(sessionId, time) => {
    try {
        await updateDoc(doc(db, "sessions", sessionId), {
            active: false,
            endTime: time.toString(),
        });

        return {
            success: true
        }
    } catch (err) {
        console.error(err);
    }
}

const completeSessionInDb = async(sessionId, time) => {
    try {
        await updateDoc(doc(db, "sessions", sessionId), {
            active: false,
            ended: true,
            endTime: time.toString(),
        });

        return {
            success: true
        }
    } catch (err) {
        console.error(err);
    }
}

const deleteSessionInDb = async(sessionId) => {
    try {
        // const request = await deleteDoc(doc(db, "sessions", sessionId));

        const q = query(collection(db, "sessions", sessionId, "users"));
        const q2 = query(collection(db, "sessions", sessionId, "tasks"));
        const querySnapshot = await getDocs(q);
        const querySnapshot2 = await getDocs(q2);

        querySnapshot.forEach(d => {
            deleteDoc(doc(db, "sessions", sessionId, "users", d.id));
        })

        querySnapshot2.forEach(d => {
            deleteDoc(doc(db, "sessions", sessionId, "tasks", d.id));
        })

        // for (let i=0; i < querySnapshot.length; i++){
        //     console.log(querySnapshot[i]);
        //     deleteDoc(doc(db, "sessions", sessionId, "users", querySnapshot[i].id));
        // }

        // for (let j=0; j < querySnapshot2.length; j++){
        //     deleteDoc(doc(db, "sessions", sessionId, "tasks", querySnapshot2[j].id));
        // }

        // await deleteDoc(doc(db, "sessions", sessionId));

        return {
            success: true
        }
    } catch (err) {
        console.error(err);
    }
}

const getUsersInSessionInDb = async(sessionId) => {
    try {
        const request = await getDocs(collection(db, "sessions", sessionId, "users"));

        return request;
    } catch (err) {
        console.error(err);
    }
}

const deleteUserInSessionInDb = async(sessionId, userId) => {
    try {
        const request = await deleteDoc(doc(db, "sessions", sessionId, "users", userId));

        return {
            success: true
        }
    } catch (err) {
        console.error(err);
    }
}

const setUserRoleInDb = async(sessionId, userId, role) => {
    try {
        await updateDoc(doc(db, "sessions", sessionId, "users", userId), {
            role: arrayUnion(role),
        });

        return {
            success: true
        }

    } catch (err) {
        console.error(err);
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
    }
}

//Exports all functions --------------------------------------------------------------------------------------------

export {
    auth,
    db,
    signInWithGoogle,                   //Allows the user to log in using Google
    logInWithEmailAndPassword,          //Allows the user to log in using an email
    registerWithEmailAndPassword,       //Allows the user to register for a new account
    sendPasswordReset,                  //Sends a password reset email
    logout,                             //Logs the user out
    getWebStacks,                       //Gets all the different webstacks available
    getWebStacksById,                   //Gets a specific webstack
    getAllTaskSets,                     //Gets all taskSets
    getTaskSet,                         //Gets a specific taskSet
    getAllTaskSetsAndTasks,             //Gets all sets + the tasks in them
    getAllTaskSetsIdsWithWebStack,      //Gets all task set ids that match a webstack type
    getAllTaskswithinTaskSet,           //Gets all the tasks within a specific taskSet
    startNewSessionInDb,                //Sets up a new session
    startSessionInDb,                   //Marks an already created session as "started"
    joinSessionInDb,                    //Adds a user to an exisiting session
    deleteSessionInDb,                  //Deletes the session
    deleteUserInSessionInDb,            //Deletes a user from a session
    completeSessionInDb,                //Marks an already created session as "completed"
    endSessionInDb,                     //Marks an already created session as "ended"
    setUserRoleInDb,                    //Write the user's role to their profile within the session
    openTaskInDb,                       //Marks a task as "open"/"inuse"
    closeTaskInDb,                      //Marks a task as not "inuse" or "closed"
    completeTaskInDb,                   //Marks a task as "completed"
    cleanUpSessions,                    //Tidies up the database
    getTaskName,                        //Gets the name of a specific task
    getTaskDependanciesDetails,         //Gets the list of dependandies for a specific task
    saveSessionDataToUser,              //Adds the session results to the users account
    getUserResults,                     //Gets all the session results for a specific user
    
};