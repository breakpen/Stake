<template>
  <div >
    <van-nav-bar title="定期质押" left-arrow @click-left="$router.back()" />
    <section>
      <!-- <header>
        <div class="left">
          <p>定期质押活动介绍</p>
          <p>活动时间: 暂未开放</p>
        </div>
        <div class="right">
          <img src="@/assets/boxz.png" alt />
        </div>
      </header> -->
      <main>
        <p class="title">定期质押盲盒赠送规则</p>
        <ul class="rule">
          <div>
            用户质押1000-1999EOTC赠送推荐人1个盲盒
            <br />用户质押2000-2999EOTC赠送推荐人3个盲盒
            <br />用户质押3000-3999EOTC赠送推荐人4个盲盒
            <br />用户质押4000-4999EOTC赠送推荐人6个盲盒
            <br />用户质押5000EOTC以上赠送推荐人10个盲盒
          </div>
          <div>
            <p>定期质押六个月</p>1000-1999EOTC赠送用户1个盲盒
            <br />2000-2999EOTC赠送用户3个盲盒
            <br />3000-3999EOTC赠送用户4个盲盒
            <br />4000-4999EOTC赠送用户6个盲盒
            <br />5000EOTC赠送用户10个盲盒
            <br />5000EOTC以上每质押多500EOTC则加送用户1个盲盒
          </div>
          <div>
            <p>定期质押十二个月</p>1000-1999EOTC赠送用户2个盲盒
            <br />2000-2999EOTC赠送用户5个盲盒
            <br />3000-3999EOTC赠送用户7个盲盒
            <br />4000-4999EOTC赠送用户10个盲盒
            <br />5000EOTC赠送用户13个盲盒
            <br />5000EOTC以上每质押多400EOTC则加送用户1个盲盒
          </div>
          <div>
            <p>定期质押二十四个月</p>1000-1999EOTC赠送用户3个盲盒
            <br />2000-2999EOTC赠送用户6个盲盒
            <br />3000-3999EOTC赠送用户9个盲盒
            <br />4000-4999EOTC赠送用户12个盲盒
            <br />5000EOTC赠送用户14个盲盒
            <br />5000EOTC以上每质押多300EOTC则加送用户1个盲盒
          </div>
        </ul>
      </main>
    </section>

    <div :style="{margin:'1rem 25px'}">
      <van-button round block @click="toNft">EOTC NFT</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChooseWay-my',
  inject: ['reload'],
  methods: {
    toNft() {
      location.href = 'https://nft.eotc.im'
    },
  },
}
</script>

<style lang="less" scoped>
.chooseWay {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 999;
  min-height: 100vh;
}

header {
  display: flex;
  align-items: center;
  padding: 30px;
  img {
    width: 150px;
    height: 150px;
  }
}
main {
  font-size: 0.4rem;
  padding: 25px;
  li {
    margin-top: 15px;
  }
}

button {
  background-color: #1b2945;
  color: #fff;
}
.left {
  font-size: 0.4rem;
  width: 70vw;
  p:first-child {
    font-weight: 700;
  }
  p {
    padding: 10px 0;
  }
}
.title{
  font-size: 40px;
  font-weight: bolder;
  margin: 20px 0;
}
.rule {
  div {
    margin-bottom: 20px;
    line-height: 44px;
  }
}
</style>
