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
