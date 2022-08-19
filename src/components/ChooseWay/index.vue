<template>
  <div class="chooseWay">
    <van-nav-bar title="定期质押" left-arrow @click-left="$router.back()" />
    <section>
      <header>
        <div class="left">
          <p>定期质押活动介绍</p>
          <p>活动时间: 暂未开放</p>
        </div>
        <div class="right">
          <img src="@/assets/boxz.png" alt="" />
        </div>
      </header>
      <main>
        <ul>
          <li>
            1、质押 1000个EOTC
            6个月赠送用户和推荐人各1个，质押时间12个月用户增加1个盲盒、24个月用户增加2个盲盒。
          </li>
          <li>
            2、质押 2000个EOTC 6个月赠送用户和推荐人各3个，质押时间12个月用户增加2个盲盒、24个月用户增加3个盲盒
          </li>
          <li>3、质押 5000个EOTC 6个月赠送用户和推荐人各10个，质押时间12个月用户增加3个盲盒、24个月用户增加4个盲盒</li>
        </ul>
        <p :style="{color:'red',marginTop:'1rem'}">质押 5000EOTC 送10个盲盒无限叠加，送完即止！</p>
      </main>
    </section>

    <div :style="{margin:'4rem 25px'}">
      <van-button round block @click="toNft">
       EOTC NFT
    </van-button>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "ChooseWay-my",
  inject: ["reload"],
  methods:{
    toNft(){
      location.href = 'https://nft.eotc.im'
    }
  }
};
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
main{
  font-size: .4rem;
  padding: 25px;
  li{
    margin-top: 15px;
  }
 
}


 button{
    background-color: #1B2945;
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
</style>
