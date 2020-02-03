<template>
  <div id="app">
    <VHeader :seller="seller" />
    <div class="tab-wrapper">
      <Tab :tabs="tabs" :initialIndex="1" />
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import VHeader from './components/v-header/v-header';
  import Tab from './components/tab/tab';
  import { getSeller } from './api';

  export default {
    name: 'app',
    data() {
      return {
        seller: {},
      };
    },
    computed: {
      tabs() {
        const _this = this;
        return [
          {
            label: '商品',
            component: () => import('./components/goods/goods'),
            data: { seller: _this.seller },
          },
          {
            label: '评价',
            component: () => import('./components/ratings/ratings'),
            data: { seller: _this.seller },
          },
          {
            label: '商家',
            component: () => import('./components/seller/seller'),
            data: { seller: _this.seller },
          },
        ];
      },
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
