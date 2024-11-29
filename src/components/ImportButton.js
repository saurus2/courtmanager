import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import StatusTable from './StatusTable';

const ImportButton = ({ shouldShowTestButton }) => {
  const [fileData, setFileData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setFileData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const handleTestFile = async () => {
    const response = await fetch('/data/data_01.xlsx');
    const fileData = await response.blob();
    const testFile = new File([fileData], 'testData.xlsx', {
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
    <div>
      <button>
        <label htmlFor='fileInput' style={{ cursor: 'pointer' }}>
          Import Excel
        </label>
      </button>
      <input
        type='file'
        id='fileInput'
        style={{ display: 'none' }}
        accept='.xlsx, .xls'
        onChange={handleFileChange}
      />
      {shouldShowTestButton && (
        <button onClick={handleTestFile}>
          <label style={{ cursor: 'pointer' }}>Test Excel</label>
        </button>
      )}
      {fileData && (
        <div>
          <StatusTable fileData={fileData} />
        </div>
      )}
    </div>
  );
};

export default ImportButton;
