import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import ImportButton from './components/ImportButton';
import StatusTable from './components/StatusTable';
import Assignment from './components/Assignment';

function App() {
  // loading data from localStorage when components are mounted
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  const [courts, setCourts] = useState(() => {
    const savedCourts = localStorage.getItem('courts');
    return savedCourts
      ? JSON.parse(savedCourts)
      : Array(8).fill(null).map((_, i) => ({
          courtIndex: i,
          isSelected: false,
          players: []
        }));
  });

  // saving updated currentStartIndex on localStorage
  const currentStartIndex = useRef(
    localStorage.getItem('currentStartIndex')
      ? parseInt(localStorage.getItem('currentStartIndex'), 10)
      : 0
  );

  // saving data function
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players)); // saving data on localStorage when players status was updated
  }, [players]);

  useEffect(() => {
    localStorage.setItem('courts', JSON.stringify(courts));
  }, [courts]);

  // saving changed currentStartIndex on localStorage
  const updateStartIndex = (newIndex) => {
    currentStartIndex.current = newIndex;
    localStorage.setItem('currentStartIndex', newIndex.toString()); // saving start index
  };

  return (
    <div className='App p-8'>
      <h1 className='text-4xl font-bold text-blue-500'>COURT MANAGER</h1>
      <div className='flex'>
        <div className='w-1/3 p-4'>
          <ImportButton
            shouldShowTestButton={false}
            setPlayers={setPlayers}
            setCourts={setCourts}
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
            courts={courts}
            setCourts={setCourts}
            currentStartIndex={currentStartIndex}
            updateStartIndex={updateStartIndex} // transferring start index
          ></Assignment>
        </div>
      </div>
    </div>
  );
}

export default App;
