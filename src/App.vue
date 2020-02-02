<template>
  <div id="app">
    <VHeader :seller="seller" />
  </div>
</template>

<script>
  import VHeader from './components/v-header/v-header';
  import { getSeller } from './api';

  export default {
    name: 'app',
    data() {
      return {
        seller: {},
      };
    },
    created() {
      this._getSeller();
    },
    methods: {
      _getSeller() {
        return getSeller().then(res => (this.seller = res));
      },
    },
    components: { VHeader },
  };
</script>

<style lang="stylus"></style>
