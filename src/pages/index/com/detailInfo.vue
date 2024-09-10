<template>
  <van-popup
    :show="showInfo"
    closeable
    close-icon="close"
    round
    position="bottom"
    class="min-h-max"
    @click-overlay="updateShowInfo"
    @click-close-icon="updateShowInfo"
  >
    <div class="py-20px px-30px box-border">
      <InfoList
        :info="{ ...detailInfo, h: 'h-181px', imgH: '100px' }"
        @to-detail="(val) => toPage('detail', val.id)"
      />
      <ContactButton :info="{ ...detailInfo, cla: 'mt-34px' }" />
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import InfoList from "./infoList.vue";
import { toPage } from "@/utils";
import { getMarkerInfo } from "@/service/map";

interface detailProps {
  showInfo: boolean;
  detailInfo: any;
}

const props = defineProps<detailProps>();
const detailInfo = ref<any>();

watch(
  () => props.detailInfo,
  (newValue) => {
    initInfo(newValue.id);
  }
);

const initInfo = async (id) => {
  const res: any = await getMarkerInfo(id);
  detailInfo.value = res;
};

// 关闭popup
const emit = defineEmits(["update:showInfo"]);
const updateShowInfo = () => emit("update:showInfo", false);
</script>

<style scoped>
.lookVR::before {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  background: #29accc;
  z-index: -1;
  opacity: 0.8;
}
</style>
