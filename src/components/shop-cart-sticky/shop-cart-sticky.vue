app内部的shop-cart组件的复制，为了能够盖住shop-cart-list的z-index
<template>
  <div class="shop-cart-sticky" v-show="visible">
    <shop-cart
      ref="shopCart"
      :selectFoods="selectFoods"
      :deliveryPrice="deliveryPrice"
      :minPrice="minPrice"
      :fold="fold"
      :sticky="true"
    >
    </shop-cart>
  </div>
</template>

<script>
  import ShopCart from 'components/shop-cart';
  import popup from 'common/mixins/popup';

  export default {
    name: 'shop-cart-sticky',
    mixins: [popup],
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [];
        },
      },
      deliveryPrice: {
        type: Number,
        default: 0,
      },
      minPrice: {
        type: Number,
        default: 0,
      },
      fold: {
        type: Boolean,
        default: true, // 默认底部商品列表收起
      },
      list: {
        type: Object,
        default: () => {},
      },
    },
    methods: {
      drop(el) {
        this.$refs.shopCart.drop(el);
      },
    },
    components: {
      ShopCart,
    },
  };
</script>

<style lang="stylus" scoped>
  .shop-cart-sticky
    position: absolute
    left: 0
    bottom: 0
    z-index: 999
    width: 100%
    height: 48px
</style>
