<template>
  <div class="bg-#fff">
    <!-- 顶部分类栏 -->
    <van-tabs
      class="tabs"
      v-model:active="active"
      title-active-color="#029AA7"
      title-inactive-color="#888"
      @click-tab="typeClick"
    >
      <van-tab
        v-for="i in props.markerType"
        :name="i.id"
        :title="i.name"
        :key="i.name"
      />
    </van-tabs>
    <!-- 顶部条件筛选 -->
    <div
      class="flex justify-between items-center border-t-1px border-#ddd px-68px py-18px"
    >
      <div class="flex items-center" v-for="i in filterCond" :key="i.label">
        <span
          @click="condClick(i)"
          class="text-24px"
          :class="[activeCond == i.val ? 'text-#029AA7' : 'text-#888']"
          >{{ i.label }}</span
        >
        <div v-if="i.val == 'je'" class="flex flex-col ml-8px">
          <template v-for="j in i.list" :key="j.val">
            <img
              @click="condClick(j)"
              class="w-20px h-12px mb-4px"
              :src="getAssets(activeJEImg == j.val ? j.imgActive : j.img)"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";

interface TopProps {
  markerType: any;
}
const props = defineProps<TopProps>();

const active = ref(0); //当前点击的分类tab
const activeCond = ref<any>("zh");
const activeJEImg = ref<any>("");
const filterCond = ref<any>([
  {
    label: "综合",
    val: "zh",
  },
  {
    label: "更新时间",
    val: "gxsj",
  },
  {
    label: "金额",
    val: "je",
    list: [
      {
        img: "icon-je-up.png",
        imgActive: "icon-je-up-active.png",
        val: "up",
        fVal: "je",
      },
      {
        img: "icon-je-down.png",
        imgActive: "icon-je-down-active.png",
        val: "down",
        fVal: "je",
      },
    ],
  },
]);

// 将标签页切换事件传给父组件
const emitToDetail = defineEmits(["typeClick"]);
const typeClick = async ({ name }) => {
  const val = props.markerType.filter((i) => i.id == name)[0];
  emitToDetail("typeClick", val);
};

// 条件筛选点击
const condClick = (i) => {
  if (i.val == "je" || i?.fVal) {
    activeCond.value = i?.fVal ?? i.val;
    if (i.val == "je") {
      activeJEImg.value = activeJEImg.value == "up" ? "down" : "up";
    } else {
      activeJEImg.value = i.val;
    }
  } else {
    activeJEImg.value = "";
    activeCond.value = i.val;
  }
};
</script>

<style lang="less" scoped>
// 顶部搜索
.search {
  border-radius: 16px;
  .van-field__left-icon {
    display: flex;
    align-items: center;
  }
}
// tabs标签页
.tabs {
  .van-tab--active {
    font-size: 32px;
  }
  .van-tabs__line {
    background-color: #029aa7;
  }
}
</style>
