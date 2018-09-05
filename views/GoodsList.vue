<template>
<div>
<Header></Header>
<Navbread>
  <span slot="bread">GOODs</span>
</Navbread>
<div class="accessory-result-page accessory-page">
  <symbol id="icon-arrow-short" viewBox="0 0 25 32">
          <title>arrow-short</title>
          <path class="path1" d="M24.487 18.922l-1.948-1.948-8.904 8.904v-25.878h-2.783v25.878l-8.904-8.904-1.948 1.948 12.243 12.243z"></path>
  </symbol>
  <symbol id="icon-status-ok" viewBox="0 0 32 32">
        <title>status-ok</title>
        <path class="path1" d="M22.361 10.903l-9.71 9.063-2.998-2.998c-0.208-0.209-0.546-0.209-0.754 0s-0.208 0.546 0 0.754l3.363 3.363c0.104 0.104 0.241 0.156 0.377 0.156 0.131 0 0.261-0.048 0.364-0.143l10.087-9.414c0.215-0.201 0.227-0.539 0.026-0.754s-0.539-0.226-0.754-0.026z"></path>
        <path class="path2" d="M16 30.933c-8.234 0-14.933-6.699-14.933-14.933s6.699-14.933 14.933-14.933c8.234 0 14.933 6.699 14.933 14.933s-6.699 14.933-14.933 14.933zM16 0c-8.822 0-16 7.178-16 16 0 8.823 7.178 16 16 16s16-7.177 16-16c0-8.822-7.178-16-16-16z"></path>
  </symbol>
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a href="javascript:void(0)" class="price" @click="sortGoods">Price 
        <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':sortFlag}">
        <use xlink:href="#icon-arrow-short"></use>
        </svg>
      </a>
      <a href="javascript:void(0)" class="filterby"  @click="showFilterPop">Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="priceChecked=all">All</a></dd>
          <!-- <dd>
            <a href="javascript:void(0)">0 - 100</a>
          </dd> -->
          <dd v-for="(price,index) in priceFilter" >
            <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{price.starPrice}} - {{price.endPrice}}</a>
          </dd>
        </dl>
      </div>
      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="item in goodsList">
              <div class="pic">
                 <a href="#"><img v-lazy="'/static/'+item.productImage" alt="" :key="'/static/'+item.productImage"></a>
                <!-- <a href="#"><img v-bind:src="'/static/'+item.productImage" alt=""></a> -->
              </div>
              <div class="main">
                <div class="name">{{item.productName}}</div>
                <div class="price">{{item.salePrice}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">入购物车</a>
                </div>
              </div>
            </li>
          </ul>
          <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
           <img src="../assets/loading-spinning-bubbles.svg" v-show="loading">
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    </div>
  </div>
</div>
<NavFooder></NavFooder>   
  <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
          <p slot="message">
             请先登录,否则无法加入到购物车中!
          </p>
          <div slot="btnGroup">
              <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
          </div>
  </Modal>
  <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
    <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成!</span>
    </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
  </Modal>
                                                                                                                                                                                                                                                                                                          
</div>
</template>
<style>
.icon-arrow-short {
  transform: rotate(0deg);
  transition: all 0.5s ease;
}
.sort-up {
  transform: rotate(180deg);
  transition: all 0.5s ease;
}
</style>

<script>
import "./../assets/css/base.css";
import "./../assets/css/checkout.css";
import "./../assets/css/login.css";
import "./../assets/css/product.css";
import Header from "@/components/Header";
import NavFooder from "@/components/NavFooter";
import Navbread from "@/components/Navbread";
import Modal from '@/components/Modal';
import axios from "axios";
export default {
  data() {
    return {
      goodsList: [],
      priceFilter: [
        {
          starPrice: '0.00',
          endPrice: '500.00'
        },
        {
          starPrice: '500.00',
          endPrice: '1000.00'
        },
        {
          starPrice: '1000.00',
          endPrice: '2000.00'
        }
      ],
      priceChecked: "all",
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: true,
      loading: false,
      mdShow: false,
      mdShowCart: false
    }
  },
  components: {
    Header,
    NavFooder,
    Navbread,
    Modal
  },
  mounted: function () {
    this.getGoodsList();
  },
  methods: {
    /*axios 方法调取数据*/
    getGoodsList(flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      }
      this.loading = true;
      axios.get("/goods/list", { params: param }).then((resdata) => {
        var res = resdata.data;
        this.loading = false;
        if (res.status == '1') {
          if (flag) {
            this.goodsList = this.goodsList.concat(res.result.list);
            if (res.result.count == 0) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          } else {
            this.goodsList = res.result.list;
            this.busy = false;
          }
        } else {
          this.goodsList = []
        }
      }).catch(function (err) {
        console.log("error init." + err)
      })
    },
    /**价格排序方法 */
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    /* 价格查询方法*/
    setPriceFilter(index) {
      this.priceChecked = index;
      this.closePop();
      this.page = 1;
      this.getGoodsList();
    },
    /**加载更多方法调用 */
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 1000);
    },
    // productId
    addCart(productId) {
      axios.post("/goods/addCart", {
        productId: productId
      }).then((res) => {
        var res = res.data;
        if (res.status == 0) {
          this.mdShowCart = true;
          this.$store.commit('updateCatrCount', 1)
          // alert('加入成功')
        } else {
          this.mdShow = true
          // alert("加入失败")
        }
      });
    },
    closeModal() {
      this.closeModal = false;
      this.mdShow = false;
      this.mdShowCart = false;
    }

  }
};
</script>


