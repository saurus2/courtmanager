import React, { useState } from 'react';

function StatusTable({ players, setPlayers }) {
  // return (
  //   <div>
  //     <pre>{JSON.stringify(players, null, 2)}</pre>
  //   </div>
  // );

  // The information for view
  const [displayedPlayers, setDisplayedPlayers] = useState(players);
  const [currentStartIndex, setCurrentStartIndex] = useState(0); // The variable for memorizing index for players

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

  const handleRandomize = (courtNumbers = [1, 2]) => { // courtNumber default is 4
    // Checking the courtNumbers is array
    if (!Array.isArray(courtNumbers)) {
      console.error('Invalid courtNumbers. Using default: [1, 2]');
      courtNumbers = [1, 2]; // Default
    }

    // Filtering players who is checked in only
    const playersCheckedIn = players.filter((player) => 
      player.checkedIn === 'Y');
    
    if (playersCheckedIn.length === 0) {
      console.error('No players are checked in!');
      return;
    }

    // JSON object
    const courtAssignments = {};

    // Initializing court number
    courtNumbers.forEach((courtNumber) => {
      courtAssignments[courtNumber] = []; // Initializing players on each court
    });

    // The number of player for handling
    const batchSize = courtNumbers.length * 4;

    // Calculating index of the end of group
    const endIndex = Math.min(currentStartIndex + batchSize, playersCheckedIn.length);

    // The player group for game now
    const currentBatch = playersCheckedIn.slice(currentStartIndex, endIndex).concat(
      playersCheckedIn.slice(0, Math.max(0, currentStartIndex + batchSize - playersCheckedIn.length))
    );

    const updatedPlayers = players.map((player) => {
      if (currentBatch.includes(player)) {
        return {
          ...player,
          playingCount: (parseInt(player.playingCount, 10) || 0) + 1,
        };
      }
      return { ...player };
    });

    // Mixing
    const shuffledBatch = currentBatch.sort(() => Math.random() - 0.5);

    // Assigning 4 players on each court
    shuffledBatch.forEach((player, index) => {
      const courtIndex = courtNumbers[index % courtNumbers.length];
      courtAssignments[courtIndex].push(player);
    });
    
    setPlayers(updatedPlayers); 
    setCurrentStartIndex((currentStartIndex + batchSize) % playersCheckedIn.length);
    
    console.log('Court Assignments:', courtAssignments);
    console.log('Next Start Index:', currentStartIndex); // 디버깅용 로그
  };

  const handleShowList = () => {
    setDisplayedPlayers(players); // 모든 플레이어를 표시
  };

  return (
    <div>
      <span style={{ marginRight: '10px' }}>RANDOMIZE?</span>
      <button onClick={handleRandomize}>GO</button>
      <button onClick={handleShowList} style={{ marginLeft: '10px' }}>
        SHOW LIST
      </button>
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
                <td>{player.playingCount}</td>
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
