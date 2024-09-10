<template>
  <div
    :class="props.info?.cla ?? ''"
    class="flex items-center text-[#888] text-26px"
  >
    <template v-if="!props.info.url">
      <div
        class="flex-1 flex justify-center items-center"
        @click="callPhone(props.info?.mobile ?? '')"
      >
        <img class="w-48px h-48px mr-10px" :src="getAssets('phone@2x.png')" />
        联系TA
      </div>
    </template>
    <template v-else>
      <div
        class="flex-1 flex justify-center items-center"
        @click="toPage('webView', props.info.url, true)"
      >
        <img
          class="w-48px h-48px mr-10px"
          :src="getAssets('icon_reserve.png')"
        />
        去预定
      </div>
    </template>
    <div class="w-1px h-40px bg-slate-200"></div>
    <div class="flex-1 flex justify-center items-center" @click="goThere">
      <img class="w-48px h-48px mr-10px" :src="getAssets('icon-dzq.png')" />
      去这里
    </div>
  </div>

  <AppArouse :go-there-val="goThereVal" v-model:is-show-action="isShowAction" />
  <!-- <AppArouse
    :is-show-action="isShowAction"
    @update:show-action="(newValue) => (isShowAction = newValue)"
  /> -->
</template>

<script setup lang="ts">
import { getAssets, callPhone, toPage } from "@/utils";
interface Props {
  info: any;
}
const props = defineProps<Props>();
const goThereVal = ref<any>(); //点击去这里的item值
const isShowAction = ref(false); //是否显示唤起APP选项Action

// const emit = defineEmits(["goThere"]);
// 去这里
const goThere = () => {
  // emit("goThere")
  isShowAction.value = true;
  goThereVal.value = props.info;
};
</script>

<style></style>
