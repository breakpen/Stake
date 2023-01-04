<template>
  <div>
    <van-nav-bar
      :title="title"
      :border="false"
      fixed
      placeholder
      left-arrow
      @click-left="$router.back()"
    />
    <div class="content">
      <div class="top">
        <div class="frist">
          <p>累计收益</p>
          <p>+{{allsy}}</p>
        </div>
        <div class="second">
          <div>
            <p>当前质押</p>
            <p>{{allzy}}</p>
          </div>
          <div>
            <p>待赎回</p>
            <p>{{allsh}}</p>
          </div>
        </div>
      </div>
      <van-tabs title-active-color="#fff" background="#161622" @click="cut()" v-model="active">
        <van-tab title="一期质押">
          <div class="center">
            <div class="empty" v-if="list.length==0">
              <img src="@/static/icon/kong.png" alt />
              <p>暂无数据</p>
            </div>
            <div class="orderList" v-for="(item,index) in list" :key="index">
              <div class="listTop">
                <p v-if="item.state==4">订单编号: {{item.id}}</p>
                <p v-else>质押编号: {{item.id}}</p>
                <div class="topFlex">
                  <p>{{item.date}}</p>
                  <p v-if="item.state==1">质押到期:{{item.time}}</p>
                </div>
              </div>
              <div class="listCenter">
                <div>
                  <p>质押数量</p>
                  <p>{{item.amount}}</p>
                </div>
                <div>
                  <p v-if="item.state==3">累计收益</p>
                  <p v-else>预估收益</p>
                  <p>+{{item.reward}}</p>
                </div>
                <div v-if="item.state==1">
                  <p>到期可赎回</p>
                  <p>{{item.zong}}</p>
                </div>
              </div>
              <div
                class="listState"
                :class="item.state==1?'State2':item.state==2?'State3':'State1'"
              >{{item.text}}</div>
            </div>
          </div>
        </van-tab>
        <van-tab title="二期质押">
          <div class="center">
            <div class="empty" v-if="list.length==0">
              <img src="@/static/icon/kong.png" alt />
              <p>暂无数据</p>
            </div>
            <div class="orderList" v-for="(item,index) in list" :key="index">
              <div class="listTop">
                <p v-if="item.state==4">订单编号: {{item.id}}</p>
                <p v-else>质押编号: {{item.id}}</p>
                <div class="topFlex">
                  <p>{{item.date}}</p>
                  <p v-if="item.state==1">质押到期:{{item.time}}</p>
                </div>
              </div>
              <div class="listCenter">
                <div>
                  <p>质押数量</p>
                  <p>{{item.amount}}</p>
                </div>
                <div>
                  <p v-if="item.state==3">累计收益</p>
                  <p v-else>预估收益</p>
                  <p>+{{item.reward}}</p>
                </div>
                <div v-if="item.state==1">
                  <p>到期可赎回</p>
                  <p>{{item.zong}}</p>
                </div>
              </div>
              <div
                class="listState"
                :class="item.state==1?'State2':item.state==2?'State3':'State1'"
              >{{item.text}}</div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { mypledge1, mypledge2 } from '@/utils/web3_stake'
import { MyStakeList } from '@/api/trxRequest'
import { Toast } from 'vant'
export default {
  data() {
    return {
      list: [],
      zq: '',
      title: '',

      //总收益
      allsy: 0,
      //总当前质押
      allzy: 0,
      //总待赎回
      allsh: 0,

      active: '0',
    }
  },
  created() {
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '加载中',
    })
    this.zq = localStorage.getItem('zq')
    if (this.zq == 6) {
      this.title = '质押记录(六个月)'
    } else if (this.zq == 12) {
      this.title = '质押记录(十二个月)'
    } else if (this.zq == 24) {
      this.title = '质押记录(二十四个月)'
    }
    this.init()
  },
  methods: {
    cut() {
      this.allsy=0
      this.allzy=0
      this.allsh=0
      this.init()
    },
    init() {
      if (this.active != 0) {
        mypledge1(this.zq)
          .then((res) => {
            console.log(res)
            let list = this.dispose(res)
            this.list = list.reverse()
            this.StakeList()
          })
          .catch((err) => {
            console.log(err)
            Toast.clear()
          })
      } else {
        mypledge2(this.zq)
          .then((res) => {
            let list = this.dispose(res)
            this.list = list.reverse()
            this.StakeList()
          })
          .catch((err) => {
            console.log(err)
            Toast.clear()
          })
      }
    },
    StakeList() {
      MyStakeList({ zq: this.zq }).then((res) => {
        Toast.clear()
        let data = res.data
        for (let i of data) {
          i.state = 4
          i.text = '上链中'
          i.amount = i.znum
          i.reward = Number((i.amount * localStorage.getItem('yield') * this.zq) / 12).toFixed(2)
        }
        this.list = this.list.concat(data)
        console.log(this.list)
      })
    },

    dispose(res) {
      for (let i of res) {
        //当前时间戳
        let nowDate = localStorage.getItem('now')

        i.date = this.getMyDate(i.startTime + 60 * 60 * 24, false)

        var Newdate = new Date(Date.parse(i.date.replace(/-/g, '/')))
        //正式数据，质押已月为单位
        Newdate = Newdate.setMonth(Newdate.getMonth() + Number(this.zq))

        //测试数据，质押已分为单位
        // Newdate = Newdate.setMinutes(Newdate.getMinutes() + Number(this.zq))

        if (i.isStop == 0) {
          if (Newdate / 1000 > nowDate) {
            i.state = 1
            i.text = '质押中'
            // i.time = ((Newdate / 1000 - nowDate) / (3600 * 24)).toFixed(0)
            i.time = this.getMyDate(Newdate, false)
            i.zong = (i.amount + i.reward).toFixed(2)
            this.allzy = Number(this.allzy * 1 + i.amount).toFixed(2)
          } else {
            i.state = 2
            i.text = '待赎回'
            console.log(this.allsh)
            this.allsh = Number(this.allsh * 1 + i.amount + i.reward).toFixed(2)
            console.log(this.allsh)
          }
        } else {
          i.state = 3
          i.text = '已赎回'
          this.allsy = Number(Number(this.allsy) + i.reward).toFixed(2)
        }
        i.amount = i.amount.toFixed(2)
        i.reward = i.reward.toFixed(2)

        let count = 9 - String(i.id).length
        //订单号补0
        if (count != 0) {
          for (let j = 0; j < count; j++) {
            i.id = '0' + i.id
          }
        }
      }
      return res
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

<style lang='less' scoped>
/deep/.van-nav-bar {
  background-color: #0d0415;
}
/deep/.van-nav-bar__title {
  color: #fff;
  font-weight: 600;
}
/deep/.van-nav-bar .van-icon {
  color: #fff;
}
.content {
  padding: 49px 30px 88px;
  background: #161622;
  font-size: 28px;
  min-height: calc(100vh - 145px);
  .top {
    background: linear-gradient(134deg, #2a86ff 0%, #54dcff 100%);
    border-radius: 20px 20px 20px 20px;
    color: #fff;
    padding: 30px 0 40px;
    margin-bottom: 30px;
    .frist {
      text-align: center;
      p:first-child {
        opacity: 50%;
      }
      p:last-child {
        font-size: 44px;
      }
    }
    .second {
      display: flex;
      justify-content: space-around;
      text-align: center;
      margin-top: 20px;
      div {
        p:first-child {
          opacity: 50%;
        }
        p:last-child {
          font-size: 44px;
        }
      }
    }
  }
  .center {
    margin-top: 20px;
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
    }
    .orderList {
      padding: 30px 30px 40px;
      background: #202231;
      border-radius: 20px;
      position: relative;
      margin-bottom: 30px;
      p {
        opacity: 50%;
        color: #fff;
      }
      .listTop {
        border-bottom: 1px solid #2e3346;
        margin-bottom: 40px;

        p:first-child {
          opacity: 1;
        }

        .topFlex {
          display: flex;
          justify-content: space-between;
          margin: 40px 0 20px;
        }
      }
    }
    .listCenter {
      display: flex;
      justify-content: space-around;
      div {
        width: 50%;
        text-align: center;
        p:first-child {
          margin-bottom: 10px;
        }
        p:last-child {
          font-size: 30px;
          opacity: 1;
        }
      }
      div:nth-child(2) {
        p:last-child {
          color: #fdd16a;
        }
      }
    }
    .listState {
      padding: 12px 30px;
      border-radius: 40px 0 0 40px;
      position: absolute;
      right: 0;
      top: 24px;
    }
    .State1 {
      color: #fff;
      opacity: 50%;
      background: #1a1b27;
    }
    .State2 {
      color: #d5b15f;
      // opacity: 50%;
      background: #363137;
    }
    .State3 {
      color: #237ff8;
      // opacity: 50%;
      background: #213458;
    }
  }
}
</style>