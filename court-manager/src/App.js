import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import ImportButton from './components/ImportButton';
import StatusTable from './components/StatusTable';
import Assignment from './components/Assignment';
import HowToUseButton from './components/HowToUseButton';
import SpecialPlayers from './components/SpecialPlayers';


function App() {
  // loading data from localStorage when components are mounted
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  // SpecialPlayers 컴포넌트의 ref 생성
  const specialPlayersRef = useRef(null);

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

  // Special List 관련 상태 추가
  const [specialPlayers, setSpecialPlayers] = useState(() => {
    const savedSpecialPlayers = localStorage.getItem('specialPlayers');
    return savedSpecialPlayers ? JSON.parse(savedSpecialPlayers) : [];
  });

  const [isSpecialEnabled, setIsSpecialEnabled] = useState(() => {
    return localStorage.getItem('isSpecialEnabled') === 'true';
  });

  // Special List 상태 로컬 스토리지 저장
  useEffect(() => {
    localStorage.setItem('specialPlayers', JSON.stringify(specialPlayers));
  }, [specialPlayers]);

  useEffect(() => {
    localStorage.setItem('isSpecialEnabled', isSpecialEnabled.toString());
  }, [isSpecialEnabled]);

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

      {/* HowToUseButton 사용 장소*/}
      <HowToUseButton /> {}

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
              className="px-3 py-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md shadow-md transition-all duration-200"
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
            specialPlayers={specialPlayers} // SpecialPlayers 상태 전달
            isSpecialEnabled={isSpecialEnabled} // SpecialPlayers 활성화 여부 전달
            setSpecialPlayers={setSpecialPlayers} // SpecialPlayers 상태 업데이트 함수 전달
          ></Assignment>
            {/* Special Players 리스트를 코트와 Assign 버튼 아래 배치 */}
            <div className="mt-4">
              {/* Special List 버튼 정렬 */}
              <div className="flex items-center justify-between mb-2">
                <h2 className='text-lg font-bold mb-2'>Special List</h2>
                <div className='flex justify-between mb-2'>
                  {/* 버튼 클릭 시 SpecialPlayers의 addSpecialPlayer 함수 호출 */}
                  <button 
                    onClick={() => specialPlayersRef.current?.addSpecialPlayer()} 
                    className='bg-green-500 text-white px-4 py-2 rounded mr-4'
                  >
                    Add Special
                  </button>
                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      className='hidden'
                      checked={isSpecialEnabled}
                      onChange={() => setIsSpecialEnabled(!isSpecialEnabled)}
                    />
                    <div className='w-12 h-6 bg-gray-300 rounded-full relative'>
                      <div className={`w-5 h-5 bg-gray-600 rounded-full absolute top-0.5 transition-transform duration-300 ${isSpecialEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </div>
                    <span className='ml-2 text-sm font-semibold text-gray-600'>
                      {isSpecialEnabled ? 'On' : 'Off'}
                    </span>
                  </label>
                </div>
              </div>

              {/* SpecialPlayers 컴포넌트 추가 (4명까지 보이도록 UI에서 조절) */}
              <SpecialPlayers 
                ref={specialPlayersRef} // ref 추가
                specialPlayers={specialPlayers} 
                setSpecialPlayers={setSpecialPlayers} 
                isSpecialEnabled={isSpecialEnabled} 
                setIsSpecialEnabled={setIsSpecialEnabled} 
              />
            </div>
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
      {/* 오른쪽 하단 Copyright 추가 */}
      <div className="absolute bottom-4 right-4 text-blue-300 text-xs">
        Copyright © 2025 Jihyeok Choi & Jinny Choi
      </div>
    </div>
  );
}

export default App;
