import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

function AdminPage() {
  const socketRef = useRef();
  const peerConnection = useRef();
  const [stream, setStream] = useState(null);

  useEffect(() => {
    socketRef.current = io(SERVER_URL);
    socketRef.current.emit('admin-join');

    peerConnection.current = new RTCPeerConnection();

    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', event.candidate);
      }
    };

    peerConnection.current.ontrack = event => {
      setStream(event.streams[0]);
    };

    socketRef.current.on('user-offer', async (offer, userId) => {
      await peerConnection.current.setRemoteDescription(offer);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socketRef.current.emit('admin-answer', answer, userId);
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
      <h2>Admin Page</h2>
      {stream ? (
        <video
          style={{ width: '400px' }}
          playsInline
          autoPlay
          ref={video => {
            if (video && stream) {
              video.srcObject = stream;
            }
          }}
        />
      ) : (
        <p>Waiting for user stream...</p>
      )}
    </div>
  );
}

export default AdminPage;
