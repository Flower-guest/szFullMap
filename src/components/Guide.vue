<template>
  <van-overlay style="z-index: 3000" :show="show">
    <div class="yd">
      <img class="w-51px h-68px mr-24px mb-4px" src="../assets/img/hand.png" />
      <div class="main">
        <span class="text-[26px] text-white mr-20px"
          >点击右上角「···」选择{{ props.content }}</span
        >
        <img
          @click="updateShowGuide"
          class="w-26px h-26px"
          src="../assets/img/close1.png"
        />
      </div>
    </div>
  </van-overlay>
</template>

<script setup lang="ts">
interface Props {
  isShowGuide: any;
  content: string;
}
const props = defineProps<Props>();
const show = ref<boolean>(false);

watch(
  () => props.isShowGuide,
  (newValue) => {
    show.value = newValue;
  }
);

const emit = defineEmits(["update:showGuide"]);
const updateShowGuide = () => {
  emit("update:showGuide", false);
};
</script>

<style scoped>
.yd {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 2000;
  padding-right: 10%;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  .main {
    background: url("../assets/img/hand-bg.png") no-repeat;
    background-size: 100% 100%;
    height: 104px;
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
