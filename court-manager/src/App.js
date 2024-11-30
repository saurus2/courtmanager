import './App.css';
import React, { useState } from 'react';
import ImportButton from './components/ImportButton';
import StatusTable from './components/StatusTable';
import CourtSelection from './components/CourtSelection';

function App() {
  const [players, setPlayers] = useState([]); 
  const [courtAssignments, setCourtAssignments] = useState({}); 
  const [selectedCourts, setSelectedCourts] = useState([]); 

  // updating court information
  const handleRandomize = (assignments) => {
    if (players.length === 0) {
      console.error('No players are available!');
      return;
    }

    setCourtAssignments(assignments); 
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>COURT MANAGER</h1>
        <CourtSelection 
          numTotCourts={17}
          onCourtSelect={setSelectedCourts}
          courtAssignments={courtAssignments}
          >  
        </CourtSelection>
        <ImportButton
          shouldShowTestButton={true}
          setPlayers={setPlayers}
        ></ImportButton>
        <div>{players && <StatusTable players={players} setPlayers={setPlayers} />}</div>
      </header>
    </div>
  );
}

export default App;
