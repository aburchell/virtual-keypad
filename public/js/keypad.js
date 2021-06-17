require("peerjs");
require("../css/keypad.css");
const pressFeedbackURI =
  "data:audio/mpeg;base64,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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSZIIP9BFGHYksMlIAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";

const pressFeedback = new Audio(pressFeedbackURI);

// -- Parameters --
const parseParams = (params) => {
  const font = params.get("font");
  const alphabet = [...new Set(params.get("alphabet").split(""))];
  const peerID = params.get("peerID");
  return [alphabet, font, peerID];
};

// -- Keypad --
const visualFeedbackThenReset = () => {
  // ie grey out keys just after use, to discourage rapid response
  interResponseKeypadMessaging();
  // Setup keys for the next trial
  setTimeout(defaultKeypadMessaging, 1000);
};
const defaultKeypadMessaging = () => {
  // Set-up an instruction/welcome message for the user
  const header = document.getElementById("keypad-header");
  header.innerText = "Please respond by pressing a key.";

  // Make each button pressable
  const buttons = document.getElementsByClassName("response-button");
  [...buttons].forEach((element) => {
    element.classList.remove("unpressable", "noselect");
  });
};
const interResponseKeypadMessaging = () => {
  // Change header text to reflect WAIT message
  const header = document.getElementById("keypad-header");
  header.innerText =
    "Please fix your gaze on the + mark on your computer screen.";

  // Then make each button unpressable
  const buttons = document.getElementsByClassName("response-button");
  [...buttons].forEach((element) => {
    element.classList.add("unpressable", "noselect");
  });
};
const responseButtonHandler = (button, alphabet, font, conn, peer) => {
  // If sound is still playing from previous press, stop and reset it
  if (!pressFeedback.paused) {
    pressFeedback.pause();
    pressFeedback.currentTime = 0;
  }
  // Start playing feedback sound, ie just a 'beep'
  pressFeedback.play();

  // Send response message to experimentClient
  const message = {
    message: "Keypress",
    sendId: peer.id,
    recvId: conn.peer,
    response: button.id,
    timeSent: Date.now(),
    elapsedStartToSend: Date.now() - window.startTime,
  };
  /**
   * Send a signal via the peer connection to indicate keypress.
   * This will only occur if the connection is still alive.
   */
  if (conn && conn.open) {
    conn.send(JSON.stringify(message));
    console.log("Keypress sent: ", JSON.stringify(message));
  } else {
    console.log("Connection is closed");
  }

  const visualResponseFeedback = false;
  // Update keypad after a period of visible non-responsivity (ie ITI)
  if (visualResponseFeedback) {
    visualFeedbackThenReset(alphabet, font);
  }
};
const populateKeypad = (alphabet, font, conn, peer) => {
  console.log("DEBUG I should be populating keyboard.");
  // Set-up an instruction/welcome message for the user
  const header = document.getElementById("keypad-header");
  header.innerText = "Please respond by pressing a key.";
  // Get the keypad element
  const remoteControl = document.getElementById("keypad");
  // Set correct font for button labels
  remoteControl.style.fontFamily = font;
  // Remove previous buttons
  remoteControl.innerHTML = "";
  // Create new buttons
  alphabet.forEach((symbol) =>
    createButton(symbol, alphabet, font, conn, peer)
  );
};
const createButton = (symbol, alphabet, font, conn, peer) => {
  // Create a response button for this symbol
  let button = document.createElement("a");
  button.id = symbol;
  button.className = "response-button";

  // Set behavior for press
  button.addEventListener("touchend", (e) => {
    /* prevent delay and simulated mouse events */
    e.preventDefault();
    e.target.click();
  });
  button.addEventListener("click", () => {
    responseButtonHandler(button, alphabet, font, conn, peer);
  });

  // Create a label for the button
  let buttonLabel = document.createElement("span");
  buttonLabel.classList.add("response-button-label", "noselect");
  buttonLabel.innerText = symbol;

  // Add the label to the button
  button.appendChild(buttonLabel);
  // Add the labeled-button to the HTML
  document.querySelector("#keypad").appendChild(button);
};

export function keypad() {
  window.startTime = Date.now();
  var lastPeerId = null;
  var peer = null; // own peer object
  var conn = null;
  var alphabet = null;
  var font = null;
  var recvId = null; // peer id of the receiving page

  /**
   * Create the Peer object for our end of the connection.
   *
   * Sets up callbacks that handle any events related to our
   * peer object.
   */
  function initialize() {
    const keypadElem = document.createElement("div");
    keypadElem.setAttribute("id", "keypad");
    const keypadHeader = document.createElement("div");
    keypadHeader.setAttribute("id", "keypad-header");
    keypadElem.appendChild(keypadHeader);
    document.getElementsByTagName("main")[0].appendChild(keypadElem);

    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
      debug: 2,
    });

    // Get parameters for this keypad, from uri query
    [alphabet, font, recvId] = parseParams(
      new URLSearchParams(window.location.search)
    );
    console.log('alphabet: ', alphabet);
    console.log('font: ', font);
    console.log('recvID: ', recvId);

    peer.on("open", function (id) {
      // Workaround for peer.reconnect deleting previous id
      if (peer.id === null) {
        console.log("Received null id from peer open");
        peer.id = lastPeerId;
      } else {
        lastPeerId = peer.id;
      }

      console.log("Sender (my) ID: " + peer.id);
      console.log("Receiver (experiment) ID: " + recvId);

      join();
    });
    peer.on("connection", function (c) {
      // Disallow incoming connections
      c.on("open", function () {
        c.send("Sender does not accept incoming connections");
        setTimeout(function () {
          c.close();
        }, 500);
      });
    });
    peer.on("disconnected", function () {
      console.log("Connection lost. Please reconnect");
      // Workaround for peer.reconnect deleting previous id
      peer.id = lastPeerId;
      peer._lastServerId = lastPeerId;
      peer.reconnect();
    });
    peer.on("close", function () {
      conn = null;
      console.log("Connection destroyed. Please refresh.");
    });
    peer.on("error", function (err) {
      console.log(err);
      alert("" + err);
    });
  }

  /**
   * Create the connection between the two Peers.
   *
   * Sets up callbacks that handle any events related to the
   * connection and data received on it.
   */
  function join() {
    // Close old connection
    if (conn) {
      conn.close();
    }
    // Create connection to destination peer specified by the query param
    console.log(recvId);
    conn = peer.connect(recvId, {
      reliable: true,
    });

    conn.on("open", function () {
      populateKeypad(alphabet, font, conn, peer);
      console.log("Connected to: " + conn.peer);
    });
    // Handle incoming data (messages only since this is the signal sender)
    conn.on("data", function (data) {
      if (!data.hasOwnProperty("alphabet") || !data.hasOwnProperty("font")) {
        // TODO how do I correctly throw an error?
        console.log(
          'Error in parsing data received! Must set "alphabet" and "font" properties'
        );
      } else {
        conn.close(); // VERIFY is this the right way to close connection?
        let newParmas = {
          alphabet: alphabet,
          font: font,
          peerID: conn.peer,
          // 'recvId': recvId // VERIFY This SHOULD be the same as peerID??
        };
        let queryString = Object.keys(newParams)
          .map((key) => key + "=" + newParams[key])
          .join("&");
        // VERIFY does this reload the page cleanly/sustainably/correctly?
        window.location.search = queryString;
      }
    });
    conn.on("close", function () {
      console.log("Connection closed");
    });
  }
  // Since all our callbacks are setup, start the process of obtaining an ID
  initialize();
}
