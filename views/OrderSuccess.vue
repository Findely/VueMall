<template>
    <div>
        <Header></Header>
        <div class="container">
            <div class="page-title-normal">
            <h2 class="page-title-h2"><span>check out</span></h2>
            </div>
            <!-- 进度条 -->
            <div class="check-step">
            <ul>
                <li class="cur"><span>Confirm</span> address</li>
                <li class="cur"><span>View your</span> order</li>
                <li class="cur"><span>Make</span> payment</li>
                <li class="cur"><span>Order</span> confirmation</li>
            </ul>
            </div>
            <div class="order-create">
            <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
            <div class="order-create-main">
                <h3>Congratulations! <br>Your order is under processing!</h3>
                <p>
                <span>Order ID：{{orderId}}</span>
                <span>Order total：{{orderTotal|currency('$')}}</span>
                </p>
                <div class="order-create-btn-wrap">
                <div class="btn-l-wrap">
                    <!-- <a href="javascript:;" class="btn btn--m">Cart List</a> -->
                    <router-link  class="btn btn--m" to="/cart">Cart List </router-link>
                </div>
                <div class="btn-r-wrap">
                    <!-- <a href="javascript:;" class="btn btn--m">Goods List</a> -->
                    <router-link class="btn btn--m" to="/"> Goods List</router-link>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
import './../assets/css/base.css';
import './../assets/css/checkout.css';
import "./../assets/css/login.css";
import "./../assets/css/product.css";
import Header from "@/components/Header";
import NavFooder from "@/components/NavFooter";
import Navbread from "@/components/Navbread";
import axios from 'axios';
import { currency } from './../util/currency';
export default {
    data() {
        return {
            orderId: '',
            orderTotal: 0
        }
    },
    mounted() {
        var orderId = this.$route.query.orderId;
        if (!orderId) {
            return;
        }
        axios.get('/users/orderDetail', {
            params: {
                orderId: orderId
            }
        }).then((respose) => {
            let res = respose.data;
            if (res.status == '0') {
                this.orderId = orderId;
                this.orderTotal = res.result.orderTotal;
            }
        })
    },
    components: {
        Header,
        NavFooder,
        Navbread
    }
}
</script>

