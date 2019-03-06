'use strict';

const vid = document.getElementById('vid');

let peer = null;

function progress(message) {
    console.info(`--- ${message} ---`);
}

navigator.mediaDevices
    .getUserMedia({
        audio: false,
        video: true
    })
    .then(start)
    .catch(e => alert(`getUserMedia() error: ${e}`));

function start(stream) {
    vid.srcObject = stream;

    progress("new RTCPeerConneciton");
    peer = new RTCPeerConnection(null);

    peer.onicecandidate = e => {
        progress("onicecandidate");
        console.log(`ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
        if (event.candidate) {
            let textArea = document.getElementById("ice-candidates");
            textArea.value += event.candidate.candidate + "\n";
        }
        else {
            updateOffer();
        }
    }

    progress("addTrack");
    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    progress("createOffer");
    peer.createOffer().then(
        onOfferCreated,
        e => console.log(`Failed to create session description: ${e}`)
    );
}

function onOfferCreated(desc) {
    progress("setLocalDescription");
    peer.setLocalDescription(desc).then(
        e => console.log('localDescription success.'),
        e => console.log(`Failed to set setLocalDescription: ${e}`)
    );
}

function updateOffer() {
    let desc = peer.localDescription;
    document.getElementById("offer-sdp").value = desc.sdp;
    console.log(`Offer to rx\n${desc.sdp}`);
}

function onAnswerSdpButton() {
    let textArea = document.getElementById('answer-sdp');
    let desc = new RTCSessionDescription({
        type : 'answer',
        sdp : textArea.value,
    });
    console.log(`answer from rx\n${desc.sdp}`);
    progress("setRemoveDescription");
    peer.setRemoteDescription(desc);
}

document.getElementById("answer-sdp-button").addEventListener("click", onAnswerSdpButton);
document.getElementById("ice-candidates").value = "";
document.getElementById('offer-sdp').value = "";
document.getElementById('answer-sdp').value = "";
