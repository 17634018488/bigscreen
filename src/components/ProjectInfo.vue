<template>
  <div class="project-info">
    <div class="panel-header">
      <h3 class="panel-title">项目信息</h3>
      <span class="more-btn">
        More
        <img src="../assets/img/更多ico.png" alt="more" class="more-icon">
      </span>
    </div>
    <div class="project-content">
      <div v-for="(project, index) in projectList" :key="index" class="project-item" @click="goToDetail(project)">
        <div class="project-row">
          <div class="project-field">项目名称: {{ project.name }}</div>
        </div>
        <div class="project-row">
          <div class="project-field">项目状态: <span :class="'status-' + project.status">{{ formatStatus(project.status) }}</span></div>
        </div>
        <div class="project-row">
          <div class="project-field">城建单位: {{ project.constructionUnit }}</div>
        </div>
        <div class="project-row">
          <div class="project-field">开工日期: {{ project.startDate || '未定' }}</div>
          <div class="project-field">竣工日期: {{ project.endDate || '未定' }}</div>
        </div>
        <div class="project-row">
          <div class="project-field">项目联系人: {{ project.contactPerson }}</div>
          <div class="project-field">联系电话: {{ project.contactPhone }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProjects } from '@/api/project'

export default {
  name: 'ProjectInfo',
  data() {
    return {
      projectList: []
    }
  },
  created() {
    this.fetchProjectList()
  },
  methods: {
    goToDetail(project) {
      this.$router.push({
        name: 'ProjectDetail',
        params: { id: project.id }
      })
    },
    async fetchProjectList() {
      try {
        const res = await getProjects()
        // 假设接口返回的是数组，或者在 request.js 中已经处理了 res.data
        this.projectList = res
        this.$emit('projects-loaded', this.projectList)
      } catch (error) {
        console.error('获取项目列表失败，使用 Mock 数据展示:', error)
        // 调试用：如果接口未就绪，使用用户提供的 Mock 数据
        this.projectList = [
          {
            "id": 1001,
            "name": "智慧园区安防监控项目",
            "status": "active",
            "longitude": 113.32459,
            "latitude": 23.12911,
            "constructionUnit": "中科智慧科技有限公司",
            "startDate": "2025-03-01",
            "endDate": "2025-12-31",
            "contactPerson": "张工",
            "contactPhone": "13800138001"
          },
          {
            "id": 1002,
            "name": "城市地下管廊监测系统",
            "status": "active",
            "longitude": 114.0654,
            "latitude": 22.5478,
            "constructionUnit": "市政工程集团",
            "startDate": "2025-06-01",
            "endDate": "2026-06-30",
            "contactPerson": "李经理",
            "contactPhone": "13900139002"
          },
          {
            "id": 1003,
            "name": "高层建筑消防预警平台",
            "status": "planning",
            "longitude": 113.2806,
            "latitude": 23.125,
            "constructionUnit": "消防科技工程公司",
            "startDate": null,
            "endDate": null,
            "contactPerson": "王工",
            "contactPhone": "13700137003"
          },
          {
            "id": 1004,
            "name": "老旧小区改造安防工程",
            "status": "completed",
            "longitude": 113.35,
            "latitude": 23.11,
            "constructionUnit": "安居建设有限公司",
            "startDate": "2024-01-15",
            "endDate": "2025-01-15",
            "contactPerson": "赵经理",
            "contactPhone": "13600136004"
          },
          {
            "id": 1005,
            "name": "港口码头智能监控系统",
            "status": "active",
            "longitude": 113.58,
            "latitude": 22.48,
            "constructionUnit": "港务局信息化中心",
            "startDate": "2025-09-01",
            "endDate": "2026-08-31",
            "contactPerson": "陈工",
            "contactPhone": "13500135005"
          }
        ]
        this.$emit('projects-loaded', this.projectList)
      }
    },
    formatStatus(status) {
      const statusMap = {
        'active': '进行中',
        'planning': '规划中',
        'completed': '已完成'
      }
      return statusMap[status] || status
    }
  }
}
</script>

<style scoped lang="scss">
.project-info {
  flex: 2;
  min-height: 0;
  // background: url('../assets/img/右上边.png') no-repeat;
  background: rgba(3, 18, 53, 0.6);
  background-size: 100% 100%;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);
}

.panel-title {
  font-size: 18px;
  color: #ffffff;
  font-weight: bold;
  font-style: italic;
  letter-spacing: 2px;
  text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
  margin-left: 12px;
}

.more-btn {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  line-height: 1;
  transition: color 0.3s;

  &:hover {
    color: #00d4ff;
  }
}

.more-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  vertical-align: middle;
}

.project-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.project-item {
  background: rgba(0, 48, 100, 0.4);
  border: 1px solid rgba(0, 212, 255, 0.2);
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: rgba(0, 70, 150, 0.6);
    border-color: rgba(0, 212, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

.project-row {
  display: flex;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.project-field {
  flex: 1;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .status-active {
    color: #00ff88;
  }
  .status-planning {
    color: #ffaa00;
  }
  .status-completed {
    color: #00d4ff;
  }
}
</style>
