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
    <div className='App p-8'>
      <h1 className='text-4xl font-bold text-blue-500'>COURT MANAGER</h1>
      <div className='flex'>
        <div className='w-1/3 p-4'>
          <ImportButton
            shouldShowTestButton={true}
            setPlayers={setPlayers}
          ></ImportButton>
          {players && (
            <StatusTable
              players={players}
              setPlayers={setPlayers}
              onCourtAssign={handleRandomize}
            />
          )}
        </div>
        <div className='w-2/3 p-4'>
          <CourtSelection
            numTotCourts={8}
            onCourtSelect={setSelectedCourts}
            courtAssignments={courtAssignments}
          ></CourtSelection>
        </div>
      </div>
    </div>
  );
}

export default App;
