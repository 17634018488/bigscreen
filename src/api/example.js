import request from '@/utils/request'

/**
 * 示例：获取项目信息列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getProjectList(params) {
  return request({
    url: '/api/project/list',
    method: 'get',
    params
  })
}

/**
 * 示例：获取告警详情
 * @param {String|Number} id 告警ID
 * @returns {Promise}
 */
export function getAlarmDetail(id) {
  return request({
    url: `/api/alarm/detail/${id}`,
    method: 'get'
  })
}

/**
 * 示例：提交表单数据
 * @param {Object} data 提交的数据
 * @returns {Promise}
 */
export function submitData(data) {
  return request({
    url: '/api/data/submit',
    method: 'post',
    data
  })
}
