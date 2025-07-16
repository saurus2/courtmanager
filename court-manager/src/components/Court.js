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
    // <div
    //     onClick={() => onCourtSelected(courtIndex)}
    //     className={`flex flex-col rounded-lg px-4 py-16 items-center justify-center cursor-pointer text-black
    //   ${isSelected ? 'bg-blue-500' : 'bg-blue-200 '}  
    //   hover:bg-blue-500 `}
    // >
    <div
      onClick={() => onCourtSelected(courtIndex)}
      className={`flex flex-col rounded-lg px-3 py-6 items-center justify-start cursor-pointer
        ${isSelected ? 'bg-blue-600' : 'bg-blue-300'}
        hover:bg-blue-600 text-white transition-all duration-200`}
    >
      {/* <div className='font-bold text-xl'>Court {courtIndex + 1}</div> */}
      {/* <ul className='grid grid-cols-2 gap-x-2 list-none p-0 m-0'>
      {players.map((player, i) => {
          return (
            <li
              key={i}
              onClick={(e) => {
                e.stopPropagation(); // 부모 div의 onClick 이벤트와 충돌 방지
                onPlayerClick(player, courtIndex); // 플레이어 클릭 핸들러 호출
              }}
              className={`cursor-pointer rounded px-2 py-1 min-h-[40px] min-w-[70px] court-name flex items-center
                font-sans antialiased leading-none ${
                  player.isSelected
                    ? 'bg-blue-700 text-white font-bold'
                    : isSelected
                    ? 'bg-blue-500 text-black'
                    : 'bg-blue-200 text-black'
                } hover:bg-blue-600`} // 한글/영어 클래스 추가
            >
              {player.name}
            </li>
          );
        })}
      </ul> */}
      {/* 상단 Court 타이틀 */}
      <div className='font-bold text-2xl mb-1'>Court {courtIndex + 1}</div>

      {/* 세로 리스트 */}
      <ul className='flex flex-col space-y-0 w-full items-center'>
        {/* {players.map((player, i) => (
          <li
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onPlayerClick(player, courtIndex);
          }}
          className={`
            cursor-pointer px-2 py-1 rounded-md w-full text-center
            flex items-center justify-center
            transition-all duration-200
            ${player.isSelected
              ? 'font-extrabold border-2 border-white bg-white bg-opacity-20'
              : 'font-normal'}
            hover:bg-white hover:bg-opacity-10
          `}
          style={{
            height: '40px',
            lineHeight: '1.1',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: 'clamp(10px, 1.5vw, 18px)',
              maxWidth: '100%',
            }}
          >
            {player.name}
          </span>
        </li>
        ))} */}
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
  ))}
      </ul>
    </div>
  );
}