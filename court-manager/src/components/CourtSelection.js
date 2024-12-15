import React, { useState } from 'react';
import Court from './Court';

function CourtSelection({
  numTotCourts,
  onCourtSelect,
  courtAssignments = {}
}) {
  const [selectedSquares, setSelectedSquares] = useState(
    Array({ numTotCourts }).fill(false)
  );

  const handleSquareClick = (i) => {
    const updatedSquares = [...selectedSquares];
    updatedSquares[i] = !updatedSquares[i];
    setSelectedSquares(updatedSquares);

    // Calling only once
    if (onCourtSelect) {
      const selectedCourts = updatedSquares
        .map((isSelected, index) => (isSelected ? index + 1 : null))
        .filter((courtNumber) => courtNumber !== null);
      onCourtSelect(selectedCourts);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '20px',
        padding: '20px'
      }}
    >
      {Array.from({ length: numTotCourts }, (_, i) => (
        <div>
          <Court num={i + 1} isSelected={selectedSquares[i]}></Court>
          {courtAssignments[i + 1] && courtAssignments[i + 1].length > 0 ? (
            courtAssignments[i + 1].map((name, idx) => (
              <div key={idx}>{name}</div>
            ))
          ) : (
            <div>No Players</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CourtSelection;
