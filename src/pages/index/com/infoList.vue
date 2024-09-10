<template>
  <div
    class="flex w-100%"
    :class="[props.info?.h ? props.info.h : '']"
    @click="goDetail()"
  >
    <div class="relative rounded-4px overflow-hidden">
      <div
        :class="[state ? 'bg-#029AA7' : 'bg-#888']"
        class="absolute left-0 top-0 z-1 w-100px py-4px text-center text-#fff text-24px rounded-tl-4px rounded-br-4px"
      >
        {{ state ? "营业中" : "歇业中" }}
      </div>
      <van-image
        class="w-228px"
        :height="props.info.imgH"
        fit="cover"
        :src="getSeverImg(props.info?.thumb) ?? getAssets('editSrc.png')"
        lazy-load
      />
      <img
        v-if="props.info?.vrimage"
        @click.stop="toPage('webView', props.info.vrimage, true)"
        class="absolute right-12px bottom-12px z-1 w-40px h-40px"
        :src="getAssets('icon-vr.png')"
      />
    </div>
    <div class="flex-1 flex flex-col justify-between ml-20px text-24px">
      <div class="text-38px">{{ props.info?.name ?? "" }}</div>
      <div>
        <template v-if="tag.length > 0">
          <span
            v-for="i in tag.slice(0, 3)"
            :key="i"
            class="text-[#029AA7] bg-[#DDF6F8] px-8px py-4px mr-8px"
            >{{ i }}</span
          >
        </template>
        <!-- 用来布局占位 -->
        <template v-else
          ><span
            class="invisible text-[#029AA7] bg-[#DDF6F8] px-8px py-4px mr-8px"
            >问问</span
          ></template
        >
      </div>
      <div class="text-20px mt-9px mb-5px text-[#30F230]">
        ￥<span class="text-26px">{{ props.info?.price ?? "600" }}</span
        >/晚
      </div>
      <div class="text-[#888]">
        {{ props.info?.lcposition ?? "" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssets, getSeverImg, toPage } from "@/utils"; //静态图片加载
interface Props {
  info: any;
}
const props = defineProps<Props>();

// 营业状态
const state = computed(() => {
  return props.info?.businessStatus && props.info.businessStatus == "1"
    ? false
    : true;
});

// tag标签
const tag = computed(() => {
  return props.info?.tag ? JSON.parse(props.info.tag) : [];
});

const emit = defineEmits(["toDetail"]);
// 热门推荐点击 ||  分类item点击跳转详情
const goDetail = () => {
  emit("toDetail", props.info);
};
</script>

<style scoped></style>
