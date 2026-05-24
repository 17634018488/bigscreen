<template>
  <div class="home-container">
    <!-- 全屏地图背景层 -->
    <div id="tiandituMap" ref="mapContainer" class="fullscreen-map"></div>

    <!-- 浮动 UI 层 -->
    <div class="ui-overlay">
      <header class="header">
        <HeaderBar />
      </header>
      <main class="main-content">
        <aside class="left-panel">
          <AlarmList />
        </aside>
        <section class="center-panel">
          <MapArea />
        </section>
        <aside class="right-panel">
          <ProjectInfo @projects-loaded="handleProjectsLoaded" />
          <EventChart />
        </aside>
      </main>
    </div>
  </div>
</template>

<script>
import HeaderBar from '../components/HeaderBar.vue'
import AlarmList from '../components/AlarmList.vue'
import MapArea from '../components/MapArea.vue'
import ProjectInfo from '../components/ProjectInfo.vue'
import EventChart from '../components/EventChart.vue'

export default {
  name: 'Home',
  components: {
    HeaderBar,
    AlarmList,
    MapArea,
    ProjectInfo,
    EventChart
  },
  data () {
    return {
      map: null,
      center: [113.32459, 23.12911],
      zoom: 10,
      projects: [],
      markers: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initMap()
    })
  },
  beforeDestroy () {
    if (this.map) {
      this.map.destroy()
      this.map = null
    }
    const oldStyle = document.getElementById('tianditu-dark-style')
    if (oldStyle) {
      oldStyle.remove()
    }
  },
  methods: {
    handleProjectsLoaded (projects) {
      this.projects = projects
      if (this.map) {
        this.addProjectMarkers()
      }
    },

    addProjectMarkers () {
      // 清除旧标记
      this.markers.forEach(marker => {
        this.map.removeOverLay(marker)
      })
      this.markers = []

      if (!this.projects || this.projects.length === 0) return

      const points = []
      this.projects.forEach(project => {
        if (project.longitude && project.latitude) {
          const lnglat = new window.T.LngLat(project.longitude, project.latitude)
          const marker = new window.T.Marker(lnglat)
          
          // 创建信息窗口内容
          const contentDom = document.createElement('div')
          contentDom.style.color = '#333'
          contentDom.style.padding = '5px'
          contentDom.style.minWidth = '200px'
          contentDom.innerHTML = `
            <h4 style="margin:0 0 8px 0;color:#1890ff;font-size:16px;">${project.name}</h4>
            <div style="margin-bottom:4px;font-size:13px;">
              <span style="color:#666;">状态:</span> 
              <span style="color:${project.status === 'active' ? '#52c41a' : '#faad14'}">${this.formatStatus(project.status)}</span>
            </div>
            <div style="margin-bottom:10px;font-size:13px;">
              <span style="color:#666;">单位:</span> ${project.constructionUnit}
            </div>
            <div style="text-align:right;">
              <button class="detail-btn" style="
                background:#1890ff;
                color:#fff;
                border:none;
                padding:4px 12px;
                border-radius:4px;
                cursor:pointer;
                font-size:12px;
                transition:all 0.3s;
              ">查看详情</button>
            </div>
          `
          
          // 为按钮绑定跳转事件
          const btn = contentDom.querySelector('.detail-btn')
          btn.onclick = (e) => {
            e.stopPropagation()
            this.$router.push({
              name: 'ProjectDetail',
              params: { id: project.id }
            })
          }
          btn.onmouseover = () => { btn.style.background = '#40a9ff' }
          btn.onmouseout = () => { btn.style.background = '#1890ff' }

          const infoWindow = new window.T.InfoWindow(contentDom, { offset: new window.T.Point(0, -30) })
          
          marker.addEventListener('click', () => {
            marker.openInfoWindow(infoWindow)
          })

          this.map.addOverLay(marker)
          this.markers.push(marker)
          points.push(lnglat)
        }
      })

      // 自动调整视野
      if (points.length > 0) {
        this.map.setViewport(points)
      }
    },

    formatStatus(status) {
      const statusMap = {
        'active': '进行中',
        'planning': '规划中',
        'completed': '已完成'
      }
      return statusMap[status] || status
    },

    initMap () {
      if (typeof window.T === 'undefined') {
        setTimeout(() => this.initMap(), 500)
        return
      }

      this.map = new window.T.Map('tiandituMap')
      this.map.centerAndZoom(
        new window.T.LngLat(this.center[0], this.center[1]),
        this.zoom
      )

      var zoomCtrl = new window.T.Control.Zoom()
      this.map.addControl(zoomCtrl)

      this.injectDarkStyles()

      // 如果数据已经先加载好了，直接画点
      if (this.projects.length > 0) {
        this.addProjectMarkers()
      }

      window.addEventListener('resize', this.handleResize)
    },

    handleResize () {
      if (this.map) {
        this.map.setViewport([0, 0, window.innerWidth, window.innerHeight])
      }
    },

    injectDarkStyles () {
      if (document.getElementById('tianditu-dark-style')) return
      var style = document.createElement('style')
      style.id = 'tianditu-dark-style'
      style.textContent = `
        /* 地图瓦片暗色滤镜 — 深蓝科技风 */
        #tiandituMap .tdt-layer img {
          filter: invert(1) hue-rotate(190deg) brightness(0.55) contrast(0.9) saturate(0.4) !important;
        }

        /* 缩放控件暗色主题 */
        .tdt-control-zoom {
          top: 140px !important;
          left: 20px !important;
          border: none !important;
        }
        .tdt-control-zoom a {
          background-color: rgba(0, 25, 50, 0.85) !important;
          color: #00d4ff !important;
          border-color: rgba(0, 212, 255, 0.3) !important;
        }
        .tdt-control-zoom a:hover {
          background-color: rgba(0, 50, 90, 0.9) !important;
          border-color: #00d4ff !important;
        }

        /* 隐藏版权和Logo */
        .tdt-control-copyright {
          display: none !important;
        }
        .tdt-control-logo {
          display: none !important;
        }
      `
      document.head.appendChild(style)
    }
  }
}
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100vh;
  position: relative;
  color: #fff;
  overflow: hidden;
}

/* ========== 全屏地图层 ========== */
.fullscreen-map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* ========== UI 浮动层 ========== */
.ui-overlay {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.header {
  height: 120px;
  flex-shrink: 0;
  pointer-events: auto;
}

.main-content {
  width: 100%;
  height: calc(100% - 50px);
  flex: 1;
  display: flex;
  padding: 0 20px 20px;
  gap: 16px;
  min-height: 0;
  pointer-events: none;
  position: absolute;
  top: 50px;
}

.left-panel {
  width: 400px;
  height: 100%;
  flex-shrink: 0;
  pointer-events: auto;
}

.center-panel {
  flex: 1;
  height: 100%;
  min-width: 0;
  pointer-events: none;
}

.right-panel {
  width: 400px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  pointer-events: auto;
}
</style>
