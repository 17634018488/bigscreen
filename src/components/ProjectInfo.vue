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
      <div v-for="(project, index) in projectList" :key="index" class="project-item">
        <div class="project-row">
          <div class="project-field">项目名称: {{ project.name }}</div>
        </div>
        <div class="project-row">
          <div class="project-field">项目状态: {{ project.status }}</div>
        </div>
        <div class="project-row">
          <div class="project-field">城建单位: {{ project.company }}</div>
        </div>
        <div class="project-row">
          <div class="project-field">开工日期: {{ project.startDate }}</div>
          <div class="project-field">竣工日期: {{ project.endDate }}</div>
        </div>
        <div class="project-row">
          <div class="project-field">项目联系人: {{ project.contact }}</div>
          <div class="project-field">联系电话: {{ project.phone }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectInfo',
  data() {
    return {
      projectList: [
        {
          name: '000472604726072',
          company: '000472604726072',
          status: '100472600',
          startDate: '2026-05-05',
          endDate: '2026-05-05',
          contact: '甲某某',
          phone: '000 0000 0000'
        },
        {
          name: '000472604726072',
          company: '000472604726072',
          status: '100472600',
          startDate: '2026-05-05',
          endDate: '2026-05-05',
          contact: '甲某某',
          phone: '000 0000 0000'
        },
        {
          name: '000472604726072',
          company: '000472604726072',
          status: '100472600',
          startDate: '2026-05-05',
          endDate: '2026-05-05',
          contact: '甲某某',
          phone: '000 0000 0000'
        }
      ]
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
  padding: 14px 10px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.08);
  transition: background 0.3s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(0, 212, 255, 0.05);
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
}
</style>
