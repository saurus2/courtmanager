import './App.css';
import React, { useState } from 'react';
import ImportButton from './components/ImportButton';
import StatusTable from './components/StatusTable';
import CourtSelection from './components/CourtSelection';

function App() {
  const [players, setPlayers] = useState(null);
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>COURT MANAGER</h1>
        <CourtSelection numTotCourts={17}></CourtSelection>
        <ImportButton
          shouldShowTestButton={true}
          setPlayers={setPlayers}
        ></ImportButton>
        <div>{players && <StatusTable players={players} />}</div>
      </header>
    </div>
  );
}

export default App;
