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
  updateStartIndex 
}) {
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  // saving updated courts data on localStorage
  useEffect(() => {
    localStorage.setItem('courts', JSON.stringify(courts));
  }, [courts]);

  function onCourtSelected(courtIndex) {
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
    setCourts(updatedCourts);
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
          updateStartIndex={updateStartIndex}
        ></RandomizeButton>
        {/* Change Players 버튼 추가 */}
        <button
          onClick={handleChangePlayers}
          className='px-4 py-2 bg-green-500 text-white rounded-md ml-2'
        >
          Change Players
        </button>
      </div>
    </div>
  );
}

export default Assignment;
