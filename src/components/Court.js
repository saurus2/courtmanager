import React from 'react';

export default function Court({
  courtIndex,
  isSelected,
  onCourtSelected,
  players
}) {
  return (
    <div
      onClick={() => onCourtSelected(courtIndex)}
      className={`flex flex-col rounded-lg px-4 py-16 items-center justify-center cursor-pointer text-black
    ${isSelected ? 'bg-blue-500' : 'bg-blue-200 '}  
    hover:bg-blue-500 `}
    >
      <div className='font-bold text-xl'>Court {courtIndex + 1}</div>
      <ul className='grid grid-cols-2 gap-x-2 list-none p-0 m-0'>
        {players.map((player, i) => (
          <li key={i} className='text-white'>
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
