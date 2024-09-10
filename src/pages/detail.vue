<template>
  <div>
    <!-- 顶部 -->
    <div class="top">
      <img
        @click="backPage"
        class="back w-56px h-56px"
        :src="getAssets('webview_back.png')"
      />
      <div v-if="tabs == 0 && info?.vrimage">
        <van-image
          class="w-full h-400px"
          :src="getSeverImg(info?.thumb)"
          lazy-load
        />
        <van-image
          class="look_vr w-100px h-100px"
          @click="toPage('webView', info.vrimage, true)"
          :src="getAssets('icon-vr.png')"
          lazy-load
        />
      </div>
      <van-swipe v-else class="h-400px">
        <template v-for="i in info?.pics" :key="i">
          <van-swipe-item>
            <van-image
              class="w-full"
              height="100%"
              fit="cover"
              :src="getSeverImg(i)"
              lazy-load
            />
          </van-swipe-item>
        </template>
        <template #indicator="{ active, total }">
          <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
        </template>
      </van-swipe>
      <div class="btn">
        <span
          v-if="info?.vrimage"
          @click.stop="() => (tabs = 0)"
          :class="{ 'bg-#29ACCC rounded-22px': tabs == 0 }"
          class="px-18px py-8px"
          >全景</span
        >
        <span
          @click.stop="() => (tabs = 1)"
          :class="{ 'bg-#29ACCC rounded-22px': tabs == 1 }"
          class="px-18px py-8px"
          >图片</span
        >
      </div>
    </div>
    <!-- 内容部分 -->
    <div class="main">
      <div class="main-info">
        <div class="mb-19px flex items-start justify-between">
          <div class="flex flex-col flex-1">
            <div class="text-36px mb-8px">{{ info?.name }}</div>
            <div v-if="tag.length > 0">
              <span
                v-for="i in tag"
                :key="i"
                class="text-22px text-[#029AA7] bg-[#DDF6F8] px-8px py-4px mr-8px"
                >{{ i }}</span
              >
            </div>
          </div>
          <div
            class="text-24px text-[#029AA7] flex justify-end items-center"
            @click="showShare = true"
          >
            <img
              class="w-48px h-48px"
              :src="getAssets('icon-share.png')"
            />点击分享
          </div>
        </div>
        <div class="w-full h-1px bg-[#DDD] mb-12px"></div>
        <div class="text-28px text-[#30F230] mb-12px">
          ￥<span class="text-40px">{{ info?.price }}</span
          >/晚
        </div>
        <van-text-ellipsis
          class="text-24px text-[#888]"
          :content="info?.lcposition"
        />
      </div>
      <div class="w-full h-1px bg-[#DDD] mb-32px"></div>
      <div class="flex items-center">
        <div class="bg-#29ACCC rounded-4 w-8px h-32px"></div>
        <span class="text-32px font-medium ml-5px">简介描述</span>
      </div>
      <div class="mt-28px pb-150px" v-html="info?.body"></div>
      <ContactButton
        :info="{...info,cla:'w-100% z-1 bg-[#fff] fixed bottom-0 left-0 py-38px'}"
      />
    </div>
  </div>
  <!-- <AppArouse
    :go-there-val="goThereVal"
    v-model:is-show-action="isShowAction"
  /> -->
  <Share v-model:show-share="showShare" />
</template>

<script setup lang="ts">
import { getAssets, getSeverImg, toPage, backPage } from "@/utils";
import { getMarkerInfo } from "@/service/map";

const route = useRoute();
const params = route.params;
// const goThereVal = ref<any>(); //点击去这里的item值
// const isShowAction = ref(false); //是否显示唤起APP选项Action
const showShare = ref<boolean>(false); //是否显示分享页面
const tabs = ref<number>();
const info = ref<any>();

const init = async () => {
  const res: any = await getMarkerInfo(params.id);
  res.body = res.body ? res.body : "暂无描述";
  info.value = res;
  tabs.value = res?.vrimage ? 0 : 1;
};

// tag标签
const tag = computed(() => {
  return info.value?.tag ? JSON.parse(info.value.tag) : [];
});

init();
</script>

<style lang="less" scoped>
.top {
  position: relative;
  height: 400px;
  width: 100%;

  .back {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 1;
  }

  .custom-indicator {
    position: absolute;
    right: 30px;
    bottom: 23px;
    padding: 6px 9px;
    font-size: 12px;
    background: #233c4d;
    border-radius: 8px 8px 8px 8px;
    opacity: 0.8;
    color: #fff;
    font-size: 26px;
    font-weight: 500;
  }

  .look_vr {
    position: absolute;
    top: 108px;
    left: 50%;
    transform: translate(-50%, 0%);
  }

  .btn {
    position: absolute;
    left: 50%;
    bottom: 22px;
    transform: translate(-50%, 0%);
    opacity: 0.8;
    background: #234a4d;
    font-size: 22px;
    border-radius: 22px;
    color: #fff;
    overflow: hidden;
  }
}

.main {
  position: absolute;
  top: 394px;
  left: 0;
  padding: 20px 30px;
  background: #fff;
  border-radius: 10px 10px 0px 0px;
  width: 100%;
  box-sizing: border-box;
  .main-info {
    display: flex;
    flex-direction: column;
    // align-items: center;
    // justify-content: space-between;
    margin-bottom: 20px;
  }
  // .describe {
  //   height: calc(100vh - 860px);
  //   overflow: hidden;
  //   overflow-y: auto;
  //   margin-top: 28px;
  // }
}
</style>
