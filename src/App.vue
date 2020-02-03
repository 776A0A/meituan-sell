<template>
  <div id="app">
    <VHeader :seller="seller" />
    <div class="tab-wrapper">
      <Tab :tabs="tabs" :initialIndex="initialIndex" />
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import VHeader from './components/v-header/v-header';
  import Tab from './components/tab/tab';
  import { getSeller } from './api';

  import Goods from './components/goods/goods';
  import Ratings from './components/ratings/ratings';
  import Seller from './components/seller/seller';

  export default {
    name: 'app',
    data() {
      return {
        seller: {},
        initialIndex: 0,
      };
    },
    computed: {
      tabs() {
        const _this = this;
        return [
          {
            label: '商品',
            component: Goods,
            data: { seller: _this.seller },
          },
          {
            label: '评价',
            component: Ratings,
            data: { seller: _this.seller },
          },
          {
            label: '商家',
            component: Seller,
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
