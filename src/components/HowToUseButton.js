import React, { useState } from 'react';

function HowToUseButton() {
  // State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* How to Use Button */}
      <button
        onClick={openModal}
        className="fixed top-10 right-4 w-11 h-11 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg z-50"
        style={{
          fontSize: '2rem',
        }}
      >
        ?
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">How to Use</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 transition-all duration-200"
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-semibold">1. Adding Players</h3>
              <p>
                You can manually add players by clicking the "Add New Player"
                button. Enter the player's name, and they'll be added to the
                player list. Players can also be imported from an Excel file
                using the "Import Excel" button.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-md font-semibold">2. Selecting Courts</h3>
              <p>
                Once you've added players, you can select which courts you want
                to assign them to. Select the court(s) you'd like, and the app
                will automatically assign players to the selected courts. The
                assignment is done randomly.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-md font-semibold">3. Switching Players</h3>
              <p>
                If you'd like to switch players between different courts, you
                can do so by selecting two players on the same court and clicking
                the "Change Players" button. The two players will swap places.
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition-all duration-200"
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
