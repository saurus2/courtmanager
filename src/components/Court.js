import React from 'react';
import AutoShrinkText from './AutoShrinkText';

export default function Court({
  readOnly,
  courtIndex,
  isSelected,
  onCourtSelected,
  players,
  onPlayerClick
}) {
  return (
    <div
      // Member 모드에서는 클릭 이벤트 차단
      onClick={readOnly ? undefined : () => onCourtSelected(courtIndex)}   // ★ 추가
      className={`flex flex-col rounded-lg px-3 py-6 items-center justify-start 
      ${readOnly ? "cursor-default" : "cursor-pointer"}                // ★ 추가
      ${isSelected ? "bg-blue-600 hover:bg-indigo-600" : "bg-blue-400 hover:bg-indigo-400"} 
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
      <ul className="flex flex-col space-y-0 w-full items-center">
        {players.map((player, i) => (
          <li
            key={i}
            // Member 모드일 때 클릭 차단
            onClick={
              readOnly
                ? undefined
                : (e) => {
                  e.stopPropagation();
                  onPlayerClick(player, courtIndex);
                }
            }
            className={`w-full h-[40px] flex items-center justify-center ${readOnly ? "cursor-default" : "cursor-pointer"
              }`}
          >
            <AutoShrinkText text={player.name} isSelected={player.isSelected} />
          </li>
        ))}
      </ul>

    </div>
  );
}