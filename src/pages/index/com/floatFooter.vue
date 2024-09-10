<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-10-12 09:47:54
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-04-09 11:00:11
 * @FilePath: \szFullMap\src\pages\index\com\floatFooter copy.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- <div class="absolute"> -->
  <FloatingPanel
    :min-height="20"
    :max-height="79"
    :is-need-two="false"
  >
    <div class="px-28px">
      <!-- 列表 -->
      <div class="container bg-#fff rounded-10px" v-if="markerData?.length > 0">
        <div v-for="i in markerData" :key="i.id">
          <InfoList
            :info="{ ...i, h: 'h-172px', imgH: '100%' }"
            @to-detail="goDetail"
          />
          <div class="my-20px h-2px w-full bg-[#ddd]"></div>
        </div>
        <van-back-top
          target=".popup"
          right="40px"
          bottom="128px"
          z-index="2002"
          style="background-color: transparent"
        >
          <template #default>
            <img class="w-84px h-84px" :src="getAssets('back-top.png')"
          /></template>
        </van-back-top>
      </div>
      <div v-else class="text-center text-[#ddd]">暂无数据</div>
    </div>
  </FloatingPanel>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";
import InfoList from "./infoList.vue";
interface ClassifyProps {
  markerData: any;
}
const props = defineProps<ClassifyProps>();

const markerData = ref<any>();
watch(
  () => props.markerData,
  (newValue) => {
    markerData.value = newValue;
  }
);

const emitToDetail = defineEmits(["toDetail"]);
// 热门推荐点击 ||  分类item点击跳转详情
const goDetail = (item: any) => {
  emitToDetail("toDetail", item);
};
</script>

<style lang="less" scoped>
:deep(.van-search__content) {
  background-color: #fff !important;
}
</style>
