<template>
  <van-popup
    class="popups"
    v-model:show="show"
    :position="props.position"
    :closeable="props.closeable"
    :round="props.round"
    :lock-scroll="props.lock"
    :overlay="props.overlay"
    :close-on-click-overlay="props.close"
    :style="{ height: props.height }"
    @click-close-icon="updateShowPopup"
  >
    <div class="px-36px py-21px text-36px">{{ props.title }}</div>
    <div class="line"></div>
    <slot></slot>
  </van-popup>
</template>

<script setup lang="ts">
interface Props {
  position?: string; //弹出位置
  height?: any; //弹出高度
  closeable?: boolean; //是否显示关闭按钮
  round?: boolean; //是否显示圆角
  close?: boolean; //是否在点击遮罩层后关闭
  lock?: boolean; //是否锁定背景滚动
  overlay?: boolean; //	是否显示遮罩层
  title: string;
  showPopup: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  position: "bottom",
  height: 20 + "%",
  closeable: true,
  round: true,
  close: false,
  title: "标题",
  showPopup: false,
  lock: true,
  overlay: true,
});

const show = ref<boolean>(false);

watch(
  () => props.showPopup,
  (newValue) => {
    show.value = newValue;
  }
);
const emit = defineEmits(["update:showPopup"]);
const updateShowPopup = () => {
  emit("update:showPopup", false);
};
</script>

<style scoped>
.popups {
  overflow: hidden;
}
.line {
  height: 1px;
  background-color: #ddd;
}
</style>
