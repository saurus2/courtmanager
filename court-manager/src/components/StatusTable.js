import React from 'react';
import moment from 'moment';

function StatusTable({ fileData }) {
  function getCheckInDate(timeStr) {
    return moment(timeStr, 'YYYY-MM-DD hh:mmA Z').toDate();
  }

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
      d['Check-in Date'] === '' ? '' : getCheckInDate(d['Check-in Date'])
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

  return (
    <div>
      {/* <pre>
        {JSON.stringify(
          [fileData.slice(0, 2), fileData[90], fileData[fileData.length - 5]],
          null,
          2
        )}
      </pre> */}
      <pre>{JSON.stringify(sortedPlayers, null, 2)}</pre>
    </div>
  );
}

export default StatusTable;
