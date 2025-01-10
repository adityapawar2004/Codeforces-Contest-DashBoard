import axios from 'axios';

const BASE_URL = 'https://codeforces.com/api';

export const fetchContests = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/contest.list`);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching contests:', error);
    throw error;
  }
};