import { 
    initializeApp 
} from "firebase/app"

import {
    getFirestore, collection, 
    onSnapshot, addDoc, deleteDoc, doc,
    query, where, orderBy, serverTimestamp, 
    getDocs, getDoc, updateDoc
} from "firebase/firestore"

import { 
    getAuth, createUserWithEmailAndPassword, deleteUser,
    signInWithEmailAndPassword, signOut, onAuthStateChanged,
    updateProfile
} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyA6XeoKaS-ojgA1krw70cMTp1zeUVN2JUI",
    authDomain: "cooper-coop.firebaseapp.com",
    projectId: "cooper-coop",
    storageBucket: "cooper-coop.appspot.com",
    messagingSenderId: "222015740997",
    appId: "1:222015740997:web:67eb0f08b92963c533172c",
    measurementId: "G-WQQN6BLMS4"
}

initializeApp(firebaseConfig)

// Initialize Database Services
const database = getFirestore()

// Collection Reference
const jobs = collection(database, "jobs")
const users = collection(database, "users")

// Query Rule Example
const rule = where("company", "==", "Papa John's")

// Ordering Example
const order = orderBy("rQualifications", "asc")

// For some reason, cannot use where & orderBy together below.
// Querying the Collection Using a Query Rule
const querier = query(jobs, order)

// Updating Available Info When Data Matching
// Query Rule Gets an Update.
const unsubscribeJobs = onSnapshot(querier, (snapshot) => {
    let results = []
    snapshot.docs.forEach((doc) => {
        if (doc.get("company") == "Papa John's") {
            results.push({ 
                ...doc.data(),
                id: doc.id
            })
        }
    })
    console.log(results)
})

// Grabbing a single "doc", i.e. a single row of the jobs collection.
const jobReference = doc(database, "jobs", "ZveOZbeqKt3N8G07wI4R")

// Show the grabbed info in console. You can listen for updates by calling onSnapshot on the jobReference object.
// getDoc(jobReference)
//     .then((job) => {
//         console.log(job.data(), job.id)
//     })

const unsubscribeJob = onSnapshot(jobReference, (doc) => {
    console.log(doc.data(), doc.id)
})

// Grab the Job Form.
const addJobForm = document.querySelector(".add")

// Because I import this code into pages where it
// is not currently needed. This could be adjusted.
// If you don't import this code into a page that
// has no element classed "addJobForm", you won't need
// to worry about verifying that addJobForm has a
// value (at least probably not).
if (addJobForm != null) {

    addJobForm.addEventListener("submit", (event) => {
        event.preventDefault()

        addDoc(jobs, {
            company: addJobForm.company.value,
            title: addJobForm.title.value,
            pay: addJobForm.pay.value,
            description: addJobForm.description.value,
            rQualifications: addJobForm.rQualifications.value,
            pQualifications: addJobForm.pQualifications.value,
            creationTimestamp: serverTimestamp()
        })
            .then(() => {
                addJobForm.reset()
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                setText("feedback", "Error adding job.")
            })
    })

}

const deleteJobForm = document.querySelector(".delete")

if (deleteJobForm != null) {

    deleteJobForm.addEventListener("submit", (event) => {
        event.preventDefault()

        const target = doc(database, "jobs", deleteJobForm.id.value)

        deleteDoc(target)
            .then(() => {
            deleteJobForm.reset()  
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                setText("feedback", "Error deleting job.")
            })
    })

}

// Basic process of updating a job's description. 
// Any other field of the document (i.e., any column 
// of a row of the database table) can be updated the same way.
const updateJobForm = document.querySelector(".update")

if (updateJobForm != null) {

    updateJobForm.addEventListener("submit", (event) => {
        event.preventDefault()

        const jobReference = doc(database, "jobs", updateJobForm.id.value)

        updateDoc(jobReference, {
            description: "WAZZAAAAAAAAH!"
        })
    })

}

/**
 * SIGN UP PROCESS
 */

// Attaining authorization to log in or out.
const auth = getAuth()

// Tracking a user.
var active = "None"

// Creating a user.
const signupForm = document.querySelector(".signup")

if (signupForm != null) {

    signupForm.addEventListener("submit", (event) => {
        event.preventDefault()
    
        let name = signupForm.name.value
        let email = signupForm.email.value
        let password = signupForm.password.value
        let seeker = signupForm.seeker.checked
        let poster = signupForm.poster.checked

        if (password == signupForm.confirmation.value) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user
                    active = userCredential.user

                    setText("feedback", "You have signed up, " + name + "!")

                    updateProfile(user, {
                        displayName: name
                    })
                        .then(() => {
                            console.log("Updated name and ", seeker)
                        }).catch((error) => {
                            console.log("Error! You failed!")
                        })

                    addDoc(users, {
                        uid: user.uid,
                        name: name,
                        email: email,
                        seeker: seeker,
                        poster: poster
                    })
                        .then(() => {
                            addText("feedback", "Added user data.")
                        })
                        .catch((error) => {
                            const errorCode = error.code
                            const errorMessage = error.message
                            setText("feedback", "Error adding user data.")
                        })

                    // location.href = 'user.html'

                })
                .catch((error) => {
                    console.log(error.message)
                    console.log(error.code)
                    informUser(error.code)
                })
        } else {
            setText("feedback", "Your passwords do not match!")
        }
    
    })

}

// Logging into a user.
const signinForm = document.querySelector(".signin")

if (signinForm != null) {

    signinForm.addEventListener("submit", (event) => {
        event.preventDefault()
    
        let email = signinForm.email.value
        let password = signinForm.password.value

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                active = userCredential.user
                setText("feedback", "You have signed in, " + user.email + "!")
                location.href = 'user.html'
            })
            .catch((error) => {
                console.log(error.message)
                console.log(error.code)
                informUser(error.code)
            })
    
    })

}

// Signing out of a user.
const signoutButton = document.querySelector(".signout")

if (signoutButton != null) {
    signoutButton.addEventListener("click", () => {
        signOut(auth)
            .then((response) => {
                console.log("User signed out.")
                console.log(response)
            })
            .catch((error) => {
                console.log(error.message)
            })
    })
}

// Checking whether a user is logged into the site.
if (typeof user != "undefined") {
    setText("feedback", "I think you're already logged into this site!")
}

// Deleting a user.
const deleteAccountForm = document.querySelector(".deleteAccount")

if (deleteAccountForm != null) {

    deleteAccountForm.addEventListener("submit", (event) => {
        event.preventDefault()
    
        let password = deleteAccountForm.password.value

        if (password == deleteAccountForm.confirmation.value) {
            deleteUser(auth.currentUser)
                .then((response) => {
                    active = "None"
                    setText("feedback", "You have deleted your account!")
                })
                .catch((error) => {
                    const errorCode = error.code
                    const errorMessage = error.message
                    console.log(error.message)
                    console.log(error.code)
                    setText("feedback", "Could not delete account.")
                })
        } else {
            setText("feedback", "Your passwords do not match!")
        }
    
    })

}

const seekerCheckbox = grab("input[name=seeker]")
const posterCheckbox = grab("input[name=poster]")

if (seekerCheckbox) {
    seekerCheckbox.addEventListener('change', function() {

        if (this.checked) {
            posterCheckbox.checked = false
        }

    })
}

if (posterCheckbox) {
    posterCheckbox.addEventListener('change', function() {

        if (this.checked) {
            seekerCheckbox.checked = false
        }

    })
}

// Subscribing to Auth Changes

const unsubscribeAuthState = onAuthStateChanged(auth, (user) => {
    
    if (user == null) { return }
    
    console.log(user)

    const userReference = doc(database, "users", "FsrgVoykBQuVzeyW47IV")
    const displayName = user.displayName
    const uid = user.uid

    getDocs(query(users, where("uid", "==", uid)))
        .then((result) => {
            console.log(auth.currentUser)
            console.log(displayName)
            console.log(result)

            if (result.size && result.docs[0].exists()) {

                const seeker = result.docs[0].data().seeker
                const poster = result.docs[0].data().poster

                if (seeker) {
                    setText("seekerWelcome", "Welcome back, " + displayName)
                } else if (poster) {
                    setText("posterWelcome", "New jobs to post, " + displayName + "?")
                }

            }
        })

    console.log('User status changed: ', user.displayName)
    console.log(user)
})

// Async docSnap use; seems to work, but promises are fine.
async function thisTest(userReference) {

    const docSnap = await getDoc(userReference)
    console.log(docSnap)

}

// Unsubscribe to All (Auth & Firestore) Changes

const unsubscribeButton = document.querySelector('.unsubscribe')

if (unsubscribeButton) {
        
    unsubscribeButton.addEventListener('click', () => {
        console.log("Unsubscribing")
        unsubscribeAuthState()
        unsubscribeJobs()
        unsubscribeJob()
    })

}

/** 
 * Helpers
 */

function informUser(code) {

    switch(code) {
        case "auth/wrong-password":
            setText("feedback", "Wrong password.")
            break
        case "auth/user-not-found":
            setText("feedback", "That user does not exist.")
            break
        case "auth/weak-password":
            setText("feedback", "Sorry, that password is not strong enough.")
            break
        case "auth/email-already-in-use":
            setText("feedback", "An existing account already uses that email address.")
            break
        default:
            setText("feedback", "A caught error prevented signup.")
    }

}

function setText(id, newText) {
    var element = document.getElementById(id)
    if (element == null) { return }
    element.innerHTML = newText
}

function addText(id, newText) {
    var element = document.getElementById(id)
    if (element == null) { return }
    var currentText = element.innerHTML
    element.innerHTML = currentText + "<br>" + newText
}

function grab(selector) {
    return document.querySelector(selector)
}