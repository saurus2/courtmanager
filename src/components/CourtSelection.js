import React, { useState } from 'react';
import Court from './Court';

function CourtSelection({
  numTotCourts,
  onCourtSelect,
  courtAssignments = {}
}) {
  const [courtSelections, setCourtSelections] = useState(
    Array({ numTotCourts }).fill(false)
  );

  const onCourtClick = (i) => {
    const _courtSelections = [...courtSelections];
    _courtSelections[i] = !courtSelections[i];
    setCourtSelections(_courtSelections);

    // Calling only once
    // if (onCourtSelect) {
    //   const selectedCourts = updatedSquares
    //     .map((isSelected, index) => (isSelected ? index + 1 : null))
    //     .filter((courtNumber) => courtNumber !== null);
    //   onCourtSelect(selectedCourts);
    // }
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
        <div key={i}>
          <Court
            i={i}
            isSelected={courtSelections[i]}
            onClick={onCourtClick}
          ></Court>
          {/* {courtAssignments[i + 1] && courtAssignments[i + 1].length > 0 ? (
            courtAssignments[i + 1].map((name, idx) => (
              <div key={idx}>{name}</div>
            ))
          ) : (
            <div>No Players</div>
          )} */}
        </div>
      ))}
    </div>
  );
}

export default CourtSelection;
