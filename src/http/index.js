import axios from 'axios'
//导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
let Server = axios.create({
    baseURL: "https://www.liulongbin.top:8888/api/private/v1/",
    timeout: 3000
})

Server.interceptors.request.use(config => {
    NProgress.start()
    var token = sessionStorage.getItem("token")
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

Server.interceptors.response.use(response => {
    NProgress.done()
    return response
})

export default Server