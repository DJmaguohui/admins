import axios from 'axios'

let Server = axios.create({
    baseURL: "https://www.liulongbin.top:8888/api/private/v1/",
    timeout: 3000
})

Server.interceptors.request.use(config => {
    var token = sessionStorage.getItem("token")
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

Server.interceptors.response.use(response => {
    return response
})

export default Server