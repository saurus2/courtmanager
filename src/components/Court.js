import React from 'react';

export default function Court({ num, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-32 h-32 rounded-lg border-2 flex items-center justify-center text-white font-bold text-xl cursor-pointer
    ${isSelected ? 'bg-blue-700' : 'bg-blue-500'}  
    hover:bg-blue-600 transition duration-200`}
    >
      Court {num}
    </div>
  );
}
