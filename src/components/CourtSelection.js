import React, { useState } from 'react';

function CourtSelection({ numTotCourts }) {
  const [selectedSquares, setSelectedSquares] = useState(
    Array({ numTotCourts }).fill(false)
  );

  const handleSquareClick = (i) => {
    setSelectedSquares((prevSelected) => {
      const updated = [...prevSelected];
      updated[i] = !updated[i];
      return updated;
    });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 50px)',
        gap: '10px'
      }}
    >
      {Array.from({ length: numTotCourts }, (_, i) => (
        <div
          key={i}
          onClick={() => handleSquareClick(i)}
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: selectedSquares[i] ? 'darkblue' : 'lightblue',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

export default CourtSelection;
