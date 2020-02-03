传入food，并带有add和decrease方法
<template>
  <div class="cartcontrol">
    <!-- 注意这里的动画效果编写 -->
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop="decrease">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{ food.count }}</div>
    <div class="cart-add icon-add_circle" @click.stop="add($event)"></div>
  </div>
</template>
<script>
  const EVENT_ADD = 'add';

  export default {
    name: 'cart-control',
    props: {
      food: {
        type: Object,
      },
    },
    methods: {
      add(e) {
        // count 字段是后面添加上去的，不是后台返回就有的
        if (!this.food.count) {
          this.$set(this.food, 'count', 1); // 为了能够响应式
        } else {
          this.food.count++;
        }

        this.$emit(EVENT_ADD, e.target); // 派发事件，并将元素传出，因为需要元素的高度等信息
      },
      decrease() {
        if (this.food.count === 0) return;
        this.food.count--;
      },
    },
  };
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .cartcontrol
    display: flex
    align-items: center
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      .inner
        display: inline-block
        line-height: 24px
        font-size: $fontsize-large-xxx
        color: $color-blue
        transition: all .4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all .4s linear
      &.move-enter, &.move-leave-to
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      width: 12px
      line-height: 24px
      text-align: center
      font-size: $fontsize-small-s
      color: $color-grey
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: $fontsize-large-xxx
      color: $color-blue
</style>
