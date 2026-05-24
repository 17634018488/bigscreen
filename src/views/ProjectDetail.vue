<template>
  <div class="project-detail-container">
    <header class="detail-header">
      <div class="left-info">
        <i class="el-icon-folder-opened"></i>
        <span class="project-name">{{ projectName }}</span>
      </div>
      <div class="right-info">
        <span>中传智联网科技有限公司</span>
      </div>
    </header>

    <div class="detail-content">
      <!-- 左侧设备类型 -->
      <aside class="device-type-sidebar">
        <div class="sidebar-title">设备类型</div>
        <div v-for="type in deviceTypes" :key="type.id" :class="['type-item', { active: selectedTypeId === type.id }]"
          @click="selectType(type)">
          <div class="type-icon-wrapper" :style="{ backgroundColor: getCategoryStyle(type.category).color }">
            <i :class="getCategoryStyle(type.category).icon"></i>
          </div>
          <div class="type-info">
            <div class="type-name">{{ type.name }}</div>
            <div class="type-desc">{{ type.description }}</div>
          </div>
          <div class="type-count">{{ type.count }}</div>
        </div>
      </aside>

      <!-- 右侧主要内容 -->
      <main class="main-area">
        <!-- 设备列表 -->
        <section class="device-list-section">
          <div class="section-header">设备 ({{ filteredDevices.length }})</div>
          <div class="device-list">
            <div v-for="device in filteredDevices" :key="device.id"
              :class="['device-item', { active: selectedDeviceId === device.id }]" @click="selectDevice(device)">
              <div class="device-status-dot" :class="device.onlineStatus === 1 ? 'online' : 'offline'"></div>
              <div class="device-main-info">
                <div class="device-name">{{ device.name }}</div>
                <div class="device-addr">{{ device.ip }} 通道 {{ device.channel }}</div>
              </div>
              <div class="device-status-text" :class="device.onlineStatus === 1 ? 'online' : 'offline'">
                {{ device.onlineStatus === 1 ? '在线' : '离线' }}
              </div>
            </div>
          </div>
        </section>

        <!-- 设备详情与功能 -->
        <section class="device-detail-section">
          <el-tabs v-model="activeTab" class="detail-tabs">
            <el-tab-pane label="设备信息" name="info">
              <div v-if="selectedDevice" class="info-grid">
                <div class="info-item">
                  <div class="label">设备名称</div>
                  <div class="value">{{ selectedDevice.name }}</div>
                </div>
                <div class="info-item">
                  <div class="label">设备类型</div>
                  <div class="value">{{ getDeviceTypeName(selectedDevice.typeId) }}</div>
                </div>
                <div class="info-item">
                  <div class="label">所属项目</div>
                  <div class="value">{{ projectName }}</div>
                </div>
                <div class="info-item">
                  <div class="label">通道号</div>
                  <div class="value">{{ selectedDevice.channel }}</div>
                </div>
                <div class="info-item">
                  <div class="label">IP地址</div>
                  <div class="value">{{ selectedDevice.ip }}</div>
                </div>
                <div class="info-item">
                  <div class="label">端口</div>
                  <div class="value">{{ selectedDevice.port }}</div>
                </div>
                <div class="info-item">
                  <div class="label">登录用户</div>
                  <div class="value">{{ selectedDevice.username }}</div>
                </div>
                <div class="info-item">
                  <div class="label">密码</div>
                  <div class="value">********</div>
                </div>
                <div class="info-item">
                  <div class="label">经度</div>
                  <div class="value">{{ selectedDevice.longitude }}</div>
                </div>
                <div class="info-item">
                  <div class="label">纬度</div>
                  <div class="value">{{ selectedDevice.latitude }}</div>
                </div>
                <div class="info-item full-width">
                  <div class="label">地址</div>
                  <div class="value">{{ selectedDevice.address }}</div>
                </div>
                <div class="info-item full-width">
                  <div class="label">描述</div>
                  <div class="value">{{ selectedDevice.description }}</div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="实时预览" name="preview">
              <div class="preview-container">
                <div class="player-wrapper">
                  <video v-show="isStreaming" ref="videoPlayer" class="video-player" muted autoplay></video>
                  <div v-if="!isStreaming" class="mock-player">
                    <i class="el-icon-video-camera"></i>
                    <span>{{ isLoggedIn ? '登录成功，点击“预览”开始播放' : '点击“登录设备”预览' }}</span>
                  </div>
                </div>
                <div class="preview-controls-panel">
                  <div class="button-group">
                    <el-button type="primary" size="mini" icon="el-icon-user" @click="handleLogin"
                      :disabled="isLoggedIn" :loading="loginLoading">{{ isLoggedIn ? '已登录' : (loginLoading ? '登录中...' :
                        '登录') }}</el-button>
                    <el-button type="success" size="mini" icon="el-icon-video-play" @click="handlePlay"
                      :disabled="!isLoggedIn">预览</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-video-pause" @click="handleStop"
                      :disabled="!isLoggedIn || !isStreaming">停止</el-button>
                    <el-button type="warning" size="mini" icon="el-icon-camera" @click="handleCapture"
                      :disabled="!isLoggedIn" style="background-color: #722ed1; border-color: #722ed1;">抓拍</el-button>
                    <el-button :type="isArmed ? 'info' : 'warning'" size="mini"
                      :icon="isArmed ? 'el-icon-lock' : 'el-icon-unlock'" @click="handleAlarmToggle"
                      :disabled="!isLoggedIn" :loading="armLoading" :style="{
                        backgroundColor: isArmed ? '#909399' : '#fa8c16',
                        borderColor: isArmed ? '#909399' : '#fa8c16'
                      }">
                      {{ isArmed ? '撤防' : '布防' }}
                    </el-button>
                  </div>
                  <div v-if="selectedDevice" class="connection-info">
                    设备: {{ selectedDevice.ip }}:{{ selectedDevice.port }}
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="告警" name="alarm">
              <div class="alarm-tab-container">
                <div class="alarm-toolbar">
                  <div class="filter-left">
                    <el-date-picker v-model="filterDate" type="date" placeholder="选择日期" size="mini"
                      value-format="yyyy-MM-dd" class="dark-picker"></el-date-picker>
                    <el-select v-model="filterType" placeholder="全部类型" size="mini" class="dark-select">
                      <el-option label="全部类型" value=""></el-option>
                      <el-option v-for="type in deviceTypes" :key="type.id" :label="type.name"
                        :value="type.name"></el-option>
                    </el-select>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="fetchAlarms">查询</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="clearAlarms">清空实时</el-button>
                  </div>
                  <div class="filter-right">
                    <span class="stat-tag tag-red">0</span>
                    <span class="stat-tag tag-yellow">0</span>
                    <span class="stat-tag tag-purple">0</span>
                  </div>
                </div>

                <div class="alarm-list-content">
                  <div v-if="alarms.length > 0">
                    <div v-for="(alarm, index) in alarms" :key="index" class="alarm-card-item">
                      <div class="alarm-card-left">
                        <div class="alarm-icon-box">
                          <i class="el-icon-warning" :style="{ color: getAlarmColor(alarm.type) }"></i>
                        </div>
                        <div class="alarm-info-box">
                          <div class="alarm-title" :style="{ color: getAlarmColor(alarm.type) }">{{ alarm.type }}</div>
                          <div class="alarm-subtitle">{{ alarm.content }} - {{ alarm.deviceIp }}</div>
                        </div>
                      </div>
                      <div class="alarm-card-right">
                        <span class="alarm-time-text">{{ alarm.time }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="empty-alarm">
                    <i class="el-icon-info"></i>
                    <span>无告警记录</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Hls from 'hls.js'
import { getProjectDetail, getProjectDeviceTypes, getProjectDeviceList, getAlarmRecords, loginDevice, startAlarm, stopAlarm } from '@/api/project'

export default {
  name: 'ProjectDetail',
  props: ['id'],
  data () {
    return {
      projectName: '加载中...',
      selectedTypeId: null,
      selectedDeviceId: null,
      activeTab: 'info',
      deviceTypes: [],
      devices: [],
      alarms: [],
      isLoggedIn: false,
      loginLoading: false,
      armLoading: false,
      isArmed: false,
      loginInfo: {},
      isStreaming: false,
      filterDate: new Date().toISOString().split('T')[0],
      filterType: '',
      hls: null
    }
  },
  created () {
    this.fetchData()
  },
  beforeDestroy () {
    this.destroyPlayer()
  },
  computed: {
    filteredDevices () {
      // 如果后端没有过滤，我们在这里过滤；如果后端已经根据类型返回，则直接返回 devices
      return this.devices
    },
    selectedDevice () {
      return this.devices.find(d => d.id === this.selectedDeviceId) || this.devices[0]
    }
  },
  methods: {
    getCategoryStyle (category) {
      const maps = {
        'Camera': { icon: 'el-icon-video-camera', color: '#1890ff' },
        'GasDetector': { icon: 'el-icon-odometer', color: '#fa8c16' },
        'DoorControl': { icon: 'el-icon-unlock', color: '#52c41a' }
      }
      return maps[category] || { icon: 'el-icon-set-up', color: '#909399' }
    },
    async fetchData () {
      try {
        const res = await getProjectDetail(this.id)
        this.projectName = res.name || '智慧园区安防监控项目'
      } catch (error) {
        console.error('获取项目详情失败:', error)
        this.projectName = '智慧园区安防监控项目'
      }
      try {
        const res = await getProjectDeviceTypes(this.id)
        this.deviceTypes = res || []
        if (this.deviceTypes.length > 0) {
          this.selectType(this.deviceTypes[0])
        }
      } catch (error) {
        console.error('获取设备类型失败:', error)
      }
      this.fetchAlarms()
    },
    async fetchAlarms () {
      try {
        const res = await getAlarmRecords({
          date: this.filterDate,
          projectId: this.id,
          type: this.filterType
        })
        // 映射后端字段到前端展示字段
        this.alarms = (res || []).map(item => ({
          time: (item.createTime || item.alarmTime || '').replace('T', ' '),
          type: this.translateAlarmType(item.alarmType || item.type || '未知告警'),
          content: item.alarmDesc || item.content || '告警描述',
          deviceIp: item.deviceIp || '127.0.0.1',
          status: item.status || 'unhandled'
        }))
      } catch (error) {
        console.error('获取告警记录失败:', error)
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
    getAlarmColor(type) {
      if (type.includes('火') || type.includes('烟') || type.includes('温度')) return '#ff4d4f'
      if (type.includes('离线')) return '#909399'
      return '#faad14'
    },
    clearAlarms () {
      this.alarms = []
      this.$message.info('实时告警已清空')
    },
    async selectType (type) {
      this.selectedTypeId = type.id
      this.isLoggedIn = false
      this.isArmed = false
      this.destroyPlayer()
      try {
        const res = await getProjectDeviceList(type.id)
        this.devices = res || []
        if (this.devices.length > 0) {
          this.selectedDeviceId = this.devices[0].id
        } else {
          this.selectedDeviceId = null
        }
      } catch (error) {
        console.error('获取设备列表失败:', error)
        this.devices = []
        this.selectedDeviceId = null
      }
    },
    selectDevice (device) {
      this.selectedDeviceId = device.id
      this.isLoggedIn = false
      this.isArmed = false
      this.destroyPlayer()
    },
    getDeviceTypeName (typeId) {
      const type = this.deviceTypes.find(t => t.id === typeId)
      return type ? type.name : (this.deviceTypes.find(t => t.id === this.selectedTypeId)?.name || '未知类型')
    },
    async handleLogin () {
      if (!this.selectedDevice) return

      this.loginLoading = true
      try {
        const formData = new FormData()
        formData.append('ip', this.selectedDevice.ip)
        formData.append('port', this.selectedDevice.port)
        formData.append('username', this.selectedDevice.username)
        formData.append('password', this.selectedDevice.password)

        const res = await loginDevice(formData)
        this.$message.success(`设备登录成功: ${this.selectedDevice.ip}`)
        this.isLoggedIn = true
        this.loginInfo = res || {}
      } catch (error) {
        console.error('设备登录失败:', error)
        this.$message.error('设备登录失败，请检查网络或配置')
      } finally {
        this.loginLoading = false
      }
    },
    handlePlay () {
      // 模拟地址
      this.loginInfo.url = "http://127.0.0.1:9527/hls/camera1.m3u8"
      if (!this.loginInfo || !this.loginInfo.url) {
        this.$message.error('未获取到有效的播放流地址')
        return
      }

      this.destroyPlayer() // 播放前先清理

      const videoElement = this.$refs.videoPlayer
      const streamUrl = this.loginInfo.url

      if (Hls.isSupported()) {
        this.hls = new Hls()
        this.hls.loadSource(streamUrl)
        this.hls.attachMedia(videoElement)
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play().then(() => {
            this.isStreaming = true
            this.$message.success('开始播放 HLS 直播流')
          }).catch(err => {
            console.error('播放失败:', err)
            this.$message.error('视频播放失败，请重试')
          })
        })

        this.hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('网络错误:', data)
                this.$message.error('网络错误，尝试重新连接...')
                this.hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('媒体内容错误:', data)
                this.hls.recoverMediaError()
                break
              default:
                this.destroyPlayer()
                break
            }
          }
        })
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // 原生支持 HLS (如 Safari)
        videoElement.src = streamUrl
        videoElement.addEventListener('loadedmetadata', () => {
          videoElement.play()
          this.isStreaming = true
          this.$message.success('开始播放 HLS 直播流 (原生)')
        })
      } else {
        this.$message.error('当前浏览器不支持 HLS 播放')
      }
    },
    handleStop () {
      this.destroyPlayer()
      this.$message.warning('停止预览')
    },
    destroyPlayer () {
      if (this.hls) {
        this.hls.destroy()
        this.hls = null
      }
      const videoElement = this.$refs.videoPlayer
      if (videoElement) {
        videoElement.pause()
        videoElement.src = ''
        videoElement.load()
      }
      this.isStreaming = false
    },
    handleCapture () {
      this.$message.success(`抓拍成功，已保存至本地`)
    },
    async handleAlarmToggle () {
      if (!this.selectedDevice) return

      this.armLoading = true
      try {
        const formData = new FormData()
        formData.append('deviceId', this.selectedDevice.ip + this.selectedDevice.port)

        if (this.isArmed) {
          await stopAlarm(formData)
          this.$message.success('撤防成功')
          this.isArmed = false
        } else {
          await startAlarm(formData)
          this.$message.success('布防成功')
          this.isArmed = true
        }
      } catch (error) {
        console.error('操作失败:', error)
        this.$message.error(`${this.isArmed ? '撤防' : '布防'}失败，请重试`)
      } finally {
        this.armLoading = false
      }
    },
    handleIntercom () {
      this.$message.info(`正在开启语音对讲...`)
    }
  }
}
</script>

<style scoped lang="scss">
.project-detail-container {
  width: 100%;
  height: 100vh;
  background-color: #000c17;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-header {
  height: 50px;
  background: rgba(0, 21, 41, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;

  .left-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #00d4ff;

    i {
      font-size: 20px;
    }
  }

  .right-info {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
}

.detail-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 10px;
  gap: 10px;
}

.device-type-sidebar {
  width: 300px;
  background: rgba(0, 21, 41, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;

  .sidebar-title {
    padding: 15px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .type-item {
    padding: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
    border-left: 3px solid transparent;

    &:hover {
      background: rgba(24, 144, 255, 0.1);
    }

    &.active {
      background: rgba(24, 144, 255, 0.2);
      border-left-color: #1890ff;
    }

    .type-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 12px;

      i {
        font-size: 20px;
      }
    }

    .type-info {
      flex: 1;

      .type-name {
        font-size: 14px;
        margin-bottom: 4px;
      }

      .type-desc {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
      }
    }

    .type-count {
      font-size: 16px;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.3);
    }
  }
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.device-list-section {
  background: rgba(0, 21, 41, 0.3);
  padding: 15px;
  border-radius: 4px;

  .section-header {
    margin-bottom: 15px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  .device-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
  }

  .device-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid transparent;

    &.active {
      border-color: #1890ff;
      background: rgba(24, 144, 255, 0.1);
    }

    .device-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 15px;

      &.online {
        background: #52c41a;
        box-shadow: 0 0 5px #52c41a;
      }

      &.offline {
        background: #f5222d;
      }
    }

    .device-main-info {
      flex: 1;

      .device-name {
        font-size: 14px;
        margin-bottom: 2px;
      }

      .device-addr {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
      }
    }

    .device-status-text {
      font-size: 12px;

      &.online {
        color: #52c41a;
      }

      &.offline {
        color: #f5222d;
      }
    }
  }
}

.device-detail-section {
  flex: 1;
  background: rgba(0, 21, 41, 0.3);
  padding: 15px;
  border-radius: 4px;
  min-height: 0;
  display: flex;
  flex-direction: column;

  ::v-deep .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-tabs__header {
      margin-bottom: 20px;
    }

    .el-tabs__nav-wrap::after {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .el-tabs__item {
      color: rgba(255, 255, 255, 0.6);

      &.is-active {
        color: #1890ff;
      }
    }

    .el-tabs__content {
      flex: 1;
      overflow-y: auto;
    }
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  .info-item {
    .label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 8px;
    }

    .value {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
    }

    &.full-width {
      grid-column: span 2;
    }
  }
}

.preview-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .player-wrapper {
    flex: 1;
    background: #000;
    border-radius: 4px;
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 200px;
    overflow: hidden;

    .video-player {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .mock-player {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.3);
    gap: 15px;

    i {
      font-size: 60px;
    }

    span {
      font-size: 14px;
    }
  }

  .preview-controls-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 10px;

    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .el-button {
        padding: 7px 15px;
        font-size: 12px;
        border-radius: 4px;

        &--primary {
          background-color: #1890ff;
          border-color: #1890ff;
        }

        &--success {
          background-color: #52c41a;
          border-color: #52c41a;
        }

        &--danger {
          background-color: #ff4d4f;
          border-color: #ff4d4f;
        }
      }
    }

    .connection-info {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      font-family: monospace;
    }
  }
}

.alarm-tab-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 15px;
}

.alarm-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  .filter-left {
    display: flex;
    align-items: center;
    gap: 10px;

    .dark-picker,
    .dark-select {
      width: 150px;

      ::v-deep .el-input__inner {
        background-color: rgba(0, 21, 41, 0.8);
        border-color: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
    }
  }

  .filter-right {
    display: flex;
    gap: 8px;

    .stat-tag {
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border-radius: 50%;
      font-size: 12px;
      color: #fff;
      font-weight: bold;

      &.tag-red {
        background-color: #ff4d4f;
      }

      &.tag-yellow {
        background-color: #faad14;
      }

      &.tag-purple {
        background-color: #722ed1;
      }
    }
  }
}

.alarm-list-content {
  flex: 1;
  overflow-y: auto;
  min-height: 200px;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .alarm-card-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background: rgba(255, 77, 79, 0.05);
    border-left: 3px solid #ff4d4f;
    margin-bottom: 10px;
    border-radius: 2px;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 77, 79, 0.1);
    }

    .alarm-card-left {
      display: flex;
      align-items: center;
      gap: 15px;

      .alarm-icon-box {
        i {
          font-size: 20px;
        }
      }

      .alarm-info-box {
        .alarm-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .alarm-subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }

    .alarm-card-right {
      .alarm-time-text {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
      }
    }
  }

  .empty-alarm {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: rgba(255, 255, 255, 0.3);
    gap: 10px;

    i {
      font-size: 40px;
    }
  }
}
</style>
