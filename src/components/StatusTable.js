import React, { useState } from 'react';

function StatusTable({ players, setPlayers, currentStartIndex }) {
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
  const handlePlayerClick = (playerId) => {
    setSelectedPlayerId((prevId) => (prevId === playerId ? null : playerId));
  };

  // // Open adding modal and close
  // const openModal = () => setIsModalOpen(true);
  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setNewPlayerName('');
  // };

  // // Adding player function
  // const addPlayer = () => {
  //   if (!newPlayerName.trim()) {
  //     alert('Name cannot be empty!');
  //     return;
  //   }

  //   // The last player checked-in ID
  //   const maxId = players.reduce((max, player) => {
  //     const idNum = parseInt(player.id, 10); // 숫자로 변환
  //     return idNum > max ? idNum : max;
  //   }, 0);

  //   const newPlayer = {
  //     id: (maxId + 1).toString(), // keep to add player with ID continuosly
  //     name: newPlayerName.trim(),
  //     checkedIn: 'Y',
  //     checkInDate: new Date(), // Current time adding
  //     playingCount: 0
  //   };

  //   setPlayers((prevPlayers) => [...prevPlayers, newPlayer]); // Adding the player in the list
  //   closeModal(); // modal closing
  // };

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
        <th className='px-4 py-2 w-1/12'>ID</th> {/* ID 컬럼 폭 */}
        <th className='px-4 py-2 w-5/12'>Name</th> {/* Name 컬럼 폭 */}
        <th className='px-4 py-2 w-2/12 text-center'>Games</th> {/* Games 컬럼 (가운데 정렬) */}
      </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={player.id}
              onClick={() => setSelectedPlayerId(player.id)}
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
              <td className='px-4 py-2 overflow-hidden text-ellipsis truncate'>
                {/[a-zA-Z]/.test(player.name) ? ( // 영어 이름인지 확인
                  <span className='text-xs'>{player.name}</span> // 영어 이름일 경우 크기 축소
                ) : (
                  player.name // 한글 이름은 그대로 표시
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
