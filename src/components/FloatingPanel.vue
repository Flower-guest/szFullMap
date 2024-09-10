<template>
  <div
    ref="popup"
    class="popup"
    :style="[rootStyle as Record<string, string>]"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <div class="popup-top">
      <img
        class="w-64px h-18px"
        :src="
          getAssets(height == props.maxHeight ? 'icon-xh.png' : 'icon-sh.png')
        "
      />
    </div>
    <div class="w-100% h-1px mb-15px bg-[#ddd]"></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";
interface Props {
  maxHeight?: number;
  firstHeight?: number;
  minHeight?: number;
  isNeedTwo?: boolean; // 是否需要两次滚动
}
const props = withDefaults(defineProps<Props>(), {
  maxHeight: 98,
  firstHeight: 50,
  minHeight: 8,
  isNeedTwo: true,
});

let startY = 0; //touchstart的y坐标
let count = 0; //滑动次数

// const initHeight = props.isNeedTwo ? props.minHeight : props.maxHeight; //是否需要滑动两次如果是初始高度就是最小高度，不需要初始高度就是最大高度
const height = ref<number>(props.minHeight);
const popup = ref<HTMLElement | null>(null);
const popupScrollTop = ref<number>(0); //距离顶部距离
const shouldLock = ref<boolean>(false);

const emit = defineEmits<{
  (e: "change", height: number): void;
  (e: "handleScroll", scrollTop: number): void;
}>();

const rootStyle = computed(() => ({
  height:
    height.value == props.maxHeight ? "calc(100% - 120px)" : height.value + "%",
  overflowY: height.value > 50 ? "auto" : "hidden",
}));

const onTouchStart = (e) => {
  shouldLock.value = true;
  startY = e.touches[0].clientY;
};

const onTouchEnd = (e) => {
  if (popupScrollTop.value !== 0) return; //如果不在弹窗顶部不触发滑动事件
  shouldLock.value = false;
  const moveY = e.changedTouches[0].clientY - startY;
  if (Math.abs(moveY) < 5) return; //如果滑动距离过小 不处理
  if (props.isNeedTwo) {
    if (moveY < 0) {
      //上滑
      if (count == 0) {
        //第一次上滑
        count = 1;
        height.value = props.firstHeight;
      } else {
        count = 2;
        height.value = props.maxHeight;
      }
    } else {
      //下滑
      if (count == 2 && moveY > 20 && moveY < 200) {
        //最高下滑事件
        count = 1;
        height.value = props.firstHeight;
      } else if ((count == 2 && moveY > 200) || (count == 1 && moveY > 5)) {
        //回到初始位置 第二次下滑或者滑动距离超过200
        count = 0;
        height.value = props.minHeight;
      }
    }
  } else {
    height.value = moveY < 0 ? props.maxHeight : props.minHeight;
  }
  startY = 0;
  // lastY = 0; // 重置lastY
  emit("change", height.value);
};

const hideDialog = () => {
  height.value = props.minHeight;
  popupScrollTop.value = 0;
  count = 0;
  emit("change", height.value);
};

const handleScroll = () => {
  popupScrollTop.value =
    popup.value?.scrollTop && popup.value?.scrollTop > 0
      ? popup.value.scrollTop
      : 0;
  emit("handleScroll", popupScrollTop.value);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, true);
});

const BODY_LOCK_CLASS = "overflow-hidden";
const lock = () => {
  document.body.classList.add(BODY_LOCK_CLASS);
};
const unlock = () => {
  document.body.classList.remove(BODY_LOCK_CLASS);
};

watch(shouldLock, (value) => {
  value ? lock() : unlock();
});

defineExpose({ hideDialog });
</script>

<style lang="less" scoped>
.overflow-hidden {
  overflow: hidden !important;
}
.popup {
  overflow: hidden;
  border-radius: 20px 20px 0px 0px;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1003;
  transition: all 0.3s ease-out;
  width: 100vw;
  padding-bottom: 20px;

  &::-webkit-scrollbar {
    display: none; //隐藏滚动条
  }

  // .line {
  //   height: 80px;
  // }
  // .line::before {
  //   content: "";
  //   margin-top: 30px;
  //   position: absolute;
  //   left: 50%;
  //   margin-left: -32px;
  //   width: 64px;
  //   height: 10px;
  //   background: #b5b5b5;
  //   border-radius: 5px 5px 5px 5px;
  // }
  .popup-top {
    width: 64px;
    height: 56px;
    line-height: 56px;
    margin: auto;
  }
}
</style>
