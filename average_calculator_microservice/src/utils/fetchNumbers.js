import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = process.env.TEST_SERVER_BASE_URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const fetchNumbers = async (type) => {
  try {
    console.log("auth token", AUTH_TOKEN);
    console.log("type", type);
    console.log("API_BASE_URL", API_BASE_URL);
    const response = await axios.get(`${API_BASE_URL}/${type}`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 500,
    });

    return response.data.numbers || [];
  } catch (error) {
    console.error(`Error fetching ${type} numbers:`, error.data);
    return [];
  }
};

export default fetchNumbers;
