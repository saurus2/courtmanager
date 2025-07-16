import React from 'react';
import AutoShrinkText from './AutoShrinkText';

export default function Court({
  courtIndex,
  isSelected,
  onCourtSelected,
  players,
  onPlayerClick
}) {
  return (
    <div
      onClick={() => onCourtSelected(courtIndex)}
      className={`flex flex-col rounded-lg px-3 py-6 items-center justify-start cursor-pointer
        ${isSelected ? 'bg-blue-600 hover:bg-indigo-600' : 'bg-blue-400 hover:bg-indigo-400'}
        hover:bg-blue-600 text-white transition-all duration-200`}
        style={{ 
          minWidth: '180px', 
          maxWidth: '200px',
          minHeight: '260px', 
          maxHeight: '260px'
        }}
    >
      {/* 상단 Court 타이틀 */}
      <div className='font-bold text-2xl mb-1'>Court {courtIndex + 1}</div>

      {/* 세로 리스트 */}
      <ul className='flex flex-col space-y-0 w-full items-center'>
        {players.map((player, i) => (
        <li
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onPlayerClick(player, courtIndex);
          }}
          className="w-full h-[40px] flex items-center justify-center cursor-pointer"
        >
          <AutoShrinkText text={player.name} isSelected={player.isSelected} />
        </li>
        ))
        }
      </ul>
    </div>
  );
}