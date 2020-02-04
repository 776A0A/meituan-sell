<template>
  <div class="goods">
    <div class="scroll-nav-wrapper">
      <cube-scroll-nav
        :side="true"
        :data="goods"
        :options="scrollOptions"
        v-if="goods.length"
      >
        <!-- 当cube-scroll-nav组件的默认显示不能满足需求时，该组件提供了插槽bar，bar内部必须是一个cube-scroll-nav-bar组件 -->
        <!-- 通过该插槽来个性化定制左边的滚动栏显示效果 -->
        <template #bar="{txts, labels, current}">
          <cube-scroll-nav-bar
            direction="vertical"
            :txts="barTxts"
            :labels="labels"
            :current="current"
          >
            <!-- cube-scroll-nav-bar组件也有默认插槽 -->
            <!-- 这里的txt就是上面传入的txts中的每一项 -->
            <template #default="{txt:{type, name, count}}">
              <div class="text">
                <SupportIco v-if="type >= 1" :size="3" :type="type" />
                <span>{{ name }}</span>
                <span class="num" v-if="count">
                  <Bubble :num="count" />
                </span>
              </div>
            </template>
          </cube-scroll-nav-bar>
        </template>
        <cube-scroll-nav-panel
          v-for="good in goods"
          :key="good.name"
          :label="good.name"
          :title="good.name"
        >
          <ul>
            <li v-for="food in good.foods" :key="food.name" class="food-item">
              <div class="icon">
                <img :src="food.icon" alt="icon" width="57" height="57" />
              </div>
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <div class="desc">{{ food.description }}</div>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}份</span>
                  <span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{ food.price }}</span>
                  <span class="old" v-show="food.oldPrice"
                    >￥{{ food.oldPrice }}</span
                  >
                </div>
                <div class="cart-control-wrapper">
                  <CartControl :food="food" @add="onAdd" />
                </div>
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
      </cube-scroll-nav>
    </div>
    <div class="shop-cart-wrapper">
      <ShopCart
        :deliveryPrice="seller.deliveryPrice"
        :minPrice="seller.minPrice"
        :selectFoods="selectFoods"
        ref="shopCart"
      />
    </div>
  </div>
</template>

<script>
  import { getGoods } from 'api';
  import ShopCart from '../shop-cart';
  import CartControl from '../cart-control';
  import SupportIco from '../support-ico/support-ico.vue';
  import Bubble from '../bubble';

  export default {
    name: 'goods',
    components: { ShopCart, CartControl, SupportIco, Bubble },
    props: {
      // 这里传入的是当前商家，虽然在这里没有使用这个数据，但在真实情况下
      // 会根据传入的商家请求相应的数据
      data: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        goods: [],
        scrollOptions: {
          click: false,
          directionLockThreshold: 0,
        },
      };
    },
    computed: {
      seller() {
        return this.data.seller;
      },
      selectFoods() {
        // let ret = [];
        // this.goods.forEach(good => {
        //   good.foods.forEach(food => {
        //     if (food.count) ret.push(food);
        //   });
        // });

        return this.goods.reduce(
          (ret, good) => [
            ...ret,
            ...good.foods.filter(food => food.count && food),
          ],
          [],
        );
      },
      barTxts() {
        const ret = [];
        this.goods.forEach(({ type, name, foods }) => {
          const count = foods.reduce(
            (accu, { count = 0 }) => (accu += count),
            0,
          );
          // 之所以有这三个属性，是因为左边滚动栏需要这些数据以进行显示
          ret.push({ count, type, name });
        });

        return ret;
      },
    },
    methods: {
      // 这个接口是留给外部调用的
      fetch() {
        if (this.goods.length) return; // 如果已经调用过，返回
        getGoods().then(res => (this.goods = res));
      },
      onAdd(el) {
        // goods 组件在这里相当于一个中间层，传递事件及负载
        this.$refs.shopCart.drop(el);
      },
    },
  };
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
  .goods
    position: relative
    text-align: left
    height: 100%
    .scroll-nav-wrapper
      position: absolute
      width: 100%
      top: 0
      left: 0
      bottom: 48px
    >>> .cube-sticky-fixed
      .cube-sticky-content
        transform: translateY(-1px)
    >>> .cube-scroll-nav-bar
      width: 80px
      white-space: normal
      overflow: hidden
    >>> .cube-scroll-nav-bar-item
      padding: 0 10px
      display: flex
      align-items: center
      height: 56px
      line-height: 14px
      font-size: $fontsize-small
      background: $color-background-ssss
      .text
        flex: 1
        position: relative
      .num
        position: absolute
        right: -8px
        top: -10px
      .support-ico
        display: inline-block
        vertical-align: top
        margin-right: 4px
    >>> .cube-scroll-nav-bar-item_active
      background: $color-white
      color: $color-dark-grey
    >>> .cube-scroll-nav-panel-title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid $color-col-line
      font-size: $fontsize-small
      color: $color-grey
      background: $color-background-ssss
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      position: relative
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
        img
          height: auto
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: $fontsize-medium
          color: $color-dark-grey
        .desc, .extra
          line-height: 10px
          font-size: $fontsize-small-s
          color: $color-light-grey
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: $fontsize-medium
            color: $color-red
          .old
            text-decoration: line-through
            font-size: $fontsize-small-s
            color: $color-light-grey
      .cart-control-wrapper
        position: absolute
        right: 0
        bottom: 12px
    .shop-cart-wrapper
      position: absolute
      left: 0
      bottom: 0
      z-index: 50
      width: 100%
      height: 48px
</style>
