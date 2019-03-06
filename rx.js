'use strict';

const vid = document.getElementById('vid');

let peer = new RTCPeerConnection(null);

function progress(message) {
    console.info(`--- ${message} ---`);
}

peer.onicecandidate = e => {
    progress("onicecandidate");
    console.log(`ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    if (event.candidate) {
        let textArea = document.getElementById("ice-candidates");
        textArea.value += event.candidate.candidate + "\n";
    }
}

peer.ontrack = e => {
    progress("ontrack");
    console.log('onTrack');
    if (vid.srcObject !== e.streams[0]) {
        vid.srcObject = e.streams[0];
        console.log('Received remote stream');
    }
}

function onOfferSdpButton() {
    let textArea = document.getElementById("offer-sdp");
    let desc = new RTCSessionDescription({
        type : 'offer',
        sdp : textArea.value,
    });
    console.log(`Offer from tx\n${desc.sdp}`);

    progress("setRemoteDescription");
    peer.setRemoteDescription(desc);
    
    progress("createAnswer");
    peer.createAnswer().then(
        onAnswerCreated,
        e => console.log(`Failed to createAnswer: ${e()}`)
    );
}

function onAnswerCreated(desc) {
    progress("setLocalDescription");
    peer.setLocalDescription(desc).then(
        e => console.log('localDescription success.'),
        e => console.log(`Failed to set setLocalDescription: ${e}`)
    );
    updateAnswer(desc);
}

function updateAnswer(desc) {
    console.log(`Answer to tx\n${desc.sdp}`);
    let textArea = document.getElementById("answer-sdp");
    textArea.value = desc.sdp;
}

document.getElementById("ice-candidates").value = "";
document.getElementById('answer-sdp').value = "";
document.getElementById('offer-sdp').value = "";
document.getElementById("offer-sdp-button").addEventListener("click", onOfferSdpButton);
