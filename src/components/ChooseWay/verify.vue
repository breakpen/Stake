<template>
  <div>
    <van-nav-bar title="校验" />
    <van-field v-model="value" center clearable placeholder="请输入Token">
      <template #button>
        <van-button @click="jump()" size="small" type="primary">校验Token</van-button>
      </template>
    </van-field>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
    }
  },
  methods: {
    jump() {
      if (this.value.length == 32) {
        localStorage.setItem('Token',this.value)
        this.$router.push({name:'conceal'})
      }
    },
  },
}
</script>

<style>
</style>