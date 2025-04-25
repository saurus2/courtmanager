import React, { useState, useEffect } from 'react';
import RandomizeButton from './RandomizeButton';
import Court from './Court';
import StatusTable from './StatusTable';
import { FaUndoAlt } from 'react-icons/fa';

function Assignment({ 
  numTotCourts, 
  players, 
  setPlayers, 
  courts,
  setCourts,
  currentStartIndex, 
  updateStartIndex,
  isLocked, 
  specialPlayers,
  setSpecialPlayers,
  isSpecialEnabled,
  selectedListPlayer, // 🔥 App.js에서 전달받음
  setSelectedListPlayer, // 🔥 초기화 위해 전달받음
  playingStatus, // 🔥 테니스공 아이콘 상태
  setPlayingStatus, // 🔥 상태 변경 함수
  onAssignStatusChange, // 🔥🔥🔥 새로 추가: 상태 전달용 callback
  setIsAssignmentCompleted // ⭐ 추가
}) {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  // const [temporaryCourts, setTemporaryCourts] = useState([]); // 임시 코트 데이터
  // const [tempStartIndex, setTempStartIndex] = useState(currentStartIndex.current); // 임시 시작 인덱스
  const [assignClicked, setAssignClicked] = useState(false); // Assign players 클릭 여부

  // 추가: 모달 상태 및 입력된 이름 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedSinglePlayer, setSelectedSinglePlayer] = useState(null); // 한 명 선택된 사람
  const [isChangeAllowed, setIsChangeAllowed] = useState(false); // 🔥 Change Players 버튼 활성화 여부

  // 🔥🔥🔥 새로 추가: 롤백을 위한 상태 저장 🔥🔥🔥
  const [rollbackCourts, setRollbackCourts] = useState(null);
  const [rollbackPlayingStatus, setRollbackPlayingStatus] = useState(null);
  const [rollbackPlayers, setRollbackPlayers] = useState(null);
  const [isRollbackAllowed, setIsRollbackAllowed] = useState(false);

  // 🔥 현재 라운드에서 카운트된 플레이어 추적
  const [countedPlayers, setCountedPlayers] = useState(new Set());

  // ⭐ 롤백용 인덱스 상태 추가
  const [rollbackStartIndex, setRollbackStartIndex] = useState(null);

  // saving updated courts data on localStorage
  useEffect(() => {
    localStorage.setItem('courts', JSON.stringify(courts));
  }, [courts]);

  // 🔥🔥🔥 새로 추가: assignClicked와 isRollbackAllowed 상태 변경 시 상위로 전달
  useEffect(() => {
    if (onAssignStatusChange) {
      onAssignStatusChange({ assignClicked, isRollbackAllowed });
    }
  }, [assignClicked, isRollbackAllowed, onAssignStatusChange]);

  function onCourtSelected(courtIndex) {
    if (isLocked) return; 
    const updatedCourts = courts.map((court, i) => ({
      ...court,
      isSelected: i === courtIndex ? !court.isSelected : court.isSelected
    }));
    setCourts(updatedCourts);
  }

  // 추가된 함수: 플레이어 선택 로직
  function handlePlayerClick(player, courtIndex = null) {
    if (courtIndex === null) {
      return;
    }

    const alreadySelected = selectedPlayers.find((p) => p.id === player.id);
    if (alreadySelected) {
      // 이미 선택된 경우 해제
      setSelectedPlayers((prev) => prev.filter((p) => p.id !== player.id));
    } else {
      // 첫 번째로 선택된 코트
      const firstSelectedCourtIndex =
        selectedPlayers.length > 0 ? selectedPlayers[0].courtIndex : null;
  
      // 같은 코트에서 두 번째 플레이어를 선택한 경우
      if (firstSelectedCourtIndex === courtIndex) {
        // 이전 선택된 사람 해제하고 새로 선택된 사람으로 교체
        setSelectedPlayers([{ ...player, courtIndex }]);
        return;
      }
  
      // 같은 코트에서 이미 선택된 사람이 있을 경우 해당 사람 교체
      const sameCourtPlayerIndex = selectedPlayers.findIndex(
        (p) => p.courtIndex === courtIndex
      );
  
      if (sameCourtPlayerIndex !== -1) {
        // 같은 코트에 선택된 사람이 있다면, 새로운 사람으로 교체
        const updatedSelection = [...selectedPlayers];
        updatedSelection[sameCourtPlayerIndex] = { ...player, courtIndex };
        setSelectedPlayers(updatedSelection);
      } else {
        // 새로운 플레이어 선택 (다른 코트 또는 첫 번째 선택)
        const newSelection = [...selectedPlayers, { ...player, courtIndex }];
        if (newSelection.length > 2) {
          newSelection.shift(); // 2명을 초과하면 가장 처음 선택된 플레이어 제거
        }
        setSelectedPlayers(newSelection);
      }
    }
  }

  function onAssignPlayers(courtAssignments) {
    const updatedCourts = courts.map((court) => ({
      ...court,
      players: courtAssignments[court.courtIndex] || []
    }));
    setCourts(updatedCourts); // 화면에 즉시 반영
    // 🔥🔥🔥 수정됨: Assign Players 직후 상태 저장 🔥🔥🔥
    setRollbackCourts(updatedCourts); // 롤백용 코트 상태 저장
    setRollbackPlayingStatus({ ...playingStatus }); // 롤백용 playingStatus 저장
    setRollbackPlayers([...players]); // 롤백용 players 상태 저장
    // ⭐ 현재 인덱스 저장
    setRollbackStartIndex(currentStartIndex);
    setAssignClicked(true); // Assign players가 눌렸음을 표시
    setIsChangeAllowed(true); // Change Players 버튼 활성화
    setIsRollbackAllowed(false); // 🔥🔥🔥 수정됨: Assign 시 isRollbackAllowed 리셋
    // 🔥 새 배정 시 countedPlayers 초기화
    setCountedPlayers(new Set());
  }

  function handleChangePlayers() {
    if (selectedListPlayer && selectedPlayers.length === 1) {
      // ✅ 리스트에서 선택한 사람 + 코트에서 선택한 사람을 교체하는 로직 추가
      const courtPlayer = selectedPlayers[0];

      // ✅ 이미 코트에 있는 사람을 다시 넣으려고 하면 에러 처리
      if (courts.some((court) => court.players.some((p) => p.name === selectedListPlayer.name))) {
        alert("이미 코트에 있는 사람은 교체할 수 없습니다.");
        return;
      }

      // 🔥 playingStatus 및 countedPlayers 업데이트
      // const updatedPlayingStatus = { ...playingStatus };
      // delete updatedPlayingStatus[courtPlayer.id];
      // updatedPlayingStatus[selectedListPlayer.id] = true;
      // setPlayingStatus(updatedPlayingStatus);
      // localStorage.setItem("playingStatus", JSON.stringify(updatedPlayingStatus));

      // ⭐ countedPlayers에서 기존 플레이어 제거 (새 플레이어 추가 제거)
      setCountedPlayers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(courtPlayer.id);
        // ⭐ 제거: newSet.add(selectedListPlayer.id);
        console.log(`⭐ Change Players: Removed ${courtPlayer.name} (ID: ${courtPlayer.id}) from countedPlayers`);
        console.log(`⭐ Change Players: New player ${selectedListPlayer.name} (ID: ${selectedListPlayer.id}) will be counted in Confirmation`);
        return newSet;
      });

      // ✅ 코트 업데이트: 기존 사람 제거 후 리스트의 사람 추가
      setCourts((prevCourts) =>
        prevCourts.map((court) =>
          court.players.some((p) => p.id === courtPlayer.id)
            ? {
                ...court,
                players: court.players.map((p) =>
                  p.id === courtPlayer.id ? { ...selectedListPlayer } : p
                )
              }
            : court
        )
      );

      // ✅ LocalStorage 업데이트
      localStorage.setItem("courts", JSON.stringify(courts));

      // 선택 초기화
      setSelectedListPlayer(null);
      setSelectedPlayers([]);
      return;
    }

    // 기존 로직: 코트 내 두 명을 교체하는 기능 유지
    if (selectedPlayers.length !== 2) {
      alert("두 명의 플레이어를 선택해야 합니다.");
      return;
    }

    const [player1, player2] = selectedPlayers;
  
    setCourts((prevCourts) => {
      return prevCourts.map((court, index) => {
        if (index === player1.courtIndex) {
          // player1이 있던 위치에 player2를 삽입
          const player1Index = court.players.findIndex((p) => p.id === player1.id);
          const updatedPlayers = [...court.players];
          updatedPlayers[player1Index] = player2; // player1의 위치에 player2 삽입
          return {
            ...court,
            players: updatedPlayers
          };
        } else if (index === player2.courtIndex) {
          // player2이 있던 위치에 player1을 삽입
          const player2Index = court.players.findIndex((p) => p.id === player2.id);
          const updatedPlayers = [...court.players];
          updatedPlayers[player2Index] = player1; // player2의 위치에 player1 삽입
          return {
            ...court,
            players: updatedPlayers
          };
        }
        return court; // 다른 코트는 그대로 유지
      });
    });
  
    // 선택 초기화
    setSelectedPlayers([]);
  }
  
  function handleModalChange() {
    if (!newPlayerName.trim()) {
      alert('이름을 입력하세요.');
      return;
    }
  
    // courts 업데이트: ID를 기준으로 이름 업데이트
    const updatedCourts = courts.map((court) => {
      if (court.courtIndex === selectedSinglePlayer.courtIndex) {
        const updatedPlayers = court.players.map((player) =>
          player.id === selectedSinglePlayer.id
            ? { ...player, name: newPlayerName } // 이름만 업데이트
            : player
        );
        return { ...court, players: updatedPlayers };
      }
      return court;
    });
  
    setCourts(updatedCourts); // courts 상태 업데이트
    // setTemporaryCourts(updatedCourts); // temporaryCourts 상태 동기화
  
    // players 업데이트: ID를 기준으로 이름 업데이트
    const updatedPlayers = players.map((player) =>
      player.id === selectedSinglePlayer.id
        ? { ...player, name: newPlayerName } // 이름만 업데이트
        : player
    );
  
    setPlayers(updatedPlayers); // players 상태 업데이트
    localStorage.setItem('players', JSON.stringify(updatedPlayers)); // 로컬스토리지 저장
    localStorage.setItem('courts', JSON.stringify(updatedCourts)); // 로컬스토리지 저장
  
    setIsModalOpen(false); // 모달 닫기
    setSelectedPlayers([]); // 선택 초기화
  }
  

  // 모달에서 Cancel 버튼 클릭 시 동작
  function handleModalCancel() {
    setIsModalOpen(false); // 모달 닫기
    setSelectedPlayers([]);
  }

  function handleConfirmAssignments() {
    if (!assignClicked) {
      alert("Assign players first before confirming!");
      return;
    }
    
    setIsChangeAllowed(false); // 🔥 Confirmation 후 Change Players 버튼 비활성화

    // ✅ 기존 데이터 유지 (localStorage에서 불러오기)
    const savedStatus = JSON.parse(localStorage.getItem("playingStatus")) || {};
    // 🔥 Assign 후 Change Players 버튼 비활성화
    setIsChangeAllowed(false);
    // 🔥 이전 상태를 모두 지우고, 현재 코트에서 뛰는 사람만 저장
    const updatedPlayingStatus = {};

    // ✅ 현재 코트에 있는 사람들만 playingStatus에 추가
    courts.forEach(court => {
      court.players.forEach(player => {
        updatedPlayingStatus[player.id] = true; // ✅ 새 플레이어 추가
      });
    });

    setPlayingStatus(updatedPlayingStatus); // 상태 업데이트
    localStorage.setItem("playingStatus", JSON.stringify(updatedPlayingStatus)); // ✅ localStorage에도 반영

    // ⭐ 인덱스 업데이트
    const selectedCourtsCount = courts.filter((court) => court.isSelected).length;
    const playersPerRound = selectedCourtsCount * 4;
    let newIndex;
    if (isSpecialEnabled) {
      newIndex = (currentStartIndex + (playersPerRound - specialPlayers.length)) % players.length;
    } else {
      newIndex = (currentStartIndex + playersPerRound) % players.length;
    }
    // ⭐ 수정: 모든 플레이어가 배정된 경우와 아닌 경우를 구분
    const totalAssigned = currentStartIndex + playersPerRound;
    if (totalAssigned >= players.length) {
      // 모든 플레이어가 배정된 경우, 남은 플레이어 수 계산
      const remainingPlayers = totalAssigned % players.length;
      newIndex = remainingPlayers === 0 ? 0 : remainingPlayers;
      setIsAssignmentCompleted(true); // 배정 완료 상태 설정
    } else {
      // 아직 배정이 완료되지 않은 경우, 다음 인덱스로 진행
      setIsAssignmentCompleted(false); // 배정 미완료 상태 유지
    }

    updateStartIndex(newIndex); // 🔥 useState 업데이트
  
    // // 게임 횟수 업데이트
    // const updatedPlayers = players.map((player) => {
    //   const isCurrentlyAssigned = courts.some((court) =>
    //     court.players.some((courtPlayer) => courtPlayer.id === player.id && courtPlayer.name === player.name)
    //   );
    //   // "Change Players"로 이미 교체된 경우, 추가로 증가시키지 않음
    //   if (isCurrentlyAssigned && updatedPlayingStatus[player.id]) {
    //     // 🔥 리스트에서 코트로 들어온 플레이어는 이미 handleChangePlayers에서 +1 했으므로,
    //     // 🔥 여기서는 추가 증가를 하지 않도록 조건 확인
    //     const wasAlreadyCounted = player.playingCount > 0 && !savedStatus[player.id];
    //     if (!wasAlreadyCounted) {
    //       return {
    //         ...player,
    //         playingCount: Number(player.playingCount) + 1 // 🔥 현재 코트에 있는 경우만 +1
    //       };
    //     }
    //   }
    //   return player;
    // });
  
    // 🔥 playingCount 업데이트
    const updatedPlayers = players.map((player) => {
      const isCurrentlyAssigned = courts.some((court) =>
        court.players.some((courtPlayer) => courtPlayer.id === player.id)
      );
      if (isCurrentlyAssigned && updatedPlayingStatus[player.id]) {
        // 🔥 countedPlayers를 기준으로 중복 증가 방지
        if (!countedPlayers.has(player.id)) {
          console.log(`🔍 Increasing playingCount for ${player.name} (ID: ${player.id})`);
          return {
            ...player,
            playingCount: Number(player.playingCount || 0) + 1
          };
        }
        console.log(`🔍 Skipping playingCount for ${player.name} (ID: ${player.id}, already counted in this round)`);
      }
      return player;
    });

    // 🔥 countedPlayers 업데이트
    const newCountedPlayers = new Set();
    courts.forEach(court => {
      court.players.forEach(player => {
        newCountedPlayers.add(player.id);
      });
    });
    setCountedPlayers(newCountedPlayers);

    setPlayers(updatedPlayers);
    // setCourts([...temporaryCourts]); // courts 동기화
  
    // 로컬스토리지에 반영
    localStorage.setItem("players", JSON.stringify(updatedPlayers));
    localStorage.setItem("courts", JSON.stringify(courts));
  
    // 임시 데이터 초기화
    // setTemporaryCourts([...temporaryCourts]);
    setAssignClicked(false); // Confirmation 버튼 비활성화
    // 🔥🔥🔥 수정됨: Confirmation 후 Rollback 버튼 활성화 🔥🔥🔥
    setIsRollbackAllowed(true);
  }

  // 🔥🔥🔥 새로 추가: Rollback 기능 구현 🔥🔥🔥
  function handleRollback() {
    if (!rollbackCourts || !rollbackPlayingStatus || !rollbackPlayers) {
      alert("No state to rollback to!");
      return;
    }

    // Assign Players 직후 상태로 복원
    setCourts([...rollbackCourts]);
    setPlayingStatus({ ...rollbackPlayingStatus });
    setPlayers([...rollbackPlayers]);

    // ⭐ 인덱스 복원
    if (rollbackStartIndex !== null) {
      updateStartIndex(rollbackStartIndex);
      console.log(`⭐ Rollback: Restored currentStartIndex to ${rollbackStartIndex}`);
    }

    // 로컬 스토리지 업데이트
    localStorage.setItem("courts", JSON.stringify(rollbackCourts));
    localStorage.setItem("playingStatus", JSON.stringify(rollbackPlayingStatus));
    localStorage.setItem("players", JSON.stringify(rollbackPlayers));

    // ⭐ Confirmation 버튼 비활성화
    setAssignClicked(false);
    setIsChangeAllowed(true); // Change Players 버튼 활성화
    setIsRollbackAllowed(false); // Rollback 버튼 비활성화
    // 🔥 countedPlayers 초기화
    setCountedPlayers(new Set());
  }

  return (
    <div>
      <div className='grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-2'>
        {courts.map((court, i) => (
          <div key={i}>
            <Court
              courtIndex={court.courtIndex}
              isSelected={court.isSelected}
              onCourtSelected={() => onCourtSelected(court.courtIndex)}
              players={court.players.map((player) => ({
                ...player,
                isSelected: !!selectedPlayers.find((p) => p.id === player.id) //선택된 플레이어 강조 표시
              }))}
              onPlayerClick={handlePlayerClick} //플레이어 클릭 핸들러 전달
            ></Court>
          </div>
        ))}
      </div>
      <div className='mt-4 flex items-center'>
        <RandomizeButton
          courts={courts}
          players={players}
          setPlayers={setPlayers}
          onAssignPlayers={onAssignPlayers}
          currentStartIndex={currentStartIndex}
          updateStartIndex={updateStartIndex} // 🔥 tempStartIndex 대신 updateStartIndex 사용
          specialPlayers={specialPlayers} // ✅ Special List 전달
          setSpecialPlayers={setSpecialPlayers} // ✅ setSpecialPlayers 전달 추가
          isSpecialEnabled={isSpecialEnabled}
        ></RandomizeButton>
        {/* Change Players 버튼 추가 */}
        <button
            onClick={handleChangePlayers}
            disabled={!isChangeAllowed} // 🔥 상태를 반영하여 활성화/비활성화
            className={`px-4 py-2 rounded-md ml-2 ${
              isChangeAllowed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          Change Players
        </button>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Change Player</h2>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={handleModalCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalChange}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Change Player
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Confirmation 버튼 추가 */}
        <button
          onClick={handleConfirmAssignments}
          disabled={!assignClicked} // Assign players가 눌리지 않으면 비활성화
          className={`px-4 py-2 rounded-md ml-2 ${
            assignClicked
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-500 cursor-default'
          }`}
        >
          Confirmation
        </button>
        {/* 🔥🔥🔥 수정됨: Rollback 버튼을 Confirmation 오른쪽에 배치 🔥🔥🔥 */}
        <button
          onClick={handleRollback}
          disabled={!isRollbackAllowed}
          className={`h-10 w-10 rounded-md ml-2 flex items-center justify-center ${
            isRollbackAllowed
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FaUndoAlt className="text-lg" />
        </button>
      </div>
    </div>
  );
}

export default Assignment;
