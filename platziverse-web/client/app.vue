<template>
  <div>
    <agent
      v-for="agent in agents"
      :uuid="agent.uuid"
      :socket="socket"
      :key="agent.uuid">
    </agent>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<style>
  body {
    font-family: Arial;
    background: #f8f8f8;
    margin: 0;
  }
</style>

<script>
const request = require('request-promise-native')
const io = require('socket.io-client')
const socket = io()

module.exports = {
  data () {
    return {
      agents: [],
      error: null,
      socket
    }
  },

  mounted () {
    this.initialize()
  },

  methods: {
    async initialize () {
      const options = {
        method: 'GET',
        url: 'http://localhost:8080/agents',
        json: true
      }

      try {
        const agents = await request(options)
        this.agents = agents

        this.startRealtime()
      } catch (e) {
        this.error = e.error.error
      }
    },
    startRealtime () {
      socket.on('agent/connected', payload => {
        const existing = this.agents.find(a => a.uuid === uuid)

        if (!existing) {
          this.agents.push(payload.agent)
        }
      })
    }
  }
}
</script>
