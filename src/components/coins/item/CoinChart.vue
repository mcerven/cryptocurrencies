<template>
  <vue-echarts :option="option" style="height: 500px" ref="chart" />
</template>

<script>
import { ref, watch } from 'vue';
import { VueEcharts } from 'vue3-echarts';

export default ({
  components: {
    VueEcharts,
  },
  props: {
    prices: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const option = ref({});

    watch(() => props.prices, (newPrices) => {
      option.value = {
        title: {
          text: 'History',
          left: 0
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: false
            },
            saveAsImage: {
              pixelRatio: 2
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          bottom: 90
        },
        dataZoom: [{
          type: 'inside'
        }, {
          type: 'slider'
        }],
        xAxis: {
          data: newPrices.map(({date}) => date.toLocaleString()),
          silent: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        yAxis: {
          splitArea: {
            show: false
          }
        },
        series: [{
          type: 'bar',
          data: newPrices.map(({price}) => price),
          // Set `large` for large data amount
          large: true
        }]
      };
    });

    return {
      option,
    };
  },
})
</script>
