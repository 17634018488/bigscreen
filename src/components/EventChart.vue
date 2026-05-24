<template>
  <div class="event-chart">
    <div class="panel-header">
      <h3 class="panel-title">今日事件</h3>
      <span class="more-btn">
        More
        <img src="../assets/img/更多ico.png" alt="more" class="more-icon">
      </span>
    </div>
    <div class="chart-content">
      <div ref="chart" class="chart-container"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'EventChart',
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: '#00d4ff',
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['摄像头', '电', '网络', '存储', '服务器'],
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 212, 255, 0.2)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          max: 100,
          splitLine: {
            lineStyle: {
              color: 'rgba(0, 212, 255, 0.08)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: 10
          }
        },
        series: [
          {
            name: '一般',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: [30, 40, 35, 20, 45],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#00d4ff' },
                { offset: 1, color: '#0088aa' }
              ]),
              borderRadius: [0, 0, 0, 0]
            }
          },
          {
            name: '中等',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: [30, 25, 30, 40, 25],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ffcc00' },
                { offset: 1, color: '#cc9900' }
              ])
            }
          },
          {
            name: '严重',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: [40, 35, 35, 40, 30],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ff3b30' },
                { offset: 1, color: '#cc1400' }
              ]),
              borderRadius: [4, 4, 0, 0]
            }
          }
        ]
      };
      this.chart.setOption(option);
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    }
  }
}
</script>

<style scoped lang="scss">
.event-chart {
  flex: 1;
  min-height: 0;
  // background: url('~@/assets/img/右下边.png') no-repeat;
  background: rgba(3, 18, 53, 0.6);
  background-size: 100% 100%;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
}

.panel-header {
  flex-shrink: 0;
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
  margin-top: -16px;
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

.chart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 5px 5px 10px;
  width: 100%;
  min-height: 0;
}

.chart-container {
  width: 100%;
  height: 100%; /* 让图表充满 chart-content 的剩余空间 */
}
</style>
