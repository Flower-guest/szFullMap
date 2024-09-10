<template>
  <van-overlay
    style="z-index: 2999; display: flex; align-items: center"
    :show="show"
  >
    <div class="share" @click.stop>
      <div class="flex justify-end" @click="updateShowShare">
        <img class="w-48px h-48px" :src="getAssets('close2.png')" />
      </div>
      <div class="flex flex-col items-center">
        <img
          class="w-400px h-400px mt-23px mb-36px"
          :src="getAssets('QRcode.png')"
        />
        <div>长按保存二维码或</div>
        <div class="mt-10px mb-60px">
          <span class="text-#E86A5F">点击微信右上角</span>分享给好友
        </div>
        <van-button
          class="w-86% mb-56px"
          round
          color="#029AA7"
          @click="isShowYD = true"
          >我要分享</van-button
        >
      </div>
    </div>
  </van-overlay>
  <Guide
    :content="'转发给朋友'"
    :is-show-guide="isShowYD"
    @update:show-guide="(newValue) => (isShowYD = newValue)"
  />
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";
interface Props {
  showShare: boolean;
}
const props = defineProps<Props>();
const show = ref<boolean>(false);
const isShowYD = ref<boolean>(false); //显示引导页面
watch(
  () => props.showShare,
  (newValue) => {
    show.value = newValue;
  }
);
const emit = defineEmits(["update:showShare"]);
const updateShowShare = () => {
  emit("update:showShare", false);
};
</script>

<style lang="less" scoped>
.share {
  width: 80%;
  background: #ffffff;
  border-radius: 16px;
  margin: 410px auto;
  font-size: 24px;
  color: #888;
  padding: 31px 30px;
}
</style>
