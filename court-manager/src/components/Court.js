import React from 'react';

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
        className={`flex flex-col rounded-lg px-4 py-16 items-center justify-center cursor-pointer text-black
          ${isSelected ? 'bg-blue-500 scale-100 court-selected' : 'bg-blue-200 court-unselected'}  /* 선택 여부에 따라 배경색과 크기 조절 */
          hover:bg-blue-500
          transition-transform duration-300 ease-in-out  /* 크기 변화 시 부드럽게 전환 */
          
        `}
        style={{ flex: isSelected ? '1 1 50%' : '1 1 10%' }}  /* 크기에 따라 공간 자동 조절 및 간격 추가 */
    >
      <div className='font-bold text-xl'>Court {courtIndex + 1}</div>
      <ul className='grid grid-cols-2 gap-x-2 list-none p-0 m-0'>
      {players.map((player, i) => {
          const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(player.name); // 한글 여부 판별
          return (
            <li
              key={i}
              onClick={(e) => {
                e.stopPropagation(); // 부모 div의 onClick 이벤트와 충돌 방지
                onPlayerClick(player, courtIndex); // 플레이어 클릭 핸들러 호출
              }}
              className={`cursor-pointer rounded px-2 py-1 min-h-[40px] min-w-[70px] h-full court-name flex items-center
                font-sans antialiased leading-none ${
                  player.isSelected
                    ? 'bg-blue-700 text-white font-bold'
                    : isSelected
                    ? 'bg-blue-500 text-black'
                    : 'bg-blue-200 text-black'
                } hover:bg-blue-600 ${isKorean ? 'korean-name' : 'english-name'}`} // 한글/영어 클래스 추가
            >
              {player.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}