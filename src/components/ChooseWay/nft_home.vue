<template>
  <div class="home">
    <div class="banner">
      <img src="@/assets/banner.png" alt @click="Play_explanation" />
    </div>
    <main class="main">
      <h6>期限</h6>
      <van-grid :column-num="4" clickable :gutter="10" :border="false">
        <van-grid-item v-for="(item, i) in tabList" class="item_tab" :class="{ active: item.isActive }" :key="i" :text="item.text" @click="activeTab(i)" />
      </van-grid>

      <div class="nh-ly">
        <p>
          <span>年化收益率</span>
          <span>{{year}}</span>
        </p>
        <p>
          <van-button round @click="showTotaldata">查看统计数据</van-button>
          <span>
            <span v-if="activeType === 'Flow'">1m</span> APY
          </span>
        </p>
      </div>
      <div class="record">
        <van-cell v-if="activeType === 'Regular'" @click="go()" title="质押记录" is-link />
      </div>
      <div class="zysh">
        <van-button class="buysell" :class="{ 'active-btn': !isPledges }" plain size="small" @click="changeisPledges()">质押</van-button>
        <van-button :class="{ 'active-btn': isPledges }" class="btn2 buysell" plain size="small" @click="changeisPledges()">赎回</van-button>
      </div>

      <!-- <div class="cut" v-if="activeType==='Regular'&& !isPledges ">
        <p v-show="switchShow">链上资产质押</p>
        <p v-show='!switchShow'>APP资产质押</p>
        <van-icon name="exchange" @click="exchange" />
      </div>-->

      <!-- 质押 -->
      <!-- 活期质押 -->
      <div v-if="activeType === 'Flow'">
        <section class="section-container" v-if="isPledges">
          <div class="sec-top">
            <span>质押 EOTC</span>
            <p>1 xEOTC = {{conversion}}</p>
          </div>
          <div class="sec-main">
            <p>
              <input class="outlineInput" type="number" v-model="zynum" placeholder="0 EOTC" />
              <span>
                余额: {{myEOTC}}
                <van-button @click="zynum=myEOTC">全部</van-button>
              </span>
            </p>

            <div class="estimate" v-if="zynum!=''">
              预估收益：
              <span>{{earnings}} EOTC</span>
            </div>

            <van-button round block class="zyBtn" @click="zysubmit">质押</van-button>
          </div>
        </section>

        <section class="section-container" v-else>
          <div class="sec-top">
            <span>赎回 EOTC</span>
            <p>1 xEOTC = {{conversion}}</p>
          </div>
          <div class="sec-main">
            <p>
              <input class="outlineInput" v-model="shnum" type="number" placeholder="0 xEOTC" />
              <span>
                质押到期: {{xEOTC}}
                <van-button @click="shnum=xEOTC">全部</van-button>
              </span>
            </p>
            <van-button round block @click="shsumit" class="zyBtn">赎回</van-button>
          </div>
        </section>
      </div>

      <!-- 定期质押 -->
      <div v-else>
        <section class="section-container" v-if="isPledges">
          <!-- <div class="sec-top">
            <span>质押 EOTC</span>
            <p >1 xEOTC = {{conversion}}</p>
          </div>-->
          <div class="sec-main">
            <p class="header-top" :style="{ padding: '0px 15px 15px 0' }">
              <span v-show="switchShow">链上资产质押</span>
              <span v-show="!switchShow">APP资产质押</span>
              <span>
                <van-icon name="exchange" @click="exchange" />
              </span>
            </p>
            <p>
              <input class="outlineInput" v-model="zynum" type="number" placeholder="0 EOTC" />
              <span>
                余额: {{myEOTC}}
                <van-button @click="zynum=myEOTC">全部</van-button>
              </span>
            </p>
            <div class="estimate" v-if="zynum!=''">
              预估收益：
              <span>{{earnings}} EOTC</span>
            </div>
            <van-button round block class="zyBtn" @click="zysubmit">质押</van-button>
          </div>
        </section>
        <section class="section-container" v-else>
          <!-- <div class="sec-top">
            <span>赎回 EOTC</span>
            <p>1 xEOTC = {{conversion}}</p>
          </div>-->
          <!-- <div class="sec-main">
            <p>
              <input class="outlineInput" v-model="shnum" type="number" placeholder="0 xEOTC">
              <span>质押到期: {{xEOTC}} <van-button @click="zynum=xEOTC">全部</van-button></span>
            </p>
            <van-button round block @click="shsumit" class="zyBtn"> 赎回 </van-button>
          </div>-->
          <div class="empty" v-if="list.length==0">
            <img src="@/static/icon/kong.png" alt />
            <p>暂无可赎回数据</p>
          </div>
          <div class="list" v-for="(item,index) in list" :key="index">
            <div class="listTop">
              <p>订单编号: {{item.order}}</p>
              <p>{{item.startTime}}</p>
            </div>
            <div class="listCenter">
              <div>
                <p>质押数量</p>
                <p>{{item.amount}}</p>
              </div>
              <div>
                <p>预计收益</p>
                <p>+{{item.reward}}</p>
              </div>
            </div>
            <div class="buttons">
              <div class="box">
                <van-button round block color="#28293D" @click="SecondPledge(index)">继续质押</van-button>
              </div>
              <div class="box">
                <van-button round block color="#2E3346" @click="ransom(index)">赎回</van-button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 赎回 -->

      <!-- 当前质押总量和待赎回总量 -->
      <van-grid v-if="activeType === 'Flow'" :column-num="2" :border="false" direction="horizontal">
        <van-grid-item>
          <template>
            <div class="item">
              <header>当前质押</header>
              <aside>
                <img :src="require('@/assets/logozi.png')" alt />
                <p>
                  <span>{{xEOTC}}</span>
                  <span>xEOTC</span>
                </p>
              </aside>
            </div>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template>
            <div class="item">
              <header>待赎回</header>
              <aside>
                <img :src="require('@/assets/logojin.png')" alt />
                <p>
                  <span>{{pending}}</span>
                  <span>EOTC</span>
                </p>
              </aside>
            </div>
          </template>
        </van-grid-item>
      </van-grid>

      <footer>
        <h6>EOTC链上理财赚币</h6>
        <section :class="{ 'van-multi-ellipsis--l3': !isopen }" @click="isopen = !isopen">
          EOTC链上理财赚币是EOTC打造帮助用户发现多种持币产品机会的一站式服务平台。包括存币宝、挖矿宝、质押赚币、C2C借贷、DEFI服务等产品，为用户提供丰富的产品选择。赚币的收益分为存入代币的利息和挖矿奖励。参考年化是存入代币的利息年化，综合年化指利息年化和挖矿年化的相加之和，两种年化都会实时浮动，不同项目的实际收益取决于链上挖矿的实际效率。申购不同的产品时，开始计算、发放收益的时间可能不同。资金成功上链后开始计算收益（因链上操作可能有延迟，以资金实际上链的时间为准）。EOTC仅提供第三方DEFI平台项目信息展示、数字资产上下链、奖励领取和发放服务，不对用户的数字资产进行管理，EOTC不承担任何由于合约漏洞、黑客事件、第三方DEFI平台暂停、终止业务、倒闭，非正常的暂停或停止交易等潜在风险造成的资产损失。
          <span
            v-if="isopen"
            @click="isopen = false"
            :style="{ color: '#fdd16a' }"
          >收起.</span>
        </section>
      </footer>
    </main>
  </div>
</template>

<script>
import {
  myxEOTCAmount,
  myEOTCAmount,
  MyStaking,
  MyUnstaking,
  MyRegularStaking,
  userSign,
  AnnualYield,
  Redeemable,
  getTrxBalance,
  sfeotc,
  MyRegularUnstaking,
  MySecondPledge
} from '@/utils/web3_stake'
import { Toast } from 'vant'
import { StakingEotc } from '@/api/trxRequest'
export default {
  name: 'zy-home',
  data() {
    return {
      tabList: [
        {
          text: '活期',
          isActive: true,
        },
        {
          text: '6个月',
          isActive: false,
        },
        {
          text: '12个月',
          isActive: false,
        },
        {
          text: '24个月',
          isActive: false,
        },
      ],
      curState: true,
      isopen: false,
      isPledges: true,
      activeType: 'Flow',
      // 我的钱包余额数据
      xEOTC: 'Loading', //当前质押
      myEOTC: 'Loading',
      //切换开关
      switchShow: true,
      //质押数量
      zynum: '',
      //赎回数量
      shnum: '',
      // 收益
      earnings: '',
      // 年化率
      year: 'Loading',
      //转换率
      conversion: 'Loading',
      //待赎回
      pending: 'Loading',
      // 当前
      nowaday: '',

      list: [],
    }
  },
  created() {
    this.init()
  },
  watch: {
    //预估收益计算
    zynum(newVal, oldVal) {
      if (this.nowaday == '') {
        this.earnings = Number((newVal * localStorage.getItem('LiveYear')) / 100).toFixed(2)
      } else {
        this.earnings = Number(
          (newVal * localStorage.getItem('yield') * this.nowaday) / 12
        ).toFixed(2)
      }
    },
  },
  methods: {
    init() {
      myxEOTCAmount(this)
      myEOTCAmount(this)
    },
    async activeTab(e) {
      this.tabList.forEach((item) => {
        item.isActive = false
      })
      this.tabList[e].isActive = true
      if (e == 1) {
        this.nowaday = 6
      } else if (e == 2) {
        this.nowaday = 12
      } else if (e == 3) {
        this.nowaday = 24
      } else {
        this.nowaday = ''
      }
      if ([1, 2, 3].includes(e)) {
        this.activeType = 'Regular'
        if (this.activeType == 'Regular' && !this.isPledges) {
          this.redeemList()
        }
        this.year = 'Loading'
        AnnualYield(this.nowaday).then((res) => {
          console.log(res)
          this.year = res * 100 + '%'
          this.earnings = Number((this.zynum * res * this.nowaday) / 12).toFixed(2)
        })
      } else if (e === 0) {
        this.activeType = 'Flow'
        this.year = localStorage.getItem('LiveYear') + '%'
        this.earnings = Number((this.zynum * localStorage.getItem('LiveYear')) / 100).toFixed(2)
      }
    },

    // app 与链上切换
    exchange() {
      this.switchShow = !this.switchShow
      if (this.switchShow) {
        this.myEOTC = Number(localStorage.getItem('myEOTCNum')).toFixed(2)
      } else {
        this.myEOTC = Number(localStorage.getItem('appEOTC')).toFixed(2)
      }
    },
    showTotaldata() {
      this.$toast.warning('功能暂未开放，敬请期待！')
    },
    changeisPledges() {
      this.isPledges = !this.isPledges
      if (this.activeType == 'Regular' && !this.isPledges) {
        this.redeemList()
      }
    },
    //定期质押活动介绍
    Play_explanation() {
      this.$router.push('Introduction')
    },
    //质押事件
    zysubmit() {
      let that = this
      if (this.zynum <= 0) {
        this.$toast.warning('请输入正确的EOTC数量！')
      } else if (this.zynum > Number(this.myEOTC)) {
        this.$toast.warning('您的EOTC余额不足！')
      } else if (this.nowaday == '') {
        MyStaking(this.zynum, this)
      } else if (this.nowaday != '' && this.switchShow) {
        MyRegularStaking(this.zynum, this.nowaday, this)
      } else if (this.nowaday != '' && !this.switchShow) {
        // userSign('EOTC请求您签名确认,签名不消耗GAS.', this.appzy)
        userSign('EOTC请求您签名确认,签名不消耗GAS.', function () {
          getTrxBalance(function () {
            sfeotc(function () {
              that.appzy(that)
            })
          })
        })
      }
    },
    // 赎回事件
    shsumit() {
      if (this.xEOTC == 0) {
        this.$toast.warning('暂无可赎回xEOTC！')
        return
      }
      if (this.shnum < 0) {
        this.$toast.warning('请输入正确的赎回数量！')
      } else if (this.shnum > Number(this.xEOTC)) {
        this.$toast.warning('您待赎回的xEOTC不足！')
      } else {
        MyUnstaking(this.shnum, this)
      }
    },
    //app资产质押
    appzy(that) {
      StakingEotc({ num: that.zynum, zq: that.nowaday }).then((res) => {
        let state = res.data.State
        if (state > 0) {
          let num = Number(localStorage.getItem('appEOTC') - that.zynum).toFixed(2)
          localStorage.setItem('appEOTC', num)
          that.myEOTC = num
          that.$toast.success('质押成功')
        } else {
          that.$toast.error('质押失败')
        }
        console.log(res)
      })
    },
    go() {
      localStorage.setItem('zq', this.nowaday)
      this.$router.push({ name: 'Chainrecord' })
    },
    //查询可赎回订单
    redeemList() {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中',
      })
      Redeemable(this.nowaday)
        .then((res) => {
          this.list=[]
          if (res.length == 0) {
            Toast.clear()
            return
          }
          for (let i of res) {
            i.startTime = this.getMyDate(i.startTime)

            let count = 9 - String(i.id).length
            i.order = i.id
            //订单号补0
            if (count != 0) {
              for (let j = 0; j < count; j++) {
                i.order = '0' + i.order
              }
            }
          }
          console.log(res)
          this.list = res
          Toast.clear()
        })
        .catch((err) => {
          console.log(err)
          Toast.clear()
        })
    },
    //定期赎回
    ransom(index) {
      let num = this.list[index].amount + this.list[index].reward
      MyRegularUnstaking(num, this.list[index].id, this.nowaday, this, index)
    },
    //二次质押
    SecondPledge(index){
      let num = this.list[index].amount + this.list[index].reward
      MySecondPledge(num, this.list[index].id, this.nowaday, this, index)
    },

    // 参数 str 为时间戳 可以传入10位也可以传入13位
    // 参数 bool的值可传true或者false或者不传，如果需要显示秒则传true，不需要显示则传false或者不传
    getMyDate(str, bool) {
      if (str > 9999999999) {
        // 这里判断：时间戳为几位数
        var c_Date = new Date(parseInt(str))
      } else {
        var c_Date = new Date(parseInt(str) * 1000)
      }
      var c_Year = c_Date.getFullYear(),
        c_Month = c_Date.getMonth() + 1,
        c_Day = c_Date.getDate(),
        c_Hour = c_Date.getHours(),
        c_Min = c_Date.getMinutes(),
        c_Sen = c_Date.getSeconds()
      if (bool) {
        // 判断是否需要显示秒
        var c_Time =
          c_Year +
          '-' +
          this.getzf(c_Month) +
          '-' +
          this.getzf(c_Day) +
          ' ' +
          this.getzf(c_Hour) +
          ':' +
          this.getzf(c_Min) +
          ':' +
          this.getzf(c_Sen) //最后拼接时间
      } else {
        var c_Time =
          c_Year +
          '-' +
          this.getzf(c_Month) +
          '-' +
          this.getzf(c_Day) +
          ' ' +
          this.getzf(c_Hour) +
          ':' +
          this.getzf(c_Min) //最后拼接时间
      }
      return c_Time
    },
    getzf(c_num) {
      if (parseInt(c_num) < 10) {
        c_num = '0' + c_num
      }
      return c_num
    },
  },
}
</script>

<style lang="less" scoped>
.outlineInput {
  outline: none;
  background: none;
  border: none;
  height: 26px;
  caret-color: #fff;
  width: 40%;
  color: #fff;
}
.estimate {
  margin-top: 20px;
  color: #7b7d8a;
  span {
    color: #ffe4c4;
  }
}
/deep/ .van-grid-item__content {
  background-color: rgb(22, 21, 34);
}
.item {
  color: #fff;
  font-size: 0.35rem;
  img {
    width: 72px;
    height: 72px;
  }
  aside {
    margin-top: 25px;
    display: flex;
    align-items: center;
    p {
      margin-left: 25px;
      display: flex;
      flex-direction: column;
      span:first-child {
        color: #fdd16a;
      }
    }
  }
}
.section-container {
  font-size: 0.35rem;
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
  }
  .sec-main {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    background-color: rgb(32, 34, 48);
    padding: 25px;
    p {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
      span:last-child {
        font-size: 12px;
        display: flex;
        align-items: center;
        button {
          height: 50px;
          background-color: rgb(32, 34, 48);
          border: 2px solid #999;
          margin-left: 15px;
          color: #fff;
          border-radius: 999px;
          line-height: 50px;
        }
      }
    }
    .zyBtn {
      margin-top: 0.6rem;
      background-color: #2e3346;
      border: none;
      color: #fff;
      font-weight: 700;
    }
  }
  .sec-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-weight: 700;
      font-size: 0.5rem;
    }
    p {
      background-color: #4e3034;
      padding: 20px 25px;
      border-radius: 25px;
    }
    margin-bottom: 1rem;
  }
  .list {
    background: #212133;
    padding: 30px 30px 40px;
    border-radius: 20px;
    margin-bottom: 32px;
    p {
      opacity: 50%;
      color: #fff;
    }
    .listTop {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      p:first-child {
        opacity: 1;
      }
    }
    .listCenter {
      display: flex;
      justify-content: space-around;
      margin-bottom: 30px;
      div {
        width: 50%;
        p:first-child {
          margin-bottom: 10px;
        }
        p:last-child {
          font-size: 40px;
          opacity: 1;
        }
      }
      div:last-child {
        p:last-child {
          color: #fdd16a;
        }
      }
    }
    .buttons {
      display: flex;
      justify-content: space-between;
      .box {
        width: 45%;
      }
    }
  }
}

.zysh {
  display: flex;
  justify-content: center;
  margin: 30px 0;
  padding: 10px 0;
  background-color: #202231;
  border-radius: 20px;
  .btn2 {
    margin-left: -2px;
  }
  /deep/ .van-button::before {
    border-width: 3px !important;
  }
  .van-button {
    width: 4rem;
    height: 90px;
    color: #000;
    line-height: 90px;
    border-radius: 25px;
    border: none;
  }
  .buysell {
    background-color: #161622;
    color: #fff;
  }
  .active-btn {
    background-color: #202231;
    color: #999;
  }
}
.cut {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #202231;
  padding: 30px;
  margin-bottom: 30px;
  border-radius: 20px;
  font-size: 32px;
}

.home {
  display: flex;
  position: relative;
  background-color: rgb(8, 11, 19);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  color: #fff;
  padding: 25px;
  .banner {
    img {
      width: 100%;
      height: 100%;
    }
  }
  .main {
    h6 {
      margin: 12px;
    }
  }
  .nh-ly {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 0.4rem;
    background-color: #73613d;
    padding: 25px;
    border-radius: 15px;
    margin-top: 0.8rem;
    p {
      display: flex;
      justify-content: space-between;
      align-items: center;
      button {
        height: 0.8rem;
        font-weight: 700;
        color: #000;
        background-color: rgb(250, 209, 113);
      }
    }
    p:first-child {
      padding: 20px 0;
    }
  }
  /deep/ .item_tab {
    div {
      background-color: #202231 !important;
      padding: 0.2667rem 0.21333rem;
      border-radius: 15px;
      span {
        color: #fff;
      }
    }
  }
  /deep/ .active {
    div {
      background-color: #fdd16a !important;
      span {
        color: #000;
        font-weight: 700;
      }
    }
  }

  footer {
    font-size: 0.6rem;
    margin-top: 1rem;
    section {
      font-size: 0.35rem;
      color: rgb(107, 114, 128);
    }
  }
}
.record {
  margin-top: 30px;
  border-radius: 20px;
  overflow: hidden;
  /deep/.van-cell {
    background: #202231;
    color: #fff;
  }
}
</style>
