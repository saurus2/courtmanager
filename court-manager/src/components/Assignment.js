import React, { useState, useEffect } from 'react';
import RandomizeButton from './RandomizeButton';
import Court from './Court';

function Assignment({ 
  numTotCourts, 
  players, 
  setPlayers, 
  courts,
  setCourts,
  currentStartIndex, 
  updateStartIndex,
  isLocked
}) {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [temporaryCourts, setTemporaryCourts] = useState([]); // 임시 코트 데이터
  const [tempStartIndex, setTempStartIndex] = useState(currentStartIndex.current); // 임시 시작 인덱스
  const [assignClicked, setAssignClicked] = useState(false); // Assign players 클릭 여부

  // saving updated courts data on localStorage
  useEffect(() => {
    localStorage.setItem('courts', JSON.stringify(courts));
  }, [courts]);

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
    const alreadySelected = selectedPlayers.find((p) => p.id === player.id);

    if (alreadySelected) {
      // 이미 선택된 경우 해제
      setSelectedPlayers((prev) => prev.filter((p) => p.id !== player.id));
    } else {
      // 첫 번째로 선택된 코트
      const firstSelectedCourtIndex =
        selectedPlayers.length > 0 ? selectedPlayers[0].courtIndex : null;

      // 같은 코트에서 두 번째 플레이어를 바로 선택하려고 할 때 무시
      if (firstSelectedCourtIndex === courtIndex && selectedPlayers.length === 1) {
        return; // 첫 번째 코트에서 두 번째 사람 선택을 방지
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
    // 임시 코트 데이터에 저장 (화면에도 즉시 반영)
    setTemporaryCourts(updatedCourts);
    setCourts(updatedCourts); // 화면에 즉시 반영
    setTempStartIndex(currentStartIndex.current); // 임시 인덱스 저장
    setAssignClicked(true); // Assign players가 눌렸음을 표시
  }

  function handleChangePlayers() {
    if (selectedPlayers.length !== 2) {
      alert('두 명의 플레이어를 선택해야 합니다.');
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
  
  function handleConfirmAssignments() {
    if (temporaryCourts.length === 0) {
      alert("Assign players first before confirming!");
      return;
    }
  
    // 인덱스 변경 (Confirmation 시에만)
    currentStartIndex.current =
      (currentStartIndex.current + courts.filter((court) => court.isSelected).length * 4) %
      players.length;
  
    // 게임 횟수 업데이트
    const updatedPlayers = players.map((player) => {
      const isAssigned = temporaryCourts.some((court) =>
        court.players.some((courtPlayer) => courtPlayer.id === player.id)
      );
      if (isAssigned) {
        return {
          ...player,
          playingCount: (Number(player.playingCount) || 0) + 1
        };
      }
      return player;
    });
  
    setPlayers(updatedPlayers);
  
    // 로컬스토리지에 반영
    localStorage.setItem("players", JSON.stringify(updatedPlayers));
    localStorage.setItem("courts", JSON.stringify(temporaryCourts));
  
    // 임시 데이터 초기화
    setTemporaryCourts([...courts]);
    setAssignClicked(false); // Confirmation 버튼 비활성화
  }  

  return (
    <div>
      <div className='grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-5'>
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
      <div className='mt-4'>
        <RandomizeButton
          courts={courts}
          players={players}
          setPlayers={setPlayers}
          onAssignPlayers={onAssignPlayers}
          currentStartIndex={currentStartIndex}
          updateStartIndex={setTempStartIndex} // 임시 인덱스 업데이트
        ></RandomizeButton>
        {/* Change Players 버튼 추가 */}
        <button
          onClick={handleChangePlayers}
          className='px-4 py-2 bg-green-500 text-white rounded-md ml-2'
        >
          Change Players
        </button>
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
      </div>
    </div>
  );
}

export default Assignment;
