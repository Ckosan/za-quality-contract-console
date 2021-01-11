<template>
  <div v-loading="regionLoading" class="dashboard-container div-menu">
    <component :is="currentRole" />
  </div>
</template>

<script>
import editorDashboard from './editor'
import { getQueryTicket } from '../../utils/tools'
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  components: { editorDashboard },
  data() {
    return {
      menuData: [],
      currentRole: 'editorDashboard'
    }
  },
  computed: {
    ...mapGetters(['pagination', 'regionLoading'])
  },
  created() {
    const ticket = getQueryTicket('ticket')
    if (ticket) {
      localStorage.setItem('ticket', ticket)
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">
  .div-menu{
    zoom: 0.9;
  }
</style>
