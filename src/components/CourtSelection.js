import React, { useState } from 'react';

function CourtSelection({ numTotCourts, onCourtSelect, courtAssignments= {} }) {
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
        padding: '20px',
      }}
    >
      {Array.from({ length: numTotCourts }, (_, i) => (
        <div
          key={i}
          onClick={() => handleSquareClick(i)} // Click Event
          style={{
            width: '150px',
            height: '150px',
            backgroundColor: 'lightblue',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            border: '1px solid darkblue',
            borderRadius: '8px',
            padding: '5px'
          }}
        >
          <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
            Court {i + 1}
          </div>
          <div>
            {courtAssignments[i + 1] && courtAssignments[i + 1].length > 0 ? (
              courtAssignments[i + 1].map((name, idx) => <div key={idx}>{name}</div>)
            ) : (
              <div>No Players</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourtSelection;
