import React, { useState } from 'react';
import RandomizeButton from './RandomizeButton';
import CourtStatus from './CourtStatus';

function Assignment({ numTotCourts, players, assignments, setAssignments }) {
  const [courtSelections, setCourtSelections] = useState(
    Array({ numTotCourts }).fill(false)
  );

  const onCourtClick = (i) => {
    const _courtSelections = [...courtSelections];
    _courtSelections[i] = !courtSelections[i];
    setCourtSelections(_courtSelections);
  };

  return (
    <div>
      <CourtStatus
        numTotCourts={numTotCourts}
        courtSelections={courtSelections}
        onCourtClick={onCourtClick}
        assignments={assignments}
      ></CourtStatus>
      <div className='mt-4'>
        <RandomizeButton
          courtSelections={courtSelections}
          players={players}
          setAssignments={setAssignments}
        ></RandomizeButton>
      </div>
    </div>
  );
}

export default Assignment;
