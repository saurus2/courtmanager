import React from 'react';
import Court from './Court';

export default function CourtStatus({
  numTotCourts,
  courtSelections,
  onCourtClick,
  assignments
}) {
  return (
    <div className='grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-5'>
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
          <div>names</div>
        </div>
      ))}
    </div>
  );
}
