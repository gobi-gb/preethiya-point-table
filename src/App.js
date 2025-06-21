import React, { useState, useEffect } from 'react';
import { db, ref, onValue, set } from './firebase';
import './App.css';

function App() {
  const [view, setView] = useState('login');
  const [isGuest, setIsGuest] = useState(false);
  const [players, setPlayers] = useState([]);
  const [newName, setNewName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lastDeletedPlayer, setLastDeletedPlayer] = useState(null);

  // Load login state from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('loginState'));
    if (saved?.view === 'app') {
      setView('app');
      setIsGuest(saved.isGuest);
    }
  }, []);

  // Load players from Firebase
  useEffect(() => {
    const playersRef = ref(db, 'players');
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playerList = Object.values(data);
        playerList.sort((a, b) => b.points - a.points);
        setPlayers(playerList);
      } else {
        setPlayers([]);
      }
    });
  }, []);

  // Save players to Firebase
  const savePlayers = (updated) => {
    const data = {};
    updated.forEach((p, i) => {
      data[i] = p;
    });
    set(ref(db, 'players'), data);
  };

  const handleLogin = () => {
    if (username.trim().toLowerCase() === 'preethiya' && password === 'ArviPreeth@22') {
      setIsGuest(false);
      setView('app');
      localStorage.setItem('loginState', JSON.stringify({ view: 'app', isGuest: false }));
    } else {
      alert('Only for Preethiya');
    }
  };

  const handleGuest = () => {
    setIsGuest(true);
    setView('app');
    localStorage.setItem('loginState', JSON.stringify({ view: 'app', isGuest: true }));
  };

  const logout = () => {
    localStorage.removeItem('loginState');
    setUsername('');
    setPassword('');
    setNewName('');
    setView('login');
    setIsGuest(false);
  };

  const addPlayer = () => {
    if (newName.trim()) {
      const updated = [...players, { name: newName, points: 0 }];
      updated.sort((a, b) => b.points - a.points);
      setPlayers(updated);
      savePlayers(updated);
      setNewName('');
    }
  };

  const updatePoints = (index, delta) => {
    const updated = [...players];
    updated[index].points += delta;
    updated.sort((a, b) => b.points - a.points);
    setPlayers(updated);
    savePlayers(updated);
  };

  const resetPoints = (index) => {
    const updated = [...players];
    updated[index].points = 0;
    updated.sort((a, b) => b.points - a.points);
    setPlayers(updated);
    savePlayers(updated);
  };

  const deletePlayer = (index) => {
    const confirmKey = prompt('Enter confirmation key to delete this player:');
    if (confirmKey === 'crab') {
      const deleted = players[index];
      const updated = [...players];
      updated.splice(index, 1);
      setPlayers(updated);
      savePlayers(updated);
      setLastDeletedPlayer(deleted);
    } else {
      alert('Incorrect confirmation key. Player not deleted.');
    }
  };

  const undoDelete = () => {
    if (lastDeletedPlayer) {
      const updated = [...players, lastDeletedPlayer];
      updated.sort((a, b) => b.points - a.points);
      setPlayers(updated);
      savePlayers(updated);
      setLastDeletedPlayer(null);
    }
  };

  if (view === 'login') {
    return (
      
      <div className="login-container">
         <div className="moving-png" />
        <h2>Welcome to Preethiya Point Table</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />
        <button className="btn" onClick={handleLogin}>Login</button>
        <button className="btn" onClick={handleGuest}>Continue as Guest</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="moving-png" />
      <h1>Preethiya Point Table</h1>

      {!isGuest && (
        <div className="input-section">
          <input
            type="text"
            placeholder="Enter name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button className="btn" onClick={addPlayer}>Add</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
            {!isGuest && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.points}</td>
              {!isGuest && (
                <td>
                  <button className="btn-sm" onClick={() => updatePoints(index, -10)}>-10</button>
                  <button className="btn-sm" onClick={() => updatePoints(index, -1)}>-1</button>
                  <button className="btn-sm" onClick={() => resetPoints(index)}>0</button>
                  <button className="btn-sm" onClick={() => updatePoints(index, 1)}>+1</button>
                  <button className="btn-sm" onClick={() => updatePoints(index, 10)}>+10</button>
                  <button className="btn-sm danger" onClick={() => deletePlayer(index)}>❌</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!isGuest && lastDeletedPlayer && (
        <button className="btn" onClick={undoDelete}>Undo Delete</button>
      )}

      <button className="btn" onClick={logout} style={{ marginTop: '20px' }}>
        Go to Login Page
      </button>
    </div>
  );
}

export default App;
