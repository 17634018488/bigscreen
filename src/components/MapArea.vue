<template>
  <div class="map-area">
    <div class="monitor-tabs">
      <div class="tab-item">
        <img :src="require('@/assets/img/烟火ico.png')" alt="fire" class="tab-icon">
        <span>烟火监控</span>
      </div>
      <div class="tab-item">
        <img :src="require('@/assets/img/电ico.png')" alt="bolt" class="tab-icon">
        <span>用电安全</span>
      </div>
      <div class="tab-item">
        <img :src="require('@/assets/img/合规ico.png')" alt="user" class="tab-icon">
        <span>合规监控</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapArea'
}
</script>

<style scoped lang="scss">
.map-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.monitor-tabs {
  display: flex;
  justify-content: center;
  gap: 50px;
  padding: 100px 0 0;
  pointer-events: auto;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 30px;
  // background: rgba(0, 20, 45, 0.75);
  // border: 1px solid rgba(0, 212, 255, 0.4);
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  line-height: 22px;
  cursor: pointer;
  transition: all 0.3s;
  // box-shadow: 0 0 15px rgba(0, 150, 200, 0.2), inset 0 0 15px rgba(0, 212, 255, 0.1);
  // backdrop-filter: blur(4px);

  &:hover {
    background: rgba(0, 50, 100, 0.85);
    border: solid 1px #00d4ff;
    box-shadow: 0 0 25px rgba(0, 212, 255, 0.5), inset 0 0 20px rgba(0, 212, 255, 0.25);
    transform: translateY(-2px);
  }
}

.tab-icon {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
