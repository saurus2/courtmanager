import React from 'react';

function StatusTable({ players }) {
  // return (
  //   <div>
  //     <pre>{JSON.stringify(players, null, 2)}</pre>
  //   </div>
  // );
  function getTime(checkInDate) {
    if (checkInDate === '') {
      return '';
    }
    const date = new Date(checkInDate);
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Los_Angeles'
    };
    return date.toLocaleTimeString('en-US', options);
  }

  const handleRandomize = () => {};

  return (
    <div>
      <span style={{ marginRight: '10px' }}>RANDOMIZE?</span>
      <button onClick={handleRandomize}>GO</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Checked In</th>
            <th>Check-in Time</th>
            <th># Games Played</th>
          </tr>
        </thead>
        <tbody>
          {players && players.length > 0 ? (
            players.map((player, i) => (
              <tr key={i}>
                <td>{player.name}</td>
                <td>{player.checkedIn}</td>
                <td>{getTime(player.checkInDate)}</td>
                <td>{player.noGamePlayed}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4'>No players available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StatusTable;
