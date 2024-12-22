import React from 'react';

function RandomizeButton({ courtSelections, players, setAssignments }) {
  return (
    <div>
      <button className='px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition-all duration-200'>
        Assign players
      </button>
    </div>
  );
}
export default RandomizeButton;
