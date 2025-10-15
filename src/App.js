import React, { useState, useRef } from 'react';

function App() {
  const [micStatus, setMicStatus] = useState('Unknown');
  const [camStatus, setCamStatus] = useState('Unknown');

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  async function checkPermissions() {
    try {
      const micPerm = await navigator.permissions.query({ name: 'microphone' });
      setMicStatus(micPerm.state);
      micPerm.onchange = () => setMicStatus(micPerm.state);
    } catch {
      setMicStatus('Permission API not supported');
    }

    try {
      const camPerm = await navigator.permissions.query({ name: 'camera' });
      setCamStatus(camPerm.state);
      camPerm.onchange = () => setCamStatus(camPerm.state);
    } catch {
      setCamStatus('Permission API not supported');
    }
  }

  async function requestMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      if (audioRef.current) {
        audioRef.current.srcObject = stream;
        audioRef.current.muted = true; // mute audio to prevent feedback loop
        audioRef.current.play();
      }
      checkPermissions();
    } catch (err) {
      console.error('Error accessing media devices.', err);
      checkPermissions();
    }
  }

  return (
    <div style={{ padding: '2em', fontFamily: 'sans-serif' }}>
      <h1>Permission Monitor with Live Video & Audio</h1>
      <p>Microphone Permission: <b>{micStatus}</b></p>
      <p>Camera Permission: <b>{camStatus}</b></p>
      <button onClick={requestMedia}>Request Microphone & Camera Access</button>
      <p>Click the button to trigger permission prompt and show live feed</p>
      <div>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 400, marginTop: 20 }} />
      </div>
      {/* Optional: To listen to audio input you can add audio element (muted for now) */}
      <audio ref={audioRef} />
    </div>
  );
}

export default App;
