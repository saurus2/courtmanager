import React, { useState } from 'react';

function HowToUseButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 w-11 h-11 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg z-50"
        style={{ fontSize: '2rem' }}
      >
        ?
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">How to Use</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 transition duration-200 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Adding Players in Bulk</h3>
                <img src="/import_button.png" alt="Import Excel Button" className="mb-2 rounded shadow" />
                <p>
                  Click the "Import Excel" button. Open the Excel file, and the players will be added to the list, sorted by check-in time. The Excel file must contain the columns: Name, Check In, and Check-in Date.
                </p>
                <p>Full list completed</p>
                <img src="/full_list.png" alt="Full List"></img>
                <p>Excel file format</p>
                <img src="/excel_format.png" alt="Excel Format" className="mt-2 rounded shadow" />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">2. Adding Players Manually</h3>
                <img src="/add_new_player.png" alt="Add New Player Button" className="mb-2 rounded shadow" />
                <p>
                  Click the "Add New Player" button, enter the player’s name, and click "Add." The player will be added to the end of the list, and the total player count will increase.
                </p>
                <img src="/add_player_window.png" alt="Add Player Modal" className="mt-2 rounded shadow" />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">3. Resetting Data</h3>
                <img src="/reset_data.png" alt="Reset Data Button" className="mb-2 rounded shadow" />
                <p>
                  Click the "Reset Data" button to clear all data.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4. Deleting Players and Adjusting Game Counts</h3>
                <img src="/selected_player.png" alt="Player List Controls" className="mb-2 rounded shadow" />
                <p>
                  Click on a player's name in the list. Click the red "-" button to remove the player. Use the buttons next to the game count to manually adjust the number of games.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">5. Assigning Players to Courts</h3>
                <img src="/courts.png" alt="Court Selection" className="mb-2 rounded shadow" />
                <p>
                  Select the courts you wish to use from the 8 available courts. Click the "Assign Players" button to randomly assign 4 players per court. Click the "Confirmation" button to save the game counts and prepare for the next round.
                </p>
                <img src="/assign_button.png" alt="Assign Players Button" className="mt-2 rounded shadow" />
                <img src="/confirmation_button.png" alt="Confirmation Button" className="mt-2 rounded shadow" />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">6. Switching Players Between Courts</h3>
                <img src="/exchange_players.png" alt="Court Players Before Switch" className="mb-2 rounded shadow" />
                <p>
                  Click a player's name on one court (only one player can be selected per court). Select another player from a different court, then click the "Change Players" button to swap them. After switching, click the "Confirmation" button.
                </p>
                <img src="/change_button.png" alt="Change Players Button" className="mt-2 rounded shadow" />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">7. Locking Court Selection</h3>
                <img src="/lock_button.png" alt="Lock Toggle Switch" className="mb-2 rounded shadow" />
                <p>
                  Use the Lock/Unlock toggle switch at the top right to lock courts, preventing accidental changes during player selection or switching.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">8. Using the Special List</h3>
                <img src="/special_list.png" alt="Special List Off" className="mb-2 rounded shadow" />
                <p>
                  To prioritize certain players, click the "Add Special" button to add them to the Special List. Enable the list using the On/Off toggle switch. When "Assign Players" is clicked, players from the Special List will be assigned first.
                </p>
                <img src="/special_list_on.png" alt="Special List On" className="mt-2 rounded shadow" />
                <p>
                  You can adjust game counts manually or remove players using the "Remove" button. Follow the same process: enable the list, add players, assign them, switch if needed, and confirm.
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HowToUseButton;
