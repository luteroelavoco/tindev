import axios from "axios";

const url = "http://192.168.0.110:3333";

const api = axios.create({
    baseURL : url
})

export default api;