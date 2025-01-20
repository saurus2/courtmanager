import * as XLSX from 'xlsx';
import React, { Component } from 'react';
import moment from 'moment-timezone';

const ImportButton = ({ shouldShowTestButton, setPlayers, setCourts}) => {
  function getSortedPlayers(fileData) {
    const validPlayers = fileData.filter(
      (d) =>
        d['Checked In'] !== undefined &&
        (d['Checked In'] === 'Yes' || d['Checked In'] === 'No')
    );
    const simplifiedPlayers = validPlayers.map((d, i) => ({
      id: '00' + i,
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
      // Sort by checkInDate for valid dates
      return a.checkInDate - b.checkInDate;
    });
    return sortedPlayers;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const fileData = XLSX.utils.sheet_to_json(sheet);

        const filteredData = fileData.filter(
          (player) => player['Checked In'] === 'Yes'
        );

        const sortedPlayers = getSortedPlayers(filteredData);
        // saving updated data on localStorage directly
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers, ...sortedPlayers];
          localStorage.setItem('players', JSON.stringify(updatedPlayers));
          return updatedPlayers;
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // data reset function
  const handleResetData = () => {
    const confirmReset = window.confirm('Do you want to reset?'); // 확인 창
    if (confirmReset) {
      // ✅ localStorage 데이터 초기화
      localStorage.removeItem('players');
      localStorage.removeItem('courts');
      localStorage.removeItem('currentStartIndex');
      // ✅ React 상태 초기화
      setPlayers([]); // 플레이어 초기화
      setCourts((prevCourts) =>
        prevCourts.map((court) => ({
          ...court,
          isSelected: false, // 코트 선택 상태 초기화
          players: [] // 배정된 플레이어 초기화
        }))
      );
      alert('All data has been reset.'); // 알림 메시지
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
        className='px-4 py-1 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 cursor-pointer transition-all duration-200 text-sm'
        style={{ display: 'inline-block', textAlign: 'center' }}
      >
        Import Excel
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
        className='px-4 py-1 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition-all duration-200 text-sm'
      >
        Reset Data
      </button>
    </div>
  );
};

export default ImportButton;
