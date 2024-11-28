import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ImportButton = () => {
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
        console.log(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
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
      {fileData && (
        <div>
          <pre>{JSON.stringify(fileData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ImportButton;
