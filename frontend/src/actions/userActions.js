import axios from "axios";
import { ENDPOINT_URL } from "./../constants/constants";

export const register = async (data) => {
  try {
    const response = await axios.post(`${ENDPOINT_URL}/auth/register`, data);
    //   console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post(`${ENDPOINT_URL}/auth/login`, data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export const enrollUserToCourse = async (data) => {
    try {
        const response = await axios.patch(`${ENDPOINT_URL}/auth/enroll-course`, data)
        return response.data
    } catch (error) {
      console.error("Error:", error.message);
    }
}

export const userCompleteLesson = async (data) => {
  try {
    const response = await axios.patch(`${ENDPOINT_URL}/auth/lesson-completed`, data)
    return response.data
  } catch (error) {
    console.log(error);
  }
}
