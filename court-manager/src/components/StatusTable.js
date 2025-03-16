import React, { useState } from 'react';
import { MdSportsTennis } from 'react-icons/md'; // ✅ 올바른 테니스공 아이콘 사용

function StatusTable({ players, setPlayers, currentStartIndex, onSelectPlayer, playingStatus }) {
  // The information for view
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 상태
  const [newPlayerName, setNewPlayerName] = useState(''); // 새 플레이어 이름
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchName, setSearchName] = useState(''); // 검색 이름

  const updatePlayingCount = (playerId, increment) => {
    const updatedPlayers = players.map((player) => {
      if (player.id === playerId) {
        const newCount = Math.max((player.playingCount || 0) + increment, 0); // 최소값 0
        return { ...player, playingCount: newCount };
      }
      return player;
    });

    setPlayers(updatedPlayers);
    localStorage.setItem('players', JSON.stringify(updatedPlayers)); // LocalStorage에 저장
  };

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
  const handlePlayerClick = (playerId, e) => {
    e.stopPropagation(); // 🔴 이벤트 버블링 방지
    // ✅ 이미 선택된 플레이어를 다시 클릭하면 해제
    if (selectedPlayerId === playerId) {
      setSelectedPlayerId(null); // 선택 해제
      onSelectPlayer(null); // 상위 컴포넌트에서도 선택 해제
      return;
    }
    setSelectedPlayerId(playerId); // 🔴 선택된 플레이어 UI 강조

    const selectedPlayer = players.find((player) => player.id === playerId);
    console.log("📌 StatusTable - 클릭한 플레이어:", selectedPlayer); // 🔴 디버깅용 로그 추가

    if (onSelectPlayer) {
      console.log("📌 StatusTable - onSelectPlayer 호출됨", selectedPlayer); // 🔴 디버깅용 로그 추가
      onSelectPlayer(selectedPlayer);
    } else {
      console.log("⚠ StatusTable - onSelectPlayer가 정의되지 않음!"); // 🔴 onSelectPlayer가 없으면 경고 출력
    }
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
    <div className='w-full h-full overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white max-h-[800px]'>
      <table className='table-auto w-full text-left'>
        <thead>
          <tr className='border-b'>
            <th className='px-4 py-2 w-1/12'>ID</th>
            <th className='px-4 py-2 w-5/12'>Name</th>
            <th className='px-4 py-2 w-2/12 text-center'>Games</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={player.id}
              onClick={(e) => handlePlayerClick(player.id, e)}
              className={`cursor-pointer ${
                selectedPlayerId === player.id
                  ? 'bg-blue-100 border-blue-500'
                  : 'hover:bg-gray-100'
              }`}
            >
              <td className='px-4 py-2 text-center'>
                {selectedPlayerId === player.id ? ( // 플레이어 선택 여부에 따라
                  <button
                    className='px-2 py-1 bg-red-500 text-white rounded-md'
                    onClick={(e) => {
                      e.stopPropagation(); // 부모 클릭 이벤트 방지
                      removeSelectedPlayer(); // 플레이어 삭제
                    }}
                  >
                    -
                  </button>
                ) : (
                  player.id // 선택되지 않은 경우 ID 표시
                )}
              </td>
              {/* 🔥 수정됨: 이름 옆에 테니스공 아이콘 추가 */}
              <td className='px-4 py-2 flex items-center'>
                {player.name}
                {playingStatus[player.id] && ( // 🔥 플레이 중이면 아이콘 표시
                  <MdSportsTennis className="ml-2 text-green-500" />
                )}
              </td>
              <td
                className={`px-4 py-2 ${
                  selectedPlayerId === player.id ? '' : 'text-center'
                }`}
              >
                {selectedPlayerId === player.id ? (
                  <div className='flex items-center space-x-2'>
                    <button
                      className='px-2 py-1 bg-red-500 text-white rounded-md'
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePlayingCount(player.id, -1); // -1
                      }}
                    >
                      -
                    </button>
                    <span className='text-lg font-semibold'>{player.playingCount || 0}</span>
                    <button
                      className='px-2 py-1 bg-green-500 text-white rounded-md'
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePlayingCount(player.id, 1); // +1
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className='text-center'>{player.playingCount || 0}</span>
                )}
              </td>
              {/* <td className='px-4 py-2'>
                {selectedPlayerId === player.id && (
                  <div className='flex space-x-2'>
                    <button
                      className='px-2 py-1 bg-red-500 text-white rounded-md'
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelectedPlayer();
                      }}
                    >
                      -
                    </button>
                  </div>
                )}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatusTable;
