import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import ImportButton from './components/ImportButton';
import StatusTable from './components/StatusTable';
import Assignment from './components/Assignment';
import HowToUseButton from './components/HowToUseButton';
import SpecialPlayers from './components/SpecialPlayers';
import { FaFileImport, FaUndoAlt, FaUserPlus, FaPlay } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";



function AdminPage(props) {
    // loading data from localStorage when components are mounted
    const [players, setPlayers] = useState(() => {
        const savedPlayers = localStorage.getItem('players');
        return savedPlayers ? JSON.parse(savedPlayers) : [];
    });

    const [selectedListPlayer, setSelectedListPlayer] = useState(null); // 🔥 App.js에서 관리
    const [playingStatus, setPlayingStatus] = useState(() => {
        const savedStatus = localStorage.getItem("playingStatus");
        return savedStatus ? JSON.parse(savedStatus) : {};
    });

    // Handling index on local
    const [currentStartIndex, setCurrentStartIndex] = useState(() => {
        const savedIndex = localStorage.getItem('currentStartIndex');
        return savedIndex ? parseInt(savedIndex, 10) : 0;
    });

    // ⭐ 수정: 상태 추가 (약 28번째 줄 근처, courts 상태 아래)
    const [isAssignmentCompleted, setIsAssignmentCompleted] = useState(() => {
        return localStorage.getItem('isAssignmentCompleted') === 'true';
    });

    // ⭐ 수정: 상태 추가 (약 28번째 줄 근처, isAssignmentCompleted 아래)
    const [hasSetNewStartIndex, setHasSetNewStartIndex] = useState(() => {
        return localStorage.getItem('hasSetNewStartIndex') === 'true';
    });

    // ⭐ 수정: 상태 추가 (약 28번째 줄 근처, hasSetNewStartIndex 아래)
    const [isSetStartModalOpen, setIsSetStartModalOpen] = useState(false);
    const [inputId, setInputId] = useState('');

    // ⭐ 추가: 모달 핸들러 함수 (약 100번째 줄 근처, addPlayer 아래)
    const openSetStartModal = () => setIsSetStartModalOpen(true);

    const closeSetStartModal = () => {
        setIsSetStartModalOpen(false);
        setInputId('');
    };

    const confirmSetStart = () => {
        if (!inputId.trim()) {
            alert('ID cannot be empty!');
            return;
        }

        const playerIndex = players.findIndex(player => player.id === inputId.trim());
        if (playerIndex === -1) {
            alert('Invalid ID. Please enter an existing player ID.');
            return;
        }

        setCurrentStartIndex(playerIndex);
        closeSetStartModal();
    };

    // SpecialPlayers 컴포넌트의 ref 생성
    const specialPlayersRef = useRef(null);

    const [courts, setCourts] = useState(() => {
        const savedCourts = localStorage.getItem('courts');
        return savedCourts
            ? JSON.parse(savedCourts)
            : Array(8).fill(null).map((_, i) => ({
                courtIndex: i,
                isSelected: false,
                players: []
            }));
    });

    const [isLocked, setIsLocked] = useState(false); // Lock 상태 관리

    // Special List 관련 상태 추가
    const [specialPlayers, setSpecialPlayers] = useState(() => {
        const savedSpecialPlayers = localStorage.getItem('specialPlayers');
        return savedSpecialPlayers ? JSON.parse(savedSpecialPlayers) : [];
    });

    const [isSpecialEnabled, setIsSpecialEnabled] = useState(() => {
        return localStorage.getItem('isSpecialEnabled') === 'true';
    });

    // 🔥🔥🔥 새로 추가: Assignment 상태 관리
    const [assignStatus, setAssignStatus] = useState({
        assignClicked: false,
        isRollbackAllowed: false
    });

    // 최대 플레이어 ID 계산 (일반 플레이어 + Special List)
    const maxPlayerId = Math.max(
        players.reduce((max, player) => {
            const idNum = parseInt(player.id, 10);
            return idNum > max ? idNum : max;
        }, 0),
        specialPlayers.reduce((max, player) => {
            const idNum = parseInt(player.id, 10);
            return idNum > max ? idNum : max;
        }, 0)
    );

    // ⭐ 추가: hasSetNewStartIndex 로컬 스토리지 저장 (약 66번째 줄 근처, useEffect 블록 안)
    useEffect(() => {
        localStorage.setItem('hasSetNewStartIndex', hasSetNewStartIndex.toString());
    }, [hasSetNewStartIndex]);

    // ⭐ 추가: isAssignmentCompleted가 false로 변경 시 hasSetNewStartIndex 리셋 (약 66번째 줄 근처, useEffect 블록 안)
    useEffect(() => {
        if (!isAssignmentCompleted) {
            setHasSetNewStartIndex(false);
        }
    }, [isAssignmentCompleted]);

    // ⭐ 추가: isAssignmentCompleted 로컬 스토리지 저장 (약 66번째 줄 근처, useEffect 블록 안)
    useEffect(() => {
        localStorage.setItem('isAssignmentCompleted', isAssignmentCompleted.toString());
    }, [isAssignmentCompleted]);

    // Special List 상태 로컬 스토리지 저장
    useEffect(() => {
        localStorage.setItem('specialPlayers', JSON.stringify(specialPlayers));
    }, [specialPlayers]);

    useEffect(() => {
        localStorage.setItem('isSpecialEnabled', isSpecialEnabled.toString());
    }, [isSpecialEnabled]);

    // saving data function
    useEffect(() => {
        localStorage.setItem('players', JSON.stringify(players)); // saving data on localStorage when players status was updated
    }, [players]);

    useEffect(() => {
        localStorage.setItem('courts', JSON.stringify(courts));
    }, [courts]);

    // ✅ 새로고침해도 `playingStatus` 유지
    useEffect(() => {
        const savedStatus = localStorage.getItem("playingStatus");
        if (savedStatus) {
            setPlayingStatus(JSON.parse(savedStatus));
        }
    }, []);

    // ✅ `playingStatus`가 변경될 때마다 `localStorage`에 저장
    useEffect(() => {
        localStorage.setItem("playingStatus", JSON.stringify(playingStatus));
    }, [playingStatus]);

    useEffect(() => {
        localStorage.setItem('currentStartIndex', currentStartIndex.toString());
    }, [currentStartIndex]);

    // saving changed currentStartIndex on localStorage
    const updateStartIndex = (newIndex) => {
        setCurrentStartIndex(newIndex);
    };

    // Lock 토글 핸들러
    const toggleLock = () => {
        setIsLocked((prev) => !prev);
    };

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setNewPlayerName('');
    };

    const addPlayer = () => {
        if (!newPlayerName.trim()) {
            alert('Name cannot be empty!');
            return;
        }

        // 일반 플레이어와 Special List의 최대 ID를 기준으로 새 ID 설정
        const maxId = Math.max(
            players.reduce((max, player) => {
                const idNum = parseInt(player.id, 10);
                return idNum > max ? idNum : max;
            }, 0),
            specialPlayers.reduce((max, player) => {
                const idNum = parseInt(player.id, 10);
                return idNum > max ? idNum : max;
            }, 0)
        );

        const newPlayer = {
            id: (maxId + 1).toString(),
            name: newPlayerName.trim(),
            checkedIn: 'Y',
            checkInDate: new Date(),
            playingCount: 0
        };

        setPlayers((prevPlayers) => {
            const updatedPlayers = [...prevPlayers, newPlayer];
            // ⭐ 수정: isAssignmentCompleted가 true이고 hasSetNewStartIndex가 false일 때만 새 플레이어로 설정
            if (isAssignmentCompleted && !hasSetNewStartIndex && prevPlayers.length > 0 && currentStartIndex == 0) {
                setCurrentStartIndex(prevPlayers.length);
                setHasSetNewStartIndex(true);
            }
            return updatedPlayers;
        });
        closeModal();
    };

    return (
        <div className='App p-8 relative'>
            <h1 className='text-4xl font-bold text-blue-500'>COURT MANAGER</h1>

            {/* HowToUseButton 사용 장소*/}
            <HowToUseButton /> { }

            {/* 토글 스위치 추가 */}
            {!props.readOnly && (
                <div className="absolute top-4 right-4">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={isLocked}
                            onChange={() => setIsLocked(!isLocked)}
                        />
                        <div className={`w-12 h-6 bg-gray-300 rounded-full relative`}>
                            <div
                                className={`w-5 h-5 bg-gray-600 rounded-full absolute top-0.5 transition-transform duration-300 ${isLocked ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            ></div>
                        </div>
                        <span className="ml-2 text-sm font-semibold text-gray-600">
                            {isLocked ? 'Locked' : 'Unlocked'}
                        </span>
                    </label>
                </div>
            )}

            <div className='flex'>
                <div className='w-1/3 p-4'>
                    {!props.readOnly && (
                        <ImportButton
                            shouldShowTestButton={false}
                            setPlayers={setPlayers}
                            setCourts={setCourts}
                            currentStartIndex={currentStartIndex} // ⭐ 추가
                            setCurrentStartIndex={setCurrentStartIndex} // ⭐ 추가
                            isAssignmentCompleted={isAssignmentCompleted} // ⭐ 추가
                            setIsAssignmentCompleted={setIsAssignmentCompleted} // ⭐ 추가
                        ></ImportButton>
                    )}
                    <div className="flex items-center mb-2 space-x-4"> {/* 수평 정렬 */}
                        {/* Add New Player 버튼 */}
                        {!props.readOnly && (
                            <button
                                onClick={openModal}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200"
                            >
                                <FaUserPlus /> Add
                            </button>
                        )}
                        {!props.readOnly && (
                            <button
                                onClick={openSetStartModal}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200"
                            >
                                <FaPlay /> Start Set
                            </button>
                        )}
                    </div>
                    <div className="mb-2"> {/* 수평 정렬 */}
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-600">
                                Total Players: {players.length}
                            </span>
                            <span className="text-sm font-semibold text-gray-500 mt-1">
                                Start: {players.length > 0 && currentStartIndex >= 0 && currentStartIndex < players.length
                                    ? `${players[currentStartIndex].id}-${players[currentStartIndex].name}`
                                    : 'None'}
                            </span>
                        </div>
                    </div>
                    <StatusTable
                        readOnly={props.readOnly}
                        players={players}
                        setPlayers={setPlayers}
                        currentStartIndex={currentStartIndex}
                        setCurrentStartIndex={setCurrentStartIndex}
                        onSelectPlayer={setSelectedListPlayer}
                        playingStatus={playingStatus}
                        setPlayingStatus={setPlayingStatus} // ⭐ 추가
                        assignClicked={assignStatus.assignClicked}
                        isRollbackAllowed={assignStatus.isRollbackAllowed}
                        courts={courts}
                        setCourts={setCourts} // ⭐ 추가
                        specialPlayers={specialPlayers} // ⭐ 추가: Special List 전달
                        setSpecialPlayers={setSpecialPlayers} // ⭐ 추가: Special List 상태 업데이트 함수 전달
                    />
                </div>
                <div className='w-2/3 p-4'>
                    <Assignment
                        readOnly={props.readOnly}
                        numTotCourts={8}
                        players={players}
                        setPlayers={setPlayers}
                        courts={courts}
                        setCourts={setCourts}
                        currentStartIndex={currentStartIndex}
                        updateStartIndex={updateStartIndex} // transferring start index
                        isLocked={isLocked}
                        specialPlayers={specialPlayers} // SpecialPlayers 상태 전달
                        isSpecialEnabled={isSpecialEnabled} // SpecialPlayers 활성화 여부 전달
                        setSpecialPlayers={setSpecialPlayers} // SpecialPlayers 상태 업데이트 함수 전달
                        selectedListPlayer={selectedListPlayer} // 🔥 Assignment에 전달
                        setSelectedListPlayer={setSelectedListPlayer} // 🔥 Assignment에서 초기화 가능하게 전달
                        playingStatus={playingStatus} // 🔥 상태 전달
                        setPlayingStatus={setPlayingStatus} // 🔥 상태 변경 함수 전달
                        onSelectPlayer={setSelectedListPlayer}
                        onAssignStatusChange={setAssignStatus} // 🔥🔥🔥 새로 추가: 상태 변경 callback 전달
                        setIsAssignmentCompleted={setIsAssignmentCompleted} // ⭐ 추가
                        isAssignmentCompleted={isAssignmentCompleted} // ⭐ 추가
                        hasSetNewStartIndex={hasSetNewStartIndex} // ⭐ 추가
                        setHasSetNewStartIndex={setHasSetNewStartIndex} // ⭐ 추가
                    ></Assignment>
                    {/* Special Players 리스트를 코트와 Assign 버튼 아래 배치 */}
                    <div className="mt-4">
                        {/* Special List 버튼 정렬 */}
                        <div className="flex items-center justify-between mb-2">
                            <h2 className='text-lg font-bold mb-2'>Special List</h2>
                            <div className='flex justify-between mb-2'>
                                {/* 버튼 클릭 시 SpecialPlayers의 addSpecialPlayer 함수 호출 */}
                                {!props.readOnly && (
                                    <button
                                        onClick={() => specialPlayersRef.current?.addSpecialPlayer()}
                                        className='bg-green-500 text-white px-4 py-2 rounded mr-4'
                                    >
                                        Add Special
                                    </button>
                                )}
                                {!props.readOnly && (
                                    <label className='flex items-center cursor-pointer'>
                                        <input
                                            type='checkbox'
                                            className='hidden'
                                            checked={isSpecialEnabled}
                                            onChange={() => setIsSpecialEnabled(!isSpecialEnabled)}
                                        />
                                        <div className='w-12 h-6 bg-gray-300 rounded-full relative'>
                                            <div className={`w-5 h-5 bg-gray-600 rounded-full absolute top-0.5 transition-transform duration-300 ${isSpecialEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                        </div>
                                        <span className='ml-2 text-sm font-semibold text-gray-600'>
                                            {isSpecialEnabled ? 'Playing' : 'Not Playing'}
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* SpecialPlayers 컴포넌트 추가 (4명까지 보이도록 UI에서 조절) */}
                        <SpecialPlayers
                            ref={specialPlayersRef} // ref 추가
                            specialPlayers={specialPlayers}
                            setSpecialPlayers={setSpecialPlayers}
                            isSpecialEnabled={isSpecialEnabled}
                            setIsSpecialEnabled={setIsSpecialEnabled}
                            maxPlayerId={maxPlayerId} // ⭐ 추가: 최대 플레이어 ID 전달
                        />
                    </div>
                </div>
            </div>
            {/* 모달 코드 추가 */}
            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-1/3'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-bold'>Add Player</h2>
                            <button
                                onClick={closeModal}
                                className='text-gray-500 hover:text-gray-800 transition-all duration-200'
                            >
                                &times;
                            </button>
                        </div>
                        <div className='mb-4'>
                            <label
                                htmlFor='playerName'
                                className='block text-sm font-medium text-gray-700 mb-2'
                            >
                                Player Name
                            </label>
                            <input
                                id='playerName'
                                type='text'
                                value={newPlayerName}
                                onChange={(e) => setNewPlayerName(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                        <div className='flex justify-end space-x-4'>
                            <button
                                onClick={addPlayer}
                                className='px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-200'
                            >
                                Add
                            </button>
                            <button
                                onClick={closeModal}
                                className='px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition-all duration-200'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isSetStartModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-1/3'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-bold'>Set Start Player</h2>
                            <button
                                onClick={closeSetStartModal}
                                className='text-gray-500 hover:text-gray-800 transition-all duration-200'
                            >
                                &times;
                            </button>
                        </div>
                        <div className='mb-4'>
                            <label
                                htmlFor='playerId'
                                className='block text-sm font-medium text-gray-700 mb-2'
                            >
                                Player ID
                            </label>
                            <input
                                id='playerId'
                                type='text'
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                        <div className='flex justify-end space-x-4'>
                            <button
                                onClick={closeSetStartModal}
                                className='px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition-all duration-200'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSetStart}
                                className='px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-200'
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* 오른쪽 하단 Copyright 추가 */}
            <div className="absolute bottom-4 right-4 text-blue-300 text-xs">
                Copyright © 2025 Jihyeok Choi
            </div>
        </div>
    );
}

export default AdminPage;