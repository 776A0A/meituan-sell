<template>
  <div id="app">
    <VHeader :seller="seller" />
    <div class="tab-wrapper">
      <Tab :tabs="tabs" />
    </div>
  </div>
</template>

<script>
  import VHeader from './components/v-header/v-header';
  import Tab from './components/tab/tab';
  import { getSeller } from './api';

  export default {
    name: 'app',
    data() {
      this.tabs = [
        {
          label: '商品',
        },
        {
          label: '评价',
        },
        {
          label: '商家',
        },
      ];

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
    components: { VHeader, Tab },
  };
</script>

<style lang="stylus">
  #app
    .tab-wrapper
      position: fixed
      top: 136px
      left: 0
      right: 0
      bottom: 0
</style>
