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

  const [isLocked, setIsLocked] = useState(false); // Lock 상태 관리

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

  // Lock 토글 핸들러
  const toggleLock = () => {
    setIsLocked((prev) => !prev);
  };

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewPlayerName('');
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      alert('Name cannot be empty!');
      return;
    }

    const maxId = players.reduce((max, player) => {
      const idNum = parseInt(player.id, 10);
      return idNum > max ? idNum : max;
    }, 0);

    const newPlayer = {
      id: (maxId + 1).toString(),
      name: newPlayerName.trim(),
      checkedIn: 'Y',
      checkInDate: new Date(),
      playingCount: 0
    };

    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    closeModal();
  };

  return  (
    <div className='App p-8 relative'>
      <h1 className='text-4xl font-bold text-blue-500'>COURT MANAGER</h1>

      {/* 토글 스위치 추가 */}
      <div className="absolute top-4 right-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={isLocked}
            onChange={() => setIsLocked(!isLocked)}
          />
          <div className={`w-12 h-6 bg-gray-300 rounded-full relative`}>
            <div
              className={`w-5 h-5 bg-gray-600 rounded-full absolute top-0.5 transition-transform duration-300 ${
                isLocked ? 'translate-x-6' : 'translate-x-1'
              }`}
            ></div>
          </div>
          <span className="ml-2 text-sm font-semibold text-gray-600">
            {isLocked ? 'Locked' : 'Unlocked'}
          </span>
        </label>
      </div>

      <div className='flex'>
        <div className='w-1/3 p-4'>
          <ImportButton
            shouldShowTestButton={false}
            setPlayers={setPlayers}
            setCourts={setCourts}
          ></ImportButton>
          <div className="flex items-center mb-2 space-x-4"> {/* 수평 정렬 */}
            {/* Total Players */}
            <span className="text-lg font-semibold">
              Total Players: {players.length}
            </span>
            {/* Add New Player 버튼 */}
            <button
              onClick={openModal}
              className={`px-3 py-1 flex items-center justify-center ${
                players.length > 0
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-300 cursor-default'
              } text-white text-sm font-medium rounded-md shadow-md transition-all duration-200`}
              disabled={players.length === 0}
            >
              Add New Player
            </button>
          </div>
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
            isLocked={isLocked} 
          ></Assignment>
        </div>
      </div>
      {/* 모달 코드 추가 */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-1/3'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-bold'>Add Player</h2>
              <button
                onClick={closeModal}
                className='text-gray-500 hover:text-gray-800 transition-all duration-200'
              >
                &times;
              </button>
            </div>
            <div className='mb-4'>
              <label
                htmlFor='playerName'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Player Name
              </label>
              <input
                id='playerName'
                type='text'
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={addPlayer}
                className='px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-200'
              >
                Add
              </button>
              <button
                onClick={closeModal}
                className='px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition-all duration-200'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
