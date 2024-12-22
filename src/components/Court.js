import React from 'react';

export default function Court({ i, isSelected, onClick }) {
  return (
    <div
      onClick={() => onClick(i)}
      className={`w-32 h-32 rounded-lg border border-black flex items-center justify-center  font-bold text-xl cursor-pointer text-black
    ${isSelected ? 'bg-blue-500' : 'bg-blue-200 '}  
    hover:bg-blue-500 `}
    >
      Court {i + 1}
    </div>
  );
}
