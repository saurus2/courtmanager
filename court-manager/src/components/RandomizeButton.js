import React, { useRef, useEffect } from 'react';

function RandomizeButton({
  courts,
  players,
  setPlayers,
  onAssignPlayers,
  currentStartIndex,
  updateStartIndex,
  specialPlayers,
  setSpecialPlayers,
  isSpecialEnabled
}) {
  const totalPlayers = players.length;
  const courtsAvailable = courts.filter((court) => court.isSelected);
  const isCourtsUnavailable = courtsAvailable.length === 0;
  const isPlayersUnavailable = totalPlayers === 0;
  const shouldBeDisabled = isCourtsUnavailable || isPlayersUnavailable;

  // ✅ SpecialPlayers 변경 감지하여 최신 상태 반영 (setSpecialPlayers를 사용하도록 수정)
  useEffect(() => {
    const handleUpdate = () => {
      const updatedSpecialPlayers = JSON.parse(localStorage.getItem('specialPlayers') || '[]');
      setSpecialPlayers(updatedSpecialPlayers);
    };

    window.addEventListener('updateSpecialPlayers', handleUpdate);

    return () => {
      window.removeEventListener('updateSpecialPlayers', handleUpdate);
    };
  }, [setSpecialPlayers]);

  function handleRandomize() {
    // 선택된 코트 필터링
    const courtsAvailable = courts.filter((court) => court.isSelected);
  
    // 예외 처리: 선택된 코트가 없을 경우
    if (courtsAvailable.length === 0) {
      alert("No courts selected! Please select at least one court.");
      return;
    }
  
    const batchSize = courtsAvailable.length * 4;
    
    // 예외 처리: 플레이어가 충분하지 않을 경우
    if (players.length < batchSize) {
      alert(`Not enough players to fill ${courtsAvailable.length} courts!`);
      return;
    }

    let currentBatch = [];

    // ✅ Special List 활성화된 경우, Special List 플레이어를 우선 배정
    let assignedPlayers = [];
    let playersToAssign = [...players];

    if (isSpecialEnabled) {
      assignedPlayers = [...specialPlayers]; // Special List 우선 배정
    }

    // ✅ Special List 플레이어가 먼저 배정됨
    currentBatch = [...assignedPlayers];

    // ✅ 기존 방식 유지: currentStartIndex를 활용하여 남은 슬롯 채우기
    if (currentBatch.length < batchSize) {
      if (currentStartIndex.current + (batchSize - currentBatch.length) > totalPlayers) {
        const endSlice = playersToAssign.slice(currentStartIndex.current);
        const startSlice = playersToAssign.slice(0, (batchSize - currentBatch.length) - endSlice.length);
        currentBatch = [...currentBatch, ...endSlice, ...startSlice];
      } else {
        currentBatch = [...currentBatch, ...playersToAssign.slice(currentStartIndex.current, currentStartIndex.current + batchSize - currentBatch.length)];
      }
    }

    // 현재 배치할 그룹을 랜덤으로 섞기
    currentBatch = currentBatch.sort(() => Math.random() - 0.5);

    // 코트에 플레이어 배정
    const courtAssignments = {};
    courtsAvailable.forEach((court) => {
      courtAssignments[court.courtIndex] = [];
    });
  
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
