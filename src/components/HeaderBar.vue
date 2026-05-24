<template>
  <div class="header-bar">
    <h1 class="title">智慧监控AI平台</h1>
    <div class="date-area">
      <span class="date-text">{{ currentDate }}</span>
    </div>
    <div class="header-decor"></div>
  </div>
</template>

<script>
export default {
  name: 'HeaderBar',
  data () {
    return {
      currentDate: ''
    }
  },
  mounted () {
    this.updateDate()
    setInterval(() => {
      this.updateDate()
    }, 1000)
  },
  methods: {
    updateDate () {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      this.currentDate = `${year}年${month}月${day}日`
    }
  }
}
</script>

<style scoped lang="scss">
.header-bar {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 0;
}

.title {
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 8px;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.9), 0 0 40px rgba(0, 212, 255, 0.4);
  margin-bottom: 4px;
  line-height: 1.1;
  position: absolute;
  top: 30px;
}

.date-area {
  position: absolute;
  right: 40px;
  bottom: 90px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 1px;
}

.date-text {
  font-family: Arial, sans-serif;
}

.header-decor {
  width: 100%;
  height: 100px;
  flex-shrink: 0;
  background: url('~@/assets/img/top.png') no-repeat center 0;
  background-size: 100% auto;
  position: absolute;
  top: 0;
  z-index: -10;
}
</style>
