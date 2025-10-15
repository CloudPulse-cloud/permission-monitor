import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000'; // change this if deployed

function UserPage() {
  const socketRef = useRef();
  const peerConnection = useRef();

  useEffect(() => {
    socketRef.current = io(SERVER_URL);

    // Initialize RTCPeerConnection
    peerConnection.current = new RTCPeerConnection();

    // Get media stream from user
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.createOffer()
        .then(offer => peerConnection.current.setLocalDescription(offer))
        .then(() => {
          socketRef.current.emit('user-offer', peerConnection.current.localDescription);
        });
    });

    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', event.candidate);
      }
    };

    socketRef.current.on('admin-answer', answer => {
      peerConnection.current.setRemoteDescription(answer);
    });

    socketRef.current.on('ice-candidate', candidate => {
      peerConnection.current.addIceCandidate(candidate);
    });

    return () => {
      socketRef.current.disconnect();
      peerConnection.current.close();
    };
  }, []);

  return (
    <div>
      <h2>User Page</h2>
      <p>Sharing your camera and microphone... No preview shown here.</p>
    </div>
  );
}

export default UserPage;
