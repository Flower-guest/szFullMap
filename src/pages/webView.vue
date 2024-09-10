<template>
  <div class="wrap">
    <div class="flex items-center text-[#29ACCC] p-8px" @click="backPage">
      <img
        class="w-56px h-56px mr-5px"
        :src="getAssets('webview_back.png')"
      />返回
    </div>
    <iframe
      class="inlineFrameExample"
      allowfullscreen="true"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      :src="iframeSrc"
    >
    </iframe>
  </div>
</template>

<script setup lang="ts">
import { getAssets, backPage } from "@/utils";
const route = useRoute();
const params = route.params;
const iframeSrc = window.decodeURIComponent(
  window.atob(params.jumpUrl as string)
);
</script>

<style lang="less" scoped>
.wrap {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  // overflow-y: auto;

  .inlineFrameExample {
    width: 100vw;
    height: calc(100vh - 60px);
    padding: 0;
    margin: 0;
    border: none;
  }
}
</style>
