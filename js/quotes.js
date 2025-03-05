  // Import the functions I need from the SDKs
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAaC5SgGvSbabQgqLsbx8Td70lAEwTI3Ks",
    authDomain: "my-website-a618f.firebaseapp.com",
    projectId: "my-website-a618f",
    storageBucket: "my-website-a618f.firebasestorage.app",
    messagingSenderId: "95549700107",
    appId: "1:95549700107:web:0e6f495756995c8635ef0e"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db  = getDatabase(app);

  // --------------------------|
  // Get Quote Count variables
  var quote_count = document.getElementById("quote-count");

  // Get Home Quote variables
  var home_quote = document.getElementById("home-quote");
  var store = document.getElementById("store");

  function getQuoteCount() {
    const dbRef = ref(db);
    get(child(dbRef, 'quotes/quote_count')).then((snapshot) => {
        if (snapshot.exists()) {
            quote_count.innerHTML = snapshot.val().count;
            GetAndSetQuote();
        } else {
            console.log("Could not find quote count");
        }
    })
  }

  getQuoteCount();

  // --------------------------|
  // Get and Set Home Quote
  function GetAndSetQuote() {
    const dbRef = ref(db);
    get(child(dbRef, 'quotes/' + store.innerHTML)).then((snapshot) => {
        if (snapshot.exists()) {
            home_quote.innerHTML = snapshot.val().quote;
        } else {
            console.log("Could not find home quote...");
        }
    })
  }
  // Get quote Id
  function GetHomeQuote() {
    const dbRef = ref(db);
    get(child(dbRef, 'quotes/home_quote_id')).then((snapshot) => {
        if (snapshot.exists()) {
            store.innerHTML = snapshot.val().quote;
            console.log("Successfully received Home Quote Id!")
            GetAndSetQuote();
        } else {
            console.log("Could not find home quote ID");
        }
    })
  }

  GetHomeQuote();

  // View quote variables
  var quote = document.getElementById("quote");
  var view_quote_id = document.getElementById("view-quote-id");
  var view_quote_btn = document.getElementById("view-quote-btn");

  // Send quote variables
  var send_quote_id = document.getElementById("send-quote-id");
  var quote_to_send = document.getElementById("quote-to-send");
  var send_quote_btn = document.getElementById("send-quote-btn");

  // Delete quote variables
  var delete_quote_id = document.getElementById("delete-quote-id");
  var delete_quote_btn = document.getElementById("delete-quote-btn");

  // Set Home quote variables
  var set_home_quote_id = document.getElementById("set-home-quote-id");
  var set_home_quote_btn = document.getElementById("set-home-quote-btn");

  // Set Quote Count variables
  var send_quote_count = document.getElementById("send-quote-count");
  var send_quote_count_btn = document.getElementById("send-quote-count-btn");

  

  // View quote
  function viewquote() {
    get(child(ref(db), 'quotes/' + view_quote_id.value))
    .then((snapshot) => {
        if (snapshot.exists()) {
            quote.innerHTML = snapshot.val().quote;
        } else {
            console.log("No data available");
            alert("Quote not found!");
        }
    })
  }

  view_quote_btn.addEventListener("click", viewquote);

  // Send Quote
  function sendQuote() {
    if (quote_to_send.value != "") {
        set(ref(db, 'quotes/' + send_quote_id.value), {
            quote: quote_to_send.value
        });
            alert("'" + quote_to_send.value + "' was stored in id: " + send_quote_id.value + " successfully!");
    }
  }

  send_quote_btn.addEventListener("click", sendQuote);

  // Send Quote
  function deleteQuote() {
    if (delete_quote_id.value != "") {
        set(ref(db, 'quotes/' + delete_quote_id.value), {
            quote: null
        });
            alert("The quote in id: " + delete_quote_id.value + " was deleted successfully!");
    }
  }

  delete_quote_btn.addEventListener("click", deleteQuote);

  // Set Home Quote
  function setHomeQuote() {
      if (set_home_quote_id.value != "") {
      set(ref(db, 'quotes/home_quote_id'), {
          quote: set_home_quote_id.value
      });
        alert("Home quote id was successfully set to: " + set_home_quote_id.value + " !");
        GetHomeQuote();
    }
  }

  set_home_quote_btn.addEventListener("click", setHomeQuote);

  // Set Quote Count
  function sendQuoteCount() {
      if (send_quote_count.value != "") {
      set(ref(db, 'quotes/quote_count'), {
          count: send_quote_count.value
      });
        alert("Quote count was successfully set to: " + send_quote_count.value + " !");
        getquotecount();
    }
  }

  send_quote_count_btn.addEventListener("click", sendQuoteCount);