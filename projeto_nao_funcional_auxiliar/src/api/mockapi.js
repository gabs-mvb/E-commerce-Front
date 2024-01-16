import axios from "axios";

const apiMock = axios.create({
  baseURL: "https://653dc13df52310ee6a9a4ab7.mockapi.io/funcionario",
});

export default apiMock;