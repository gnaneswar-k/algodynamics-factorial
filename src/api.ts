import axios from "axios";

const client = axios.create({
  // baseURL: "http://127.0.0.1:3000", // Backend localhost. Replace with amazon aws link.
  // baseURL: "https://lepkbux71j.execute-api.ap-south-1.amazonaws.com/Prod", // Pranavasri VJS DynamoDB backend
  baseURL: "https://yp4nx7c5kg.execute-api.ap-south-2.amazonaws.com/Prod", // Gnaneswar Kulindala DynamoDB backend
});

export default client;
