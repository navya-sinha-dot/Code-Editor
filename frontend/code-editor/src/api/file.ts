import axios from "axios";
import { getToken } from "../utils/token";
import { BACKEND_URL } from "../config";

const API = `${BACKEND_URL}/api/files`;

export const fetchFiles = (roomId: string) =>
  axios.get(`${API}/${roomId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const createFile = (data: any) =>
  axios.post(API, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const updateFile = (id: string, data: any) =>
  axios.put(`${API}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const deleteFile = (id: string) =>
  axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
