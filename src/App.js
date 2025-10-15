import React, { useState } from 'react';

function App() {
  const [micStatus, setMicStatus] = useState('Unknown');
  const [camStatus, setCamStatus] = useState('Unknown');

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
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      checkPermissions();
    } catch (err) {
      checkPermissions();
    }
  }

  return (
    <div style={{ padding: '2em', fontFamily: 'sans-serif' }}>
      <h1>Permission Monitor</h1>
      <p>Microphone Permission: <b>{micStatus}</b></p>
      <p>Camera Permission: <b>{camStatus}</b></p>
      <button onClick={requestMedia}>
        Request Microphone & Camera Access
      </button>
      <p>Click the button to trigger permission prompt</p>
    </div>
  );
}

export default App;
