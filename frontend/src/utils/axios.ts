import axios from "axios";
import { backend } from "./config";

export default axios.create({
  baseURL: backend,
});

export const axiosPrivate = axios.create({
  baseURL: backend,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

