<template>
  <div class="metric">
    <h3 class="metric-type">{{ type }}</h3>
    <line-chart
      :chart-data="datacollection"
      :options="{ responsive: true }"
      :width="400" :height="200"
    ></line-chart>
    <p v-if="error">{{error}}</p>
  </div>
</template>
<style>
  .metric {
    border: 1px solid white;
    margin: 0 auto;
  }
  .metric-type {
    font-size: 28px;
    font-weight: normal;
    font-family: 'Roboto', sans-serif;
  }
  canvas {
    margin: 0 auto;
  }
</style>
<script>
const request = require('request-promise-native')
const moment = require('moment')
const randomColor = require('random-material-color')
const { serverHost } = require('../config')
const LineChart = require('./line-chart')

module.exports = {
  name: 'metric',
  components: {
    LineChart
  },
  props: [ 'uuid', 'type', 'socket' ],

  data() {
    return {
      datacollection: {},
      error: null,
      color: null
    }
  },

  mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      const { uuid, type } = this
      
      this.color = randomColor.getColor()

      const options = {
        method: 'GET',
        url: `${serverHost}/metrics/${uuid}/${type}`,
        json: true
      }

      try {
        const result = await request(options)

        const labels = []
        const data = []

        if (Array.isArray(result)) {
          result.forEach(metric => {
            labels.push(moment(metric.createdAt).format('HH:mm:ss'))
            data.push(metric.value)
          })
        }

        this.datacollection = {
          labels,
          datasets: [{
            backgroundColor: this.color,
            label: type,
            data,
          }]
        }

        this.startRealtime()

      } catch (e) {
        console.log(e)
        this.error = e.error.error
      }
    },
    startRealtime () {
      const { type, uuid, socket } = this

      socket.on('agent/message', payload => {
        if (payload.agent.uuid === uuid) {
          const metric = payload.metrics.find(m => m.type === type)

          const labels = this.datacollection.labels
          const data = this.datacollection.datasets[0].data

          const length = labels.length || data.length

          if (length >= 20) {
            labels.shift()
            data.shift()
          }

          labels.push(moment(metric.createdAt).format('HH:mm:ss'))
          data.push(metric.value)

          this.datacollection = {
            labels,
            datasets: [{
              backgroundColor: this.color,
              label: type,
              data,
            }]
          }
        }
      })
    },
    handleError (err) {
      this.error = err.message
    }
  }
}
</script>
