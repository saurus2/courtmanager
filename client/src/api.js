import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

export const fetchPlayers = () => axios.get(`${API_BASE}/players`);
export const addPlayerAPI = (player) => axios.post(`${API_BASE}/players`, player);
export const deletePlayerAPI = (id) => axios.delete(`${API_BASE}/players/${id}`);
export const updatePlayerCountAPI = (id, playing_count) =>
  axios.put(`${API_BASE}/players/${id}`, { playing_count });
