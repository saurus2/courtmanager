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
    // 현재 시작 인덱스가 리스트 길이를 초과하지 않도록 조정
    if (currentStartIndex.current >= totalPlayers) {
      currentStartIndex.current = 0;
    }

    const courtAssignments = {};
    // Initializing court number
    courtsAvailable.forEach((court) => {
      courtAssignments[court.courtIndex] = []; // Initializing players on each court
    });

    // The number of player for handling
    const batchSize = courtsAvailable.length * 4;

    // Calculating index of the end of group
    const endIndex = Math.min(
      currentStartIndex.current + batchSize,
      totalPlayers
    );

    // The player group for game now
    const currentBatch = [
      ...players.slice(currentStartIndex.current, endIndex),
      ...players.slice(
        0,
        Math.max(0, currentStartIndex.current + batchSize - totalPlayers)
      )
    ];

    // Mixing
    const shuffledBatch = currentBatch.sort(() => Math.random() - 0.5);

    shuffledBatch.forEach((player, index) => {
      const courtIndex =
        courtsAvailable[index % courtsAvailable.length].courtIndex;
      courtAssignments[courtIndex].push(player);
    });
    
    const newStartIndex =
      (currentStartIndex.current + batchSize) % totalPlayers;
    currentStartIndex.current = newStartIndex;
    updateStartIndex(newStartIndex);
    // setPlayers(updatedPlayers);
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
