<template>
  <div class="content">
    <header class="header">
      <p class="top">
        <span>
          钱包资产
          <img
            src="@/assets/img/walletChangeIcon.png"
            alt=""
            @click="changeVal"
          />
        </span>
        <span class="sp1">连接钱包</span>
      </p>
      <div class="main">
        <p v-show="changeValue">
          <span>USDT</span>
          <span>{{ USDT }}</span>
        </p>
        <p v-show="changeValue">
          <span>EOTC</span>
          <span>{{ EOTC }}</span>
        </p>

        <p v-show="!changeValue">
          <span>USDT</span>
          <span>{{ nft_USDT }}</span>
        </p>
        <p v-show="!changeValue">
          <span>EOTC</span>
          <span>{{ nft_EOTC }}</span>
        </p>
      </div>
    </header>
    <div class="main-p">
      <van-collapse accordion v-model="activeNames">
        <van-collapse-item
          title="白名单"
          :icon="require('../../assets/img/rightMenuIcon/whiteListIcon.png')"
          name="2"
        >
          <div>白名单</div>
        </van-collapse-item>
        <van-collapse-item
          title="盲盒"
          :icon="require('../../assets/img/rightMenuIcon/blindBoxIcon.png')"
          name="3"
        >
          <div>盲盒</div>
        </van-collapse-item>
        <van-collapse-item
          title="市场"
          :icon="require('../../assets/img/rightMenuIcon/bazaarIcon.png')"
          name="4"
        >
          <div>市场</div>
        </van-collapse-item>
        <van-collapse-item
          title="订单"
          :icon="require('../../assets/img/rightMenuIcon/orderIcon.png')"
          name="5"
        >
          <div>订单</div>
        </van-collapse-item>
        <van-collapse-item
          title="我的NFT"
          :icon="require('../../assets/img/rightMenuIcon/nftCardIcon.png')"
          name="6"
        >
          <div
            :style="{ marginLeft: '35px', fontSize: '0.45rem',padding:'5px 0' }"
            @click="myNftLIST()"
          >
            权益卡牌
          </div>
          <div :style="{ marginLeft: '35px', fontSize: '0.45rem',padding:'5px 0' }">
            等级卡牌
          </div>
        </van-collapse-item>
        <van-collapse-item
          title="合成"
          :icon="require('../../assets/img/rightMenuIcon/guideIcon.png')"
          name="7"
        >
          <div>合成</div>
        </van-collapse-item>
        <van-collapse-item
          title="新手指引"
          :icon="require('../../assets/img/rightMenuIcon/orderIcon.png')"
          name="8"
        >
          <div>新手指引</div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { UserInfo } from "@/utils/web3";
export default {
  name: "Nav_right",
  data() {
    return {
      activeNames: "1",
      USDT: "0.00",
      EOTC: "0.00",
      nft_USDT: "0.00",
      nft_EOTC: "0.00",
      changeValue: true,
    };
  },
  async created() {
    const result = UserInfo();
    this.USDT = result.myamount;
    this.EOTC = result.eotcAmount;
    this.nft_USDT = result.wallet_NFTusdt;
    this.nft_EOTC = result.wallet_NFTeotc;
  },
  methods: {
    getItem() {
      return;
    },
    changeVal() {
      this.changeValue = !this.changeValue;
    },
    myNftLIST() {
      this.$router.push({
        name: "mynft_list",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.main-p {
  overflow-y: auto;
  margin-top: 1rem;
}

.content {
  width: 100vw;
  display: flex;
  position: relative;
  background-color: rgb(8, 11, 19);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  color: #fff;
  overflow-y: auto;
  .van-collapse {
    overflow-y: auto;
  }
  .header {
    margin: 25px 25px 0 25px;
    background: linear-gradient(to right, #2a86ff, #54dcff);
    font-size: 0.4rem;
    border-radius: 15px;
    padding: 25px;
    .top {
      font-size: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      img {
        width: 30px;
        height: 30px;
      }
      .sp1 {
        border: 1px solid #fff;
        border-radius: 30px;
        padding: 10px 20px;
        font-size: 0.4rem;
      }
    }
    .main {
      margin-top: 0.6rem;
      display: flex;
      overflow: hidden;
      p {
        flex: 1;
        display: flex;
        flex-direction: column;
        font-weight: 700;
      }
    }
  }
  ul {
    margin-top: 1rem;
  }
  /deep/ .van-icon__image {
    width: 50px;
    height: 50px;
  }
  /deep/ .van-cell--clickable {
    background-color: #000;
    color: #fff;
  }
  /deep/ .van-collapse-item__content {
    background-color: #000;
    color: #fff;
  }
  .vant {
    margin-top: 1rem;
    overflow-y: auto;
  }
  /deep/ .van-hairline--top-bottom::after {
    border: none !important;
  }
  li {
    line-height: 1rem;
    width: 100%;
    .towmenu {
      margin-left: 68px;
      font-size: 0.45rem;
    }
    .onemenu {
      list-style: none;
      font-size: 0.45rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 25px;
      box-sizing: border-box;
      div {
        display: flex;
        align-items: center;
      }
      img {
        width: 0.6rem;
        height: 0.6rem;
        margin-right: 15px;
      }
      .open,
      .close {
        display: block;
        width: 10px;
        height: 10px;
        border: 6px solid #666;
        border-top: none;
        border-left: none;
      }
      .open {
        transform: rotate(45deg);
      }
      .close {
        transform: rotate(-45deg);
      }
    }
  }
}
</style>
