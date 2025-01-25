import React, { useRef } from 'react';

function RandomizeButton({
  courts,
  players,
  setPlayers,
  onAssignPlayers,
  currentStartIndex,
  updateStartIndex
}) {
  const totalPlayers = players.length;
  const courtsAvailable = courts.filter((court) => court.isSelected);
  const isCourtsUnavailable = courtsAvailable.length === 0;
  const isPlayersUnavailable = totalPlayers === 0;
  const shouldBeDisabled = isCourtsUnavailable || isPlayersUnavailable;

  function handleRandomize() {
    // 선택된 코트 필터링
    const courtsAvailable = courts.filter((court) => court.isSelected);
  
    // 예외 처리: 선택된 코트가 없을 경우
    if (courtsAvailable.length === 0) {
      alert("No courts selected! Please select at least one court.");
      return;
    }
  
    // 예외 처리: 선택된 코트가 하나일 경우
    if (courtsAvailable.length === 1) {
      alert("Randomization is not necessary for a single court!");
      return;
    }
  
    // 예외 처리: 플레이어가 충분하지 않을 경우
    const batchSize = courtsAvailable.length * 4;
    if (players.length < batchSize) {
      alert(`Not enough players to fill ${courtsAvailable.length} courts!`);
      return;
    }
  
    // 각 코트에 랜덤으로 플레이어 배치
    const courtAssignments = {};
    courtsAvailable.forEach((court) => {
      courtAssignments[court.courtIndex] = [];
    });
  
    // 현재 배치할 플레이어 그룹 (랜덤으로 섞기)
    const currentBatch = players
      .slice(currentStartIndex.current, currentStartIndex.current + batchSize)
      .sort(() => Math.random() - 0.5);
  
    // 랜덤 배치
    currentBatch.forEach((player, index) => {
      const courtIndex = courtsAvailable[index % courtsAvailable.length].courtIndex;
      courtAssignments[courtIndex].push(player);
    });
  
    // 코트 배치 결과 전달
    onAssignPlayers(courtAssignments);
  }  
  return (
    <button
      className={`px-4 py-2 text-white font-semibold rounded-md shadow-md transition-all duration-200 ${
        !shouldBeDisabled
          ? 'bg-blue-500 hover:bg-blue-600'
          : 'bg-gray-300 cursor-default'
      }`}
      disabled={shouldBeDisabled}
      onClick={() => handleRandomize()}
    >
      Assign Players
    </button>
  );
}
export default RandomizeButton;
