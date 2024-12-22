import './App.css';
import React, { useState, useRef } from 'react';
import ImportButton from './components/ImportButton';
import StatusTable from './components/StatusTable';
import Assignment from './components/Assignment';

function App() {
  const [players, setPlayers] = useState([]);
  const currentStartIndex = useRef(0);

  return (
    <div className='App p-8'>
      <h1 className='text-4xl font-bold text-blue-500'>COURT MANAGER</h1>
      <div className='flex'>
        <div className='w-1/3 p-4'>
          <ImportButton
            shouldShowTestButton={false}
            setPlayers={setPlayers}
          ></ImportButton>
          <StatusTable
            players={players}
            setPlayers={setPlayers}
            currentStartIndex={currentStartIndex}
          />
        </div>
        <div className='w-2/3 p-4'>
          <Assignment
            numTotCourts={8}
            players={players}
            setPlayers={setPlayers}
            currentStartIndex={currentStartIndex}
          ></Assignment>
        </div>
      </div>
    </div>
  );
}

export default App;
