import React, { useState } from 'react';

function StatusTable({ players, setPlayers, currentStartIndex }) {
  // The information for view
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 상태
  const [newPlayerName, setNewPlayerName] = useState(''); // 새 플레이어 이름
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchName, setSearchName] = useState(''); // 검색 이름

  // Search modal window
  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchName('');
  };

  // Searching Player
  const searchPlayer = () => {
    const foundPlayer = players.find(
      (player) => player.name === searchName.trim()
    );

    if (!foundPlayer) {
      alert('Player not found!');
      return;
    }

    setSelectedPlayerId(foundPlayer.id); // Setting selected player

    // Adjusting scroll
    const playerRow = document.getElementById(`player-${foundPlayer.id}`);
    if (playerRow) {
      playerRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    closeSearchModal(); // Close modal window
  };

  // Click player in the list handler
  const handlePlayerClick = (playerId) => {
    setSelectedPlayerId((prevId) => (prevId === playerId ? null : playerId));
  };

  // Open adding modal and close
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewPlayerName('');
  };

  // Adding player function
  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      alert('Name cannot be empty!');
      return;
    }

    // The last player checked-in ID
    const maxId = players.reduce((max, player) => {
      const idNum = parseInt(player.id, 10); // 숫자로 변환
      return idNum > max ? idNum : max;
    }, 0);

    const newPlayer = {
      id: (maxId + 1).toString(), // keep to add player with ID continuosly
      name: newPlayerName.trim(),
      checkedIn: 'Y',
      checkInDate: new Date(), // Current time adding
      playingCount: 0
    };

    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]); // Adding the player in the list
    closeModal(); // modal closing
  };

  // Removing player by '-' button
  const removeSelectedPlayer = () => {
    if (!selectedPlayerId) {
      alert('No player selected!');
      return;
    }

    const updatedPlayers = players.filter(
      (player) => player.id !== selectedPlayerId
    );

    // Adjusting the index for randomizing
    if (
      players.findIndex((player) => player.id === selectedPlayerId) <
      currentStartIndex.current
    ) {
      currentStartIndex.current = Math.max(0, currentStartIndex.current - 1); // Decreasing the index of removed player
    }

    setPlayers(updatedPlayers);
    setSelectedPlayerId(null);
  };

  function getTime(checkInDate) {
    if (checkInDate === '') {
      return '';
    }
    const date = new Date(checkInDate);
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Los_Angeles'
    };
    return date.toLocaleTimeString('en-US', options);
  }

  return (
    <div className='w-full h-full overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white max-h-[500px]'>
      <div className='flex justify-between items-center mt-2 mx-4'>
        <p>Total players: {players.length}</p>
        <div className='flex space-x-2'>
          <button
            onClick={openModal} // 모달 열기
            className={`w-8 h-8 flex items-center justify-center ${
              players.length > 0
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-300 cursor-default'
            }  text-white font-semibold rounded-md shadow-md  transition-all duration-200`}
            disabled={players.length === 0}
          >
            +
          </button>
          <button
            onClick={removeSelectedPlayer}
            className={`w-8 h-8 flex items-center justify-center ${
              players.length > 0
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-300 cursor-default'
            }  text-white font-semibold rounded-md shadow-md  transition-all duration-200`}
            disabled={players.length === 0}
          >
            -
          </button>
        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-1/3'>
            {/* 모달 헤더 */}
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-bold'>Add Player</h2>
              <button
                onClick={closeModal}
                className='text-gray-500 hover:text-gray-800 transition-all duration-200'
              >
                &times;
              </button>
            </div>

            {/* 이름 입력 */}
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

            {/* 버튼 영역 */}
            <div className='flex justify-end space-x-4'>
              <button
                onClick={addPlayer} // 플레이어 추가
                className='px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-200'
              >
                Add
              </button>
              <button
                onClick={closeModal} // 모달 닫기
                className='px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition-all duration-200'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <table className='table-auto w-full text-left'>
        <thead>
          <tr className='border-b'>
            <th className='px-4 py-2'>ID</th> {/* ID 컬럼 추가 */}
            <th className='px-4 py-2'>Name</th>
            <th className='px-4 py-2'>Games Played</th>
          </tr>
        </thead>
        <tbody>
          {players.filter((player) => player.checkedIn === 'Y').length > 0 ? (
            players
              .filter((player) => player.checkedIn === 'Y')
              .map((player) => (
                <tr
                  key={player.id}
                  onClick={() => handlePlayerClick(player.id)}
                  className={`cursor-pointer ${
                    selectedPlayerId === player.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <td className='px-4 py-2'>{player.id}</td> {/* ID 표시 */}
                  <td className='px-4 py-2'>{player.name}</td>
                  <td className='px-4 py-2'>{player.playingCount || 0}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan='3' className='px-4 py-2 text-center text-gray-500'>
                Please import players
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StatusTable;
