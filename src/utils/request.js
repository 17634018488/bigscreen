import axios from 'axios'
import { Message, MessageBox } from 'element-ui'

// 创建 axios 实例
const service = axios.create({
  // API 的基础路径，可以通过环境变量配置
  baseURL: process.env.VUE_APP_BASE_API || '',
  // 请求超时时间
  timeout: 15000 
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 例如：如果存在 token，则在请求头中携带 token
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    return config
  },
  error => {
    // 对请求错误做些什么
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    /**
     * 下面的代码仅供参考，具体的响应结构需要根据后端 API 定义进行调整
     * 假设后端返回格式为：{ code: 200, data: {}, msg: 'success' }
     */
    const res = response.data

    // 如果 code 不为 200，则判定为错误
    if (res.code && res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 特殊错误码处理，例如 401: 未登录或登录过期
      if (res.code === 401) {
        MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 处理重新登录逻辑，如清除本地缓存并跳转到登录页
          // location.reload()
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.error('Response Error:', error)
    let message = error.message
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
