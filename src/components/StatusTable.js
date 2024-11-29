import React from 'react';

function StatusTable({ players }) {
  return (
    <div>
      <pre>{JSON.stringify(players, null, 2)}</pre>
    </div>
  );
}

export default StatusTable;
