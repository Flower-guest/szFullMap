<template>
  <van-action-sheet
    v-model:show="show"
    :actions="actions"
    @select="onSelect"
    @click-overlay="updateShowAction()"
  />
  <Guide
    :content="'在默认浏览器中打开'"
    :is-show-guide="isShowYD"
    @update:show-guide="(newValue) => (isShowYD = newValue)"
  />
</template>

<script setup lang="ts">
import Scheme from "@/utils/Scheme"; //url scheme打开APP方法
import { actios } from "@/pages/index/config/constants";
interface Props {
  goThereVal: any;
  isShowAction: boolean;
}
const props = defineProps<Props>();
const thereVal = ref();
const show = ref(); //显示导航软件
const isShowYD = ref<boolean>(false); //显示引导页面
const isAndroid =
  navigator.userAgent.indexOf("Android") > -1 ||
  navigator.userAgent.indexOf("Adr") > -1;
const actions = ref<any>(
  isAndroid ? actios : [...actios, { name: "Apple地图", value: "Apple" }]
);
watch(
  () => [props.goThereVal, props.isShowAction],
  (newValue) => {
    thereVal.value = newValue[0];
    show.value = newValue[1];
  }
);

const emit = defineEmits(["update:showAction"]);
const updateShowAction = () => {
  emit("update:showAction", false);
};

// action选择事件
const onSelect = (item) => {
  updateShowAction();
  show.value = false;
  const ua = navigator.userAgent.toLowerCase();
  const isWeixin = ua.indexOf("micromessenger") != -1;
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (isWeixin) {
    isShowYD.value = true;
  } else {
    getMapScheme(thereVal.value, item.value);
  }
};
// 获取地图scheme， 经纬度坐标类型要求为gcj02不然位置会有偏差from 从哪里
const getMapScheme = (to, mapType) => {
  const scheme = new Scheme(to, mapType);
  scheme.getMapScheme();
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
