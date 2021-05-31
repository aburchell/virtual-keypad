let startTime, conn;

// -- Parameters --
const parseParams = (params) => {
    const font = params.get('font');
    const alphabet = [...new Set(params.get('alphabet').split(''))];
    const peerID = params.get('peerID');
    return [font, alphabet, peerID]
};

// -- Connection --
const establishPeerConnection = (peer, meID, params) => {
    console.log('DEBUG In establishPeerConnection()');
    const [font, alphabet, peerID] = parseParams(params);
    startTime = Date.now();
    peer.on('error', handlePeerError);
    const connectionPayload = {
        'message': 'Hello! Connection made.',
        'keypadClientID': meID,
        'experimentServerID': peerID,
        'timeSent': Date.now(),
        'elapsedStartToSend': Date.now() - startTime
    };
    const connectOptions = {label: `ExperimentClient-{peerID}`,
                            metadata: connectionPayload,
                            serialization: 'json'}

    // Connection with the experiment client
    conn = peer.connect(peerID, connectOptions);

    // Connection ready to use
    const handleOpen = (id) => {
        conn.send(JSON.stringify(connectionPayload));
        // Set up keypad for use
        populateKeypad(alphabet=alphabet, font=font);
        // Just a personal check of our understanding
        if (id == peerID) {
            console.log('Good job, your understanding of experimentClient peer ID is correct!', id, peerID);
        } else {
            console.log('Uh oh, id != peerID', id, peerID);
        }
    };
    conn.on('open', handleOpen);

    // Receive data from experimentClient, ie get new keypad params
    const handleReceive = (data) => {
        console.log('Received data from experimentServer: ', data);

        // TODO check if data is saying experiment has ended, ie to close
        if ((!data.hasOwnProperty('alphabet')) || (!data.hasOwnProperty('font'))) {
            console.log('Error in parsing data received! Must set "alphabet" and "font" properties');
        } else {
            // Stay on the same page, change keys (url params now out-of-sync)
            // populateKeypad(data.alphabet, data.font);

            // Redirect to the correct page
            conn.close();
            let newParams = {'alphabet': data.alphabet, 'font': data.font, 'peerID': peerID};
            let queryString = Object.keys(newParams)
                                    .map(key => key + '=' + newParams[key])
                                    .join('&');
            window.location.search = queryString;
        }
    };
    conn.on('data', handleReceive);
    // Handle errors with connection appropriately
    // TODO try to reconnect if there is a resolvable problem with connection
    conn.on('error', handleConnError);
    conn.on('close', handleClose);
};
const handleConnError = (err) => {
    console.log('Uh oh! Error with connection: ', err);
};
const handleClose = () => {
    console.log('Connection with experimentClient closed!');
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
    const header = document.getElementById('remote-header');
    header.innerText = 'Please respond by pressing a key.';

    // Make each button pressable
    const buttons = document.getElementsByClassName('response-button');
    [...buttons].forEach(element => {
        element.classList.remove('unpressable', 'noselect');
    });
};
const interResponseKeypadMessaging = () => {
    // Change header text to reflect WAIT message
    const header = document.getElementById('remote-header');
    header.innerText = 'Please fix your gaze on the + mark on your computer screen.';

    // Then make each button unpressable
    const buttons = document.getElementsByClassName('response-button');
    [...buttons].forEach(element => {
        element.classList.add('unpressable', 'noselect');
    });
};
const responseButtonHandler = (button) => {
    // Start playing feedback sound, ie just a 'beep'
    pressFeedback.play();
    // Not sure if necessary, but stop playing the sound after a set time
    setTimeout(() => {
        pressFeedback.pause();
        pressFeedback.currentTime = 0;
    }, 500);

    // Send response message to experimentClient
    const message = {
        'message': 'Keypress',
        'keypadClientID': meID,
        'experimentClientID': peerID,
        'response': button.id,
        'timeSent': Date.now(),
        'elapsedStartToSend': Date.now() - startTime};
    conn.send(JSON.stringify(message));

    // Update keypad after a period of visible non-responsivity (ie ITI)
    visualFeedbackThenReset(alphabet, font);
};
const populateKeypad = (alphabet, font) => {
    // Set-up an instruction/welcome message for the user
    const header = document.getElementById('remote-header');
    header.innerText = 'Please respond by pressing a key.';
    // Get the remote-control element
    const remoteControl = document.getElementById('remote-control');
    // Set correct font for button labels
    remoteControl.style.fontFamily = font;
    // Remove previous buttons
    remoteControl.innerHTML = '';
    // Create new buttons
    alphabet.forEach((symbol) => createButton(symbol, alphabet, font));
};
const createButton = (symbol) => {
    // Create a response button for this symbol
    let button = document.createElement('a');
    button.id = symbol;
    button.className = 'response-button';

    // Set behavior for press
    button.addEventListener('touchend', (e) => {
        /* prevent delay and simulated mouse events */
        e.preventDefault();
        e.target.click();});
    button.addEventListener('click', () => responseButtonHandler(button));

    // Create a label for the button
    let buttonLabel = document.createElement('span');
    buttonLabel.classList.add('response-button-label', 'noselect');
    buttonLabel.innerText = symbol;

    // Add the label to the button
    button.appendChild(buttonLabel);
    // Add the labeled-button to the HTML
    remoteControl.appendChild(button);
};

// -- Peer --
const handlePeerError = (err) => {
    console.log('Uh oh! Error with peer: ', err);
};
