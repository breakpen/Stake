<template>
  <div>
    <van-calendar
      v-model="showCalendar"
      title=" 请选择查询日期"
      :min-date="minDate"
      :close-on-click-overlay="false"
      @close="close()"
      @confirm="onConfirm"
    />

    <van-nav-bar
      title="批量处理未释放质押"
      left-arrow
      @click-left="$router.back()"
    />
    <van-tabs @change="change()" v-model="active">
      <van-tab title="六个月" class="box">
        <div v-for="(item, index) in nowads" :key="index" class="content">
          <p>{{ item }}</p>
          <p>{{ nownum[index] }}</p>
        </div>
      </van-tab>
      <van-tab title="十二个月" class="box">
        <div v-for="(item, index) in nowads" :key="index" class="content">
          <p>{{ item }}</p>
          <p>{{ nownum[index] }}</p>
        </div>
      </van-tab>
      <van-tab title="二十四个月" class="box">
        <div v-for="(item, index) in nowads" :key="index" class="content">
          <p>{{ item }}</p>
          <p>{{ nownum[index] }}</p>
        </div>
      </van-tab>
    </van-tabs>
    <div class="footer">
      <van-button type="info" @click="pledge" block round>批量质押</van-button>
    </div>
  </div>
</template>

<script>
import { GetAppStake, UpdateStakeOrder } from "@/api/trxRequest";
import { MyRelease } from "@/utils/web3_stake";
export default {
  data() {
    return {
      active: 0,
      value: "",
      showCalendar: true,
      minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),

      nowid: [],
      nowads: [],
      nownum: [],
      sum: 0,
    };
  },
  created() {
    // console.log(localStorage.getItem('Token'))
    // asd()
    // let arr = [1, 2, 3, 5, 6]
    // let arr1 = [1, 3, 6]
    // let arr1 = [
    //   { id: '1', name: 'json' },
    //   { id: '2', name: 'book' },
    // ]
    // let arr2 = [
    //   { id: '1', name: 'json', age: '15' },
    //   { id: '2', name: 'book', age: '16' },
    //   { id: '3', name: 'ani', age: '17' },
    // ]
    // let list = arr2.filter((items) => {
    //   console.log(items)
    //   if (!arr1.some((ele) => items.id == ele.id)) return items
    // })
    // console.log(list)
    //ES6的方法
    // let add = arr2.filter((item) => !arr1.some((ele) => ele.id === item.id))
    // console.log(add)
  },
  methods: {
    change() {
      this.showCalendar = true;
      // this.getapp()
    },
    onConfirm(date) {
      this.showCalendar = false;
      this.value = `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`;
      this.getapp();
    },
    getapp() {
      let month;
      if (this.active == 0) {
        month = 6;
      } else if (this.active == 1) {
        month = 12;
      } else {
        month = 24;
      }
      GetAppStake({ month: month, date: this.value })
        .then((res) => {
          let data = res.data;
          console.log(data);
          let idarray = [],
            adsarray = [],
            numarray = [],
            sum = 0,
            count = 0;

          for (let i of data) {
            sum += i.num * 1;
            // console.log(sum)
            if (i.ads == "") continue;
            if (adsarray[count - 1] == i.ads.trim()) {
              console.log(adsarray.length);
              numarray[count - 1] += i.num * 1;
            } else {
              if (adsarray.length == 17) {
                break;
              }
              adsarray.push(i.ads.trim());
              numarray.push(i.num * 1);
              count++;
            }
            idarray.push(i.id);
          }

          // _adrdata.replace(/'/g, '"');

          // if(adsarray.length>17){
          //   this.$toast.warning('当前日期数据大于50，请重新选择日期')
          //   this.showCalendar=true
          //   return
          // }
          this.nowid = idarray;
          this.nowads = adsarray;
          this.nownum = numarray;
          this.sum = sum.toFixed(6);
          console.log(this.nowid);
          console.log(this.nowads);
          console.log(this.nownum);
        })
        .catch((err) => {
          this.$toast.warning(err);
        });
    },
    close() {
      if (this.value != "") return;
      this.$toast.warning("请选择查询日期！");
      this.showCalendar = true;
    },
    pledge() {
      if (
        localStorage.getItem("Token") == null ||
        localStorage.getItem("Token").length != 32
      ) {
        this.$toast.warning("请获取最新Token！！！");
        return;
      }
      let month;
      if (this.active == 0) {
        month = 6;
      } else if (this.active == 1) {
        month = 12;
      } else {
        month = 24;
      }
      console.log(this.sum);
      let that = this;
      MyRelease(this.sum, month, this, function () {
        that.update(that);
      });
    },
    update(that) {
      that.$toast.warning("调接口中...", {
        timeout: 20000,
      });
      let token = localStorage.getItem("Token");
      that.nowid.splice(0, 0, token);
      UpdateStakeOrder(that.nowid)
        .then((res) => {
          let data = res.data.Code;
          if (data > 0) {
            this.nowid = [];
            this.nowads = [];
            this.nownum = [];
          } else if (data == 0) {
            that.$toast.warning("接口失败了...", {
              timeout: 20000,
            });
          }
          console.log(res);
        })
        .catch((err) => {
          that.$toast.warning(err, {
            timeout: 20000,
          });
          that.$toast.warning(err.message);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  margin-bottom: 116px;
  .content {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
}

.footer {
  width: 80%;
  position: fixed;
  right: 10%;
  bottom: 20px;
}
</style>
