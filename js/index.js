var changeText = false;
var mode = 'dark-mode';

// Define the URL of the text file containing the quotes
const Quote = document.getElementById("quote");
const quoteFileUrl = '../js/quote.txt';

// Use the fetch API to read the text file
// fetch(quoteFileUrl)
//   .then(response => response.text())
//   .then(quote => {
//     var quote = quote.split('\n').shift();
    
//     // Update the daily-quote element with the new quote
//     if (changeText == true) {
//       Quote.style.fontFamily = "Jetbrains mono";
//       Quote.innerText = quote;
//     }
//   });

  // Import the functions I need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

  // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaC5SgGvSbabQgqLsbx8Td70lAEwTI3Ks",
  authDomain: "my-website-a618f.firebaseapp.com",
  databaseURL: "https://my-website-a618f-default-rtdb.firebaseio.com",
  projectId: "my-website-a618f",
  storageBucket: "my-website-a618f.firebasestorage.app",
  messagingSenderId: "95549700107",
  appId: "1:95549700107:web:0e6f495756995c8635ef0e",
  measurementId: "G-GW18TV45NR"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

var quote = document.getElementById("quote");
var store = document.getElementById("store");

// Get and Set Home Quote
function GetAndSetQuote() {
  const dbRef = ref(db);
  get(child(dbRef, 'quotes/' + store.innerHTML)).then((snapshot) => {
      if (snapshot.exists()) {
          quote.innerHTML = snapshot.val().quote;
      } else {
          console.log("Could not find home quote");
      }
  })
}

// Get quote
function GetHomeQuote() {
  const dbRef = ref(db);
  get(child(dbRef, 'quotes/home_quote_id')).then((snapshot) => {
      if (snapshot.exists()) {
          store.innerHTML = snapshot.val().quote;
          console.log("Successfully received Home Quote!")
          GetAndSetQuote();
      } else {
          console.log("Could not find home quote ID");
      }
  })
}

GetHomeQuote();
