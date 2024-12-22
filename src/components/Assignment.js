import React, { useState } from 'react';
import RandomizeButton from './RandomizeButton';
import Court from './Court';

function Assignment({ numTotCourts, players, setPlayers, currentStartIndex }) {
  const [courts, setCourts] = useState(
    Array(numTotCourts)
      .fill(null)
      .map((_, i) => ({
        courtIndex: i,
        isSelected: false,
        players: []
      }))
  );

  function onCourtSelected(courtIndex) {
    const _courts = [...courts];
    _courts[courtIndex] = {
      ...courts[courtIndex],
      isSelected: !courts[courtIndex].isSelected
    };
    setCourts(_courts);
  }

  function onAssignPlayers(courtAssignments) {
    const _courts = courts.map((court) => ({
      ...court,
      players: courtAssignments[court.courtIndex] || []
    }));
    setCourts(_courts);
  }

  return (
    <div>
      <div className='grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-5'>
        {courts.map((court, i) => (
          <div key={i}>
            <Court
              courtIndex={court.courtIndex}
              isSelected={court.isSelected}
              onCourtSelected={onCourtSelected}
              players={court.players}
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
        ></RandomizeButton>
      </div>
    </div>
  );
}

export default Assignment;
