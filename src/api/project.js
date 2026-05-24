import request from '@/utils/request'

/**
 * 获取项目列表
 * @returns {Promise}
 */
export function getProjects() {
  return request({
    url: '/projects',
    method: 'get'
  })
}

/**
 * 获取项目详情
 * @param {number|string} id 项目ID
 * @returns {Promise}
 */
export function getProjectDetail(id) {
  return request({
    url: `/projects/${id}`,
    method: 'get'
  })
}

// 根据项目id获取设备类型
export function getProjectDeviceTypes(id) {
  return request({
    url: `/projects/${id}/device-types`,
    method: 'get'
  })
}

// 根据设备类型获取设备列表
export function getProjectDeviceList(id) {
  return request({
    url: `/device-types/${id}/devices`,
    method: 'get'
  })
}

/**
 * 获取告警记录
 * @param {Object} params { date, projectId }
 * @returns {Promise}
 */
export function getAlarmRecords(params) {
  return request({
    url: '/alarm-records',
    method: 'get',
    params
  })
}

/**
 * 设备登录
 * @param {Object} data { ip, port, username, password }
 * @returns {Promise}
 */
export function loginDevice(data) {
  return request({
    url: '/device/login',
    method: 'post',
    data
  })
}