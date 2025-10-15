import React, { useState, useRef, useEffect } from 'react';
import UserPage from './UserPage';
import AdminPage from './AdminPage';

function App() {
  const [view, setView] = useState('home'); // home, user, admin

  // States and refs from your existing permission monitor
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

  useEffect(() => {
    if (view === 'home') {
      async function requestMedia() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          if (audioRef.current) {
            audioRef.current.srcObject = stream;
            audioRef.current.muted = true;
            audioRef.current.play();
          }
          checkPermissions();
        } catch (err) {
          checkPermissions();
        }
      }
      requestMedia();
    }
    // eslint-disable-next-line
  }, [view]);

  return (
    <div style={{ padding: '2em', fontFamily: 'sans-serif' }}>
      <h1>Muhh M Lega</h1>

      {view === 'home' && (
        <>
          <p>M De: <b>{micStatus}</b></p>
          <p>C De: <b>{camStatus}</b></p>

          <div>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 400, marginTop: 20 }} />
          </div>
          <audio ref={audioRef} />

          <div style={{ marginTop: '1em' }}>
            <button onClick={() => setView('user')} style={{ marginRight: 10 }}>
              Go To Manali
            </button>
            <button onClick={() => setView('admin')}>
              Go To Bermo
            </button>
          </div>
        </>
      )}

      {view === 'user' && (
        <>
          <button onClick={() => setView('home')} style={{ marginBottom: '1em' }}>
            Back to Home
          </button>
          <UserPage />
        </>
      )}

      {view === 'admin' && (
        <>
          <button onClick={() => setView('home')} style={{ marginBottom: '1em' }}>
            Back to Home
          </button>
          <AdminPage />
        </>
      )}
    </div>
  );
}

export default App;
