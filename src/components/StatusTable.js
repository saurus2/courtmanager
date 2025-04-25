import React, { useState } from 'react';
import { MdSportsTennis } from 'react-icons/md'; // ✅ 올바른 테니스공 아이콘 사용
import { FaRegTrashAlt } from 'react-icons/fa'; // trash bin

function StatusTable({ 
  players, 
  setPlayers, 
  currentStartIndex, 
  onSelectPlayer, 
  playingStatus,
  assignClicked, // 🔥🔥🔥 새로 추가: Assign 상태
  isRollbackAllowed, // 🔥🔥🔥 새로 추가: Rollback 상태
  setCurrentStartIndex,
  courts // ⭐ 추가
}) {
  // The information for view
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 상태
  const [newPlayerName, setNewPlayerName] = useState(''); // 새 플레이어 이름
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchName, setSearchName] = useState(''); // 검색 이름
  // 🔥🔥🔥 새로 추가: 드래그 중인 플레이어 추적
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  // 🔥🔥🔥 새로 추가: 드래그 상태 추적
  const [isDragging, setIsDragging] = useState(false);

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
    // 🔥🔥🔥 수정됨: 드래그 중에는 클릭 이벤트 무시
    if (isDragging) return;
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
    // ⭐ 추가: 선택된 플레이어가 코트에 배정되어 있는지 확인
    const isPlayerAssigned = courts.some(court =>
      court.players.some(player => player.id === selectedPlayerId)
    );

    if (isPlayerAssigned) {
      alert('Cannot delete a player currently assigned to a court.');
      return;
    }
    
    const updatedPlayers = players.filter(
      (player) => player.id !== selectedPlayerId
    );

    // ⭐ 수정: currentStartIndex 조정
    const deletedPlayerIndex = players.findIndex((player) => player.id === selectedPlayerId);
    if (deletedPlayerIndex < currentStartIndex) {
      // 삭제된 플레이어가 currentStartIndex보다 앞에 있으면 인덱스 감소
      setCurrentStartIndex(Math.max(0, currentStartIndex - 1));
    } else if (currentStartIndex >= updatedPlayers.length) {
      // currentStartIndex가 새 리스트 길이를 초과하면 0으로 리셋
      setCurrentStartIndex(0);
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

  // 🔥🔥🔥 새로 추가: 드래그 시작 시 호출
  const handleDragStart = (e, player) => {
    // 🔥🔥🔥 수정됨: 드래그 가능 여부 확인 및 이벤트 중단
    if (assignClicked && !isRollbackAllowed) {
      e.preventDefault();
      e.stopPropagation();
      alert("Assignment 후에는 순서를 바꿀 수 없습니다.");
      return false;
    }
    setDraggedPlayer(player);
    setIsDragging(true); // 🔥🔥🔥 수정됨: 드래그 시작 시 상태 설정
    e.dataTransfer.setData('text/plain', player.id);
    return true;
  };

  // 🔥🔥🔥 새로 추가: 드래그 오버 시 호출
  const handleDragOver = (e) => {
    // 🔥🔥🔥 수정됨: 드래그 가능 여부 확인
    if (assignClicked && !isRollbackAllowed) {
      return;
    }
    e.preventDefault();
  };

  // 🔥🔥🔥 새로 추가: 드롭 시 호출
  const handleDrop = (e, targetPlayer) => {
    e.preventDefault();
    if (assignClicked && !isRollbackAllowed) {
      return;
    }
    if (!draggedPlayer || draggedPlayer.id === targetPlayer.id) return;

    const newPlayers = [...players];
    const draggedIndex = newPlayers.findIndex(p => p.id === draggedPlayer.id);
    const targetIndex = newPlayers.findIndex(p => p.id === targetPlayer.id);

    // 배열에서 드래그된 플레이어를 제거하고 대상 위치에 삽입
    newPlayers.splice(draggedIndex, 1);
    newPlayers.splice(targetIndex, 0, draggedPlayer);

    // id를 순서에 맞게 재설정 (1부터 순차적으로)
    const updatedPlayers = newPlayers.map((player, index) => ({
      ...player,
      id: (index + 1).toString()
    }));

    setPlayers(updatedPlayers);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    setDraggedPlayer(null);
    setIsDragging(false); // 🔥🔥🔥 수정됨: 드롭 후 드래그 상태 해제
  };
  
  // 🔥🔥🔥 새로 추가: 드래그 종료 시 호출
  const handleDragEnd = () => {
    setIsDragging(false);
  };

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
              className={`cursor-pointer h-12 ${
                selectedPlayerId === player.id
                  ? 'bg-blue-100 border-blue-500'
                  : 'hover:bg-gray-100'
              }${draggedPlayer?.id === player.id ? 'opacity-50' : ''}`}
              draggable={!(assignClicked && !isRollbackAllowed)} // 🔥🔥🔥 수정됨: 드래그 가능 여부 제어
              onDragStart={(e) => handleDragStart(e, player)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, player)}
              onDragEnd={handleDragEnd}// 🔥🔥🔥 수정됨: 드래그 종료 이벤트 추가
            >
              <td className='px-4 py-2 text-center'>
                {selectedPlayerId === player.id ? ( // 플레이어 선택 여부에 따라
                    <button
                    className='px-2 py-1 bg-[#DDA8A0] text-white rounded-md flex items-center justify-center'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedPlayer();
                    }}
                  >
                    <FaRegTrashAlt className='text-white' />
                  </button>
                ) : (
                  player.id // 선택되지 않은 경우 ID 표시
                )}
              </td>
              {/* 🔥 수정됨: 이름 옆에 테니스공 아이콘 추가 */}
              <td className='px-4 py-2 flex items-center justify-between'>
                <span className='leading-none align-middle translate-y-1.5'>{player.name}</span>
                {playingStatus[player.id] && (
                  <MdSportsTennis className="text-green-500 w-5 h-5 translate-y-1.5" />
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
