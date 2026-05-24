<template>
  <div class="app-container">
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
          <ProjectInfo />
          <EventChart />
        </aside>
      </main>
    </div>
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue'
import AlarmList from './components/AlarmList.vue'
import MapArea from './components/MapArea.vue'
import ProjectInfo from './components/ProjectInfo.vue'
import EventChart from './components/EventChart.vue'

export default {
  name: 'App',
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
      center: [116.40769, 39.89945],
      zoom: 12
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
.app-container {
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
