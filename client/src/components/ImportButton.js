import * as XLSX from 'xlsx';
import React from 'react';
import moment from 'moment-timezone';
import { FaFileImport, FaUndoAlt, FaUserPlus, FaPlay } from 'react-icons/fa';
import axios from 'axios';
import { fetchPlayers } from '../api';

const ImportButton = ({
  shouldShowTestButton,
  setPlayers,
  setCourts,
  currentStartIndex,
  setCurrentStartIndex,
  isAssignmentCompleted,
  setIsAssignmentCompleted
}) => {
  // ID 생성 함수: 모든 플레이어 리스트에서 ID를 오름차순으로 생성
  function assignSequentialIds(players) {
    return players.map((player, index) => ({
      ...player,
      id: (index + 1).toString() // 오름차순 ID 생성 (1부터 시작)
    }));
  }

  // 플레이어 정렬 및 ID 할당
  function getSortedPlayers(fileData) {
    const validPlayers = fileData.filter(
      (d) =>
        d['Checked In'] !== undefined &&
        (d['Checked In'] === 'Yes' || d['Checked In'] === 'No')
    );
    const simplifiedPlayers = validPlayers.map((d) => ({
      name: d.Name,
      checkedIn: d['Checked In'] === 'Yes' ? 'Y' : 'N',
      checkInDate:
        d['Check-in Date'] === ''
          ? ''
          : moment(d['Check-in Date'], 'YYYY-MM-DD hh:mmA Z').toDate(),
      playingCount: d['Checked In'] === 'Yes' ? '0' : ''
    }));
    const sortedPlayers = simplifiedPlayers.sort((a, b) => {
      if (a.checkInDate === '' && b.checkInDate === '') {
        return 0; // both empty, keep original order
      }
      if (a.checkInDate === '') {
        return 1; // a is empty, b comes first
      }
      if (b.checkInDate === '') {
        return -1; // b is empty, a comes first
      }
      return a.checkInDate - b.checkInDate;
    });
    return sortedPlayers;
  }

  async function savePlayersToDB(players, setPlayers) {
    for (const player of players) {
      await axios.post('http://localhost:4000/api/players', {
        name: player.name,
        checkInDate: player.checkInDate || new Date(),
        playingCount: player.playingCount || 0
      });
    }
    const res = await fetchPlayers();
    const sorted = res.data.sort((a, b) => a.sort_order - b.sort_order);
    setPlayers(sorted);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        (async () => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const fileData = XLSX.utils.sheet_to_json(sheet);

        const filteredData = fileData.filter(
          (player) => player['Checked In'] === 'Yes'
        );

        const sortedPlayers = getSortedPlayers(filteredData);

        // // 기존 플레이어와 병합 후 ID 재할당
        // setPlayers((prevPlayers) => {
        //   const updatedPlayers = assignSequentialIds([
        //     ...prevPlayers,
        //     ...sortedPlayers
        //   ]);
        //   localStorage.setItem('players', JSON.stringify(updatedPlayers)); // LocalStorage에 저장
        //   // ⭐ 수정: isAssignmentCompleted가 true이고 currentStartIndex가 기존 리스트 범위 내일 때만 첫 번째 새 플레이어로 설정
        //   if (isAssignmentCompleted && currentStartIndex < prevPlayers.length && prevPlayers.length > 0) {
        //     setCurrentStartIndex(prevPlayers.length);
        //   }
        //   return updatedPlayers;
        // });

        // 기존 players 길이(추가 전)
        const previousPlayers = await fetchPlayers();
        const previousLength = previousPlayers.data.length;

        // DB 저장 + 새 players fetch
        await savePlayersToDB(sortedPlayers, setPlayers);

        // currentStartIndex 업데이트 (원본 의도 유지)
        if (
          isAssignmentCompleted &&
          currentStartIndex < previousLength &&
          previousLength > 0
        ) {
          setCurrentStartIndex(previousLength);
        }     
        })();
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // 데이터 초기화
  const handleResetData = async () => {
    const confirmReset = window.confirm('Do you want to reset?');
    if (confirmReset) {
    try {
      // 서버에 플레이어 전체 삭제 요청
      await axios.delete('http://localhost:4000/api/players/reset');
      
      // 클라이언트 상태 초기화
      setPlayers([]);
      setCourts((prevCourts) =>
        prevCourts.map((court) => ({
          ...court,
          isSelected: false,
          players: []
        }))
      );

      // 필요 시 다른 상태 초기화도 추가 가능

      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('Reset failed:', error);
      alert('Reset failed. Please try again.');
    }
  }
};

  const handleTestFile = async () => {
    const response = await fetch('/data/data_01.xlsx');
    const fileBlob = await response.blob();
    const testFile = new File([fileBlob], 'testData.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const fakeEvent = {
      target: {
        files: [testFile]
      }
    };
    handleFileChange(fakeEvent);
  };

  return (
    <div className='flex items-center space-x-4 mb-3'>
      <label
        htmlFor='fileInput'
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md cursor-pointer transition-all duration-200"
      >
        <FaFileImport /> Import
      </label>
      <input
        type='file'
        id='fileInput'
        style={{ display: 'none' }}
        accept='.xlsx, .xls'
        onChange={handleFileChange}
      />
      {shouldShowTestButton && (
        <button
          onClick={handleTestFile}
          className='px-4 py-1 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition-all duration-200 text-sm'
        >
          Test Excel
        </button>
      )}
      <button
        onClick={handleResetData}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200"
      >
        <FaUndoAlt /> Reset
      </button>
    </div>
  );
};

export default ImportButton;
