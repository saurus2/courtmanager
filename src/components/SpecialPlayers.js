import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const SpecialPlayers = forwardRef(({ specialPlayers, setSpecialPlayers, isSpecialEnabled, setIsSpecialEnabled }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
  
    // ✅ 초기 로딩 시 1회만 실행되도록 수정
    useEffect(() => {
        if (isLoading) {
        const savedSpecialPlayers = localStorage.getItem('specialPlayers');
        if (savedSpecialPlayers) {
            setSpecialPlayers(JSON.parse(savedSpecialPlayers));
        }
        setIsLoading(false);
        }
    }, [isLoading]); // ✅ isLoading 상태 기반으로 실행하여 무한 루프 방지

    // ✅ Special List 변경 시 로컬 스토리지에 저장 (불필요한 렌더링 방지)
    useEffect(() => {
        if (!isLoading) {
        localStorage.setItem('specialPlayers', JSON.stringify(specialPlayers));
        }
    }, [specialPlayers]); // ✅ 최초 렌더링 후 상태 변경될 때만 저장

  // 새 플레이어 추가
  const addSpecialPlayer = () => {
    const playerName = prompt('Enter player name:');
    if (!playerName || playerName.trim() === '') return;

    const maxId = specialPlayers.reduce((max, player) => {
      const idNum = parseInt(player.id, 10);
      return idNum > max ? idNum : max;
    }, 0);

    const newPlayer = {
      id: (maxId + 1).toString(),
      name: playerName.trim(),
      playingCount: 0
    };

    setSpecialPlayers([...specialPlayers, newPlayer]);
  };

  // SpecialPlayers 내부 함수를 App.js에서 사용할 수 있도록 등록
  useImperativeHandle(ref, () => ({
    addSpecialPlayer
  }));

  // 플레이어 삭제
  const removeSpecialPlayer = (id) => {
    setSpecialPlayers(specialPlayers.filter(player => player.id !== id));
  };

  // 게임 횟수 업데이트
  const updatePlayingCount = (id, increment) => {
    setSpecialPlayers(specialPlayers.map(player => {
      if (player.id === id) {
        return { ...player, playingCount: Math.max(player.playingCount + increment, 0) };
      }
      return player;
    }));
  };

  // Special List 리셋
  const resetSpecialList = () => {
    if (window.confirm('Special List를 초기화하시겠습니까?')) {
      setSpecialPlayers([]);
      localStorage.removeItem('specialPlayers');
    }
  };

  return (
    <div className='p-4 border rounded-lg bg-gray-100'>
      {/* 최대 4명까지 보이고 초과 시 스크롤 가능하도록 max-h-40 설정 */}
      <ul className='list-none p-0 max-h-40 overflow-y-auto'>
        {specialPlayers.map(player => (
          <li key={player.id} className='flex justify-between items-center bg-white p-2 mb-1 rounded shadow'>
            <span>{player.name}</span>
            <div className='flex items-center'>
              <button onClick={() => updatePlayingCount(player.id, -1)} className='px-2 py-1 bg-red-500 text-white rounded'>-</button>
              <span className='px-2'>{player.playingCount}</span>
              <button onClick={() => updatePlayingCount(player.id, 1)} className='px-2 py-1 bg-green-500 text-white rounded'>+</button>
              <button onClick={() => removeSpecialPlayer(player.id)} className='ml-2 px-2 py-1 bg-gray-500 text-white rounded'>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default SpecialPlayers;
