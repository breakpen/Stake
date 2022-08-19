<template>
  <div class="app">
    <Nav></Nav>
    <div class="contatiner">
      <div class="top">
        <transition-page>
          <router-view></router-view>
        </transition-page>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "@/components/Nav";

import transitionPage from "@/components/transitionPage";

export default {
  name: "homeApp",
  components: {
    Nav,
    transitionPage,
  },

  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.app {
  width: 100vw;
  height: 100vh;
  background-color: rgb(8, 11, 19);
}

.top {
  padding-bottom: 1rem;
  background-color: rgb(8, 11, 19);
}

.footer {
  background-color: rgb(18, 25, 42);
  padding: 30px 0;
  position: fixed;
  padding-top: 1rem;
  bottom: 0;
  left: 0;
  right: 0;
  .footer-p {
    color: #fff;
    font-size: 0.4rem;
    margin-left: 20px;
  }
  .img-icons {
    img {
      margin: 0 20px;
    }
  }
}
</style>
