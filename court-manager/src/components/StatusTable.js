import React, { useState } from 'react';

function StatusTable({ players, setPlayers, onCourtAssign }) {
  // The information for view
  const [displayedPlayers, setDisplayedPlayers] = useState(players);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 상태
  const [newPlayerName, setNewPlayerName] = useState(''); // 새 플레이어 이름

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

    const newPlayer = {
      name: newPlayerName.trim(),
      checkedIn: 'Y',
      checkInDate: new Date(), // Current time adding
      playingCount: 0
    };

    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]); // Adding the player in the list
    closeModal(); // modal closing
  };

  const handleRandomizeClick = () => {
    if (players.length === 0) {
      console.error('No players are checked in!');
      return;
    }

    handleRandomize();
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

  const handleRandomize = (courtNumbers = [1, 2]) => {
    // courtNumber default is 4
    // Checking the courtNumbers is array
    if (!Array.isArray(courtNumbers) || courtNumbers.length === 0) {
      console.error('Invalid courtNumbers. Using default: [1, 2]');
      courtNumbers = [1, 2]; // 기본값
    }

    // Filtering players who is checked in only
    const playersCheckedIn = players.filter(
      (player) => player.checkedIn === 'Y'
    );

    if (playersCheckedIn.length === 0) {
      console.log('No players are checked in!');
      return;
    }

    // JSON object
    const courtAssignments = {};

    // Initializing court number
    courtNumbers.forEach((courtNumber) => {
      courtAssignments[courtNumber] = []; // Initializing players on each court
    });

    // The number of player for handling
    const batchSize = courtNumbers.length * 4;

    // Calculating index of the end of group
    const endIndex = Math.min(
      currentStartIndex + batchSize,
      playersCheckedIn.length
    );

    // The player group for game now
    const currentBatch = playersCheckedIn
      .slice(currentStartIndex, endIndex)
      .concat(
        playersCheckedIn.slice(
          0,
          Math.max(0, currentStartIndex + batchSize - playersCheckedIn.length)
        )
      );

    const updatedPlayers = players.map((player) => {
      if (currentBatch.includes(player)) {
        return {
          ...player,
          playingCount: (parseInt(player.playingCount, 10) || 0) + 1
        };
      }
      return { ...player };
    });

    // Mixing
    const shuffledBatch = currentBatch.sort(() => Math.random() - 0.5);

    // Assigning 4 players on each court
    shuffledBatch.forEach((player, index) => {
      const courtIndex = courtNumbers[index % courtNumbers.length];
      courtAssignments[courtIndex].push(player.name);
    });

    setPlayers(updatedPlayers);
    setCurrentStartIndex(
      (currentStartIndex + batchSize) % playersCheckedIn.length
    );

    if (typeof onCourtAssign === 'function') {
      onCourtAssign(courtAssignments);
    } else {
      console.error('onCourtAssign is not a function');
    }

    console.log('Court Assignments:', courtAssignments);
    console.log('Next Start Index:', currentStartIndex); // 디버깅용 로그
  };

  return (
    <div
      className="w-full h-full overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white max-h-[500px]"
      // max-h-[500px]: 스크롤 높이 제한, 필요 시 높이 값 변경
    >
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-lg font-medium text-blue-600">RANDOMIZE?</span>
        <button
          onClick={() => handleRandomize([1, 2, 3])}
          className="px-3 py-1 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
          // 버튼 스타일: Tailwind 클래스 적용
        >
          GO
        </button>
        <button
          onClick={openModal} // 모달 열기
          className="w-8 h-8 flex items-center justify-center bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-all duration-200"
        >
          +
        </button>
        <button
          onClick={() => console.log('Minus button clicked')} 
          className="w-8 h-8 flex items-center justify-center bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition-all duration-200"
        >
          -
        </button>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add Player</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 transition-all duration-200"
              >
                &times;
              </button>
            </div>

            {/* 이름 입력 */}
            <div className="mb-4">
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
                Player Name
              </label>
              <input
                id="playerName"
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={addPlayer} // 플레이어 추가
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-200"
              >
                Add
              </button>
              <button
                onClick={closeModal} // 모달 닫기
                className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-lg font-bold mb-2">Players</h2>
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Name</th> {/* 플레이어 이름 */}
            <th className="px-4 py-2">Checked In</th> {/* 체크인 여부 */}
            <th className="px-4 py-2">Games Played</th> {/* 게임 횟수 */}
          </tr>
        </thead>
        <tbody>
          {players.filter(player => player.checkedIn === 'Y').length > 0 ? (
            players
              .filter(player => player.checkedIn === 'Y')
              .map((player, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{player.name}</td> {/* 이름 표시 */}
                  <td className="px-4 py-2">{player.checkedIn}</td> {/* 체크인 여부 */}
                  <td className="px-4 py-2">{player.playingCount || 0}</td> {/* 게임 횟수 */}
                </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                No players available {/* 플레이어가 없을 경우 메시지 */}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StatusTable;
