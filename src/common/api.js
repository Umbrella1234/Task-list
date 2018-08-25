import axios from "axios";
import { USERNAME } from "./constants";

const API_URL = `https://uxcandy.com/~shapoval/test-task-backend`;

const developerQuery = `?developer=${USERNAME}`;

export const fetchTasks = (sortField, sortDirection, pageNum) =>
  axios.get(
    `${API_URL}/${developerQuery}&sort_field=${sortField}&sort_direction=${sortDirection}&page=${pageNum}`
  );

export const postNewTask = data =>
  axios({
    method: "post",
    url: `${API_URL}/create${developerQuery}`,
    headers: { "Content-Type": "multipart/form-data" },
    data,
    contentType: false,
    processData: false
  });

export const editTask = (data, id, encodedParams) =>
  axios({
    method: "post",
    url: `${API_URL}/edit/${id}${developerQuery}&${encodedParams}`,
    headers: { "Content-Type": "multipart/form-data" },
    data,
    contentType: false,
    processData: false
  });
