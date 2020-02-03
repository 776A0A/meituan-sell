主要负责显示总价等数据
<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{ highlight: totalCount > 0 }">
              <i
                class="icon-shopping_cart"
                :class="{ highlight: totalCount > 0 }"
              ></i>
            </div>
            <div class="num" v-show="totalCount > 0">
              <Bubble :num="totalCount" />
            </div>
          </div>
          <div class="price" :class="{ highlight: totalPrice > 0 }">
            ￥{{ totalPrice }}
          </div>
          <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass">
            {{ payDesc }}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition
            @beforeEnter="beforeDrop"
            @enter="dropping"
            @afterEnter="afterDrop"
          >
            <!-- 
            动画效果需要一个套路就是外层在y轴上变化
            内层在x轴上变化，这样达到一个抛物线的效果
           -->
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Bubble from '../bubble';

  const BALL_LEN = 10; // 框内小球数量
  const INNER_CLASS_HOOK = 'inner-hook';

  // 小球工厂，初始化小球信息，刚开始小球是不显示的
  function ballFactory() {
    return Array.from({ length: BALL_LEN }, () => ({
      show: false,
    }));
  }

  export default {
    name: 'shop-cart',
    components: { Bubble },
    props: {
      selectFoods: {
        type: Array,
        default: () => [],
      },
      deliveryPrice: {
        type: Number,
        default: 0,
      },
      minPrice: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        balls: ballFactory(),
      };
    },
    computed: {
      totalPrice() {
        if (this.selectFoods.length === 0) return 0;
        return this.selectFoods.reduce(
          (total, { price, count }) => (total += price * count),
          0,
        );
      },
      totalCount() {
        if (this.selectFoods.length === 0) return 0;
        return this.selectFoods.reduce(
          (total, { count }) => (total += count),
          0,
        );
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          return `还差${this.minPrice - this.totalPrice}元起送`;
        } else {
          return `去结算`;
        }
      },
      payClass() {
        if (this.totalCount || this.totalPrice < this.minPrice) {
          return `not-enough`;
        } else {
          return `enough`;
        }
      },
    },
    created() {
      this.dropBalls = []; // 记录可以进行飞出的小球
    },
    methods: {
      /**
       * 小球飞出的总体思想是
       * 假设有多个小球在购物筐内，当点击加按钮时
       * 将购物框内的小球移动到被点击的加按钮处，然后再返回给购物框
       * 购物筐内需要有多个小球，因为用户可能回连续点击
       * 那么就要有多个小球同时飞出
       */
      drop(el) {
        const balls = this.balls;

        for (const ball of balls) {
          // 取出一个show为false的小球
          if (!ball.show) {
            ball.show = true; // 显示它
            ball.el = el; // 记录点击的加按钮元素
            this.dropBalls.push(ball); // 记录可以进行飞出的小球
            return;
          }
        }
      },
      // 小球动画开始
      beforeDrop(el) {
        const ball = this.dropBalls[this.dropBalls.length - 1]; // 从可飞出的小球中取出最新的一个
        const { left, top } = ball.el.getBoundingClientRect(); // 拿到加按钮的位置
        const transformX = left - 32; // 从购物框中到加按钮的x轴位移
        /**
         * 从购物框中到加按钮的y轴位移
         * innerHeight是整个视口的高度，减去加按钮距离视口顶部的距离
         * 再减去小球原本在购物框中距离底部有22px的距离
         * 从购物框中位移，也就是translate，在x轴是正的，在y轴是负的，所以加个减号
         */
        const transformY = -(window.innerHeight - top - 22);

        // el.style.display = `block`; // 显示小球，加不加没影响，因为有v-show了
        el.style.transform = el.style.webkitTransform = `translate3d(0, ${transformY}px, 0)`; // 外层在y轴位移
        const innerEl = el.getElementsByClassName(INNER_CLASS_HOOK)[0];
        innerEl.style.transform = innerEl.style.webkitTransform = `translate3d(${transformX}px, 0, 0)`; // 内层在x轴位移
      },
      // 动画进行中
      dropping(el, done) {
        // eslint-disable-next-line no-unused-vars
        const _reflow = document.body.offsetHeight; // QU 强制浏览器重绘，具体还搞不懂
        el.style.transform = el.style.webkitTransform = `translate3d(0, 0, 0)`; // 复位
        const innerEl = el.getElementsByClassName(INNER_CLASS_HOOK)[0];
        innerEl.style.transform = innerEl.style.webkitTransform = `translate3d(0, 0, 0)`; // 复位

        el.addEventListener('transitionend', done); // 动画结束调用done以触发下一个动画钩子
      },
      // 动画结束
      afterDrop(el) {
        const ball = this.dropBalls.shift(); // 取出最早进入的小球
        if (ball) {
          ball.show = false; // 隐藏
          el.style.display = `none`; // 这个必须加，不加小球隐藏会有延迟
        }
      },
    },
  };
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .shopcart
    height: 100%
    .content
      display: flex
      background: $color-background
      font-size: 0
      color: $color-light-grey
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: $color-background
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: $color-dark-grey
            &.highlight
              background: $color-blue
            .icon-shopping_cart
              line-height: 44px
              font-size: $fontsize-large-xxx
              color: $color-light-grey
              &.highlight
                color: $color-white
          .num
            position: absolute
            top: 0
            right: 0
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-weight: 700
          font-size: $fontsize-large
          &.highlight
            color: $color-white
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: $fontsize-small-s
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-weight: 700
          font-size: $fontsize-small
          &.not-enough
            background: $color-dark-grey
          &.enough
            background: $color-green
            color: $color-white
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: $color-blue
          transition: all 0.4s linear
</style>
