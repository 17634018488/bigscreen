<template>
  <div class="alarm-list">
    <div class="panel-header">
      <h3 class="panel-title">
        监控报警信息
      </h3>
      <span class="more-btn">
        More
        <img :src="require('@/assets/img/更多ico.png')" alt="more" class="more-icon">
      </span>
    </div>
    <div class="alarm-content">
      <div v-for="(alarm, index) in alarmList" :key="index" class="alarm-item">
        <div class="alarm-row">
          <div class="alarm-device">{{ alarm.deviceName }}</div>
          <div class="alarm-type-wrap">
            <span class="alarm-type">{{ alarm.type }}</span>
            <div class="alarm-indicator" :class="alarm.level"></div>
          </div>
        </div>
        <div class="alarm-row">
          <div class="alarm-code">IP地址: {{ alarm.deviceIp }}</div>
          <div class="alarm-time">报警时间: {{ alarm.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAlarmRecords } from '@/api/project'

export default {
  name: 'AlarmList',
  data () {
    return {
      alarmList: []
    }
  },
  created() {
    this.fetchAlarmList()
  },
  methods: {
    async fetchAlarmList() {
      try {
        const res = await getAlarmRecords()
        // 映射接口返回的字段
        this.alarmList = res.map(item => {
          return {
            deviceName: `设备名称: ${item.deviceName}`,
            deviceIp: item.deviceIp,
            type: `报警类型: ${this.translateAlarmType(item.alarmType)}`,
            time: item.alarmTime ? item.alarmTime.replace('T', ' ') : '',
            level: this.getAlarmLevel(item)
          }
        })
      } catch (error) {
        console.error('获取报警记录失败，使用 Mock 数据展示:', error)
        // 调试用：如果接口未就绪，使用 Mock 数据
        const mockData = [
          {
            "id": 4002,
            "projectId": 1001,
            "deviceInfoId": 3005,
            "deviceName": "配电房热成像",
            "deviceIp": "192.168.1.20",
            "alarmType": "temperature",
            "alarmDesc": "配电房设备温度异常",
            "temperature": 82.1,
            "alarmTime": "2026-05-18T09:15:00",
            "createTime": "2026-05-19T23:03:21",
            "deleted": 0
          },
          {
            "id": 4003,
            "projectId": 1001,
            "deviceInfoId": 3006,
            "deviceName": "正门监控",
            "deviceIp": "192.168.1.21",
            "alarmType": "motion",
            "alarmDesc": "区域入侵报警",
            "alarmTime": "2026-05-18T10:30:00",
            "createTime": "2026-05-19T23:03:21",
            "deleted": 0
          }
        ]
        this.alarmList = mockData.map(item => ({
          deviceName: `设备名称: ${item.deviceName}`,
          deviceIp: item.deviceIp,
          type: `报警类型: ${this.translateAlarmType(item.alarmType)}`,
          time: item.alarmTime ? item.alarmTime.replace('T', ' ') : '',
          level: this.getAlarmLevel(item)
        }))
      }
    },
    translateAlarmType(type) {
      const typeMap = {
        'temperature': '温度异常',
        'motion': '移动侦测',
        'fire': '火焰报警',
        'smoke': '烟雾报警',
        'offline': '设备离线'
      }
      return typeMap[type] || type
    },
    getAlarmLevel(item) {
      // 根据类型或数值判断等级
      if (item.alarmType === 'temperature' && item.temperature > 80) return 'severe'
      if (item.alarmType === 'fire') return 'severe'
      if (item.alarmType === 'offline') return 'medium'
      return 'normal'
    }
  }
}
</script>

<style scoped lang="scss">
.alarm-list {
  height: 100%;
  // background: url('~@/assets/img/左大边.png') no-repeat;
  background: rgba(3, 18, 53, 0.6);
  background-size: 100% 100%;
  padding: 15px 10px;
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
  margin-left: 25px;
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

.alarm-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.alarm-item {
  padding: 14px 10px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.08);
  transition: background 0.3s;

  &:hover {
    background: rgba(0, 212, 255, 0.05);
  }
}

.alarm-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.alarm-device {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}

.alarm-type-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alarm-type {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.alarm-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.severe {
    background: #ff3b30;
    box-shadow: 0 0 10px #ff3b30, 0 0 20px rgba(255, 59, 48, 0.5);
  }

  &.medium {
    background: #ffcc00;
    box-shadow: 0 0 10px #ffcc00, 0 0 20px rgba(255, 204, 0, 0.5);
  }

  &.normal {
    background: #7b61ff;
    box-shadow: 0 0 10px #7b61ff, 0 0 20px rgba(123, 97, 255, 0.5);
  }
}

.alarm-code,
.alarm-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
