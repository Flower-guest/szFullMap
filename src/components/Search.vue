<template>
  <div>
    <!-- 顶部搜索功能 -->
    <van-search
      class="search"
      v-model="searchVal"
      placeholder="请输入搜索关键词"
      @search="search"
      @update:model-value="search"
      @focus="focus"
    >
      <template #left-icon>
        <img class="w-48px h-48px" :src="getAssets('icon-search.png')" />
      </template>
      <template #right-icon>
        <div v-show="showRIcon" class="text-#029AA7 text-30px" @click="clear">
          取消
        </div>
      </template>
    </van-search>
  </div>
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";

const searchVal = ref<any>();
const showRIcon = ref<boolean>(false);
const emit = defineEmits(["search", "focus", "clear"]);
// 回车与输入值变化事件
const search = () => emit("search", searchVal.value);
// 获取焦点
const focus = () => {
  showRIcon.value = true;
  emit("focus");
};
// 点击取消和关闭icon事件
const clear = () => {
  searchVal.value = null;
  emit("clear");
};
</script>

<style lang="less" scoped>
// 顶部搜索
.search {
  .van-field__left-icon {
    display: flex;
    align-items: center;
  }
}

:deep(.van-search__content) {
  border-radius: 16px !important;
}
</style>
