import Vue from 'vue';
import { createAPI } from 'cube-ui';

import HeaderDetail from './components/header-detail/header-detail.vue';
createAPI(Vue, HeaderDetail);

import ShopCartList from './components/shop-cart-list';
createAPI(Vue, ShopCartList);

import ShopCartSticky from './components/shop-cart-sticky/shop-cart-sticky.vue';
createAPI(Vue, ShopCartSticky);
