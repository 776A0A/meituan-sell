<template>
  <div class="tab">
    <cube-tab-bar
      :showSlider="true"
      v-model="selectedLabel"
      :data="tabs"
      ref="tabBar"
      class="border-bottom-1px"
      :useTransition="false"
    >
    </cube-tab-bar>
    <div class="slide-wrapper">
      <cube-slide
        :loop="false"
        :auto-play="false"
        :show-dots="false"
        :initial-index="index"
        ref="slide"
        @change="onChange"
        @scroll="onScroll"
        :options="slideOption"
      >
        <cube-slide-item v-for="(tab, index) in tabs" :key="index">
          <!-- 动态渲染组件 -->
          <component :is="tab.component" :data="tab.data" ref="components" />
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script>
  /* eslint-disable vue/no-unused-components */

  export default {
    name: 'tab',
    props: {
      tabs: {
        type: Array,
        default: () => [],
      },
      initialIndex: {
        // 初始渲染的选中tab
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        index: this.initialIndex,
        slideOption: {
          probeType: 3,
          listenScroll: true,
          directionLockThreshold: 0,
        },
      };
    },
    computed: {
      selectedLabel: {
        get() {
          return this.tabs[this.index].label;
        },
        set(newVal) {
          this.index = this.tabs.findIndex(value => value.label === newVal);
        },
      },
    },
    mounted() {
      this.onChange(this.initialIndex); // 初始化渲染数据
    },
    methods: {
      onChange(currentIndex) {
        this.index = currentIndex;
        const component = this.$refs.components[currentIndex]; // 拿到组件实例
        component.fetch && component.fetch();
      },
      onScroll(pos) {
        const transformX =
          (-pos.x / this.$refs.slide.slide.scrollerWidth) *
          this.$refs.tabBar.$el.offsetWidth;

        this.$refs.tabBar.setSliderTransform(transformX);
      },
    },
  };
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .tab
    >>> .cube-tab
      padding: 10px 0
    display: flex
    flex-direction: column
    height: 100%
    .slide-wrapper
      flex: 1
      overflow: hidden
      // height: 100%
</style>
