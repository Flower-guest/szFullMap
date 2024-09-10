<template>
  <div>
    <van-image
      width="100%"
      height="220"
      src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    />
    <div class="main">
      <!-- 莲花山村简介 -->
      <div class="box">
        <div class="flex justify-between items-center mb-16px">
          <span class="text-#353535 text-34px">{{ ruralInfo.name }}</span>
          <img
            @click="goThere"
            class="w-56px h-56px"
            :src="getAssets('icon-dzq1.png')"
          />
        </div>
        <div class="text-#888 flex items-center">
          <img
            class="w-26px h-30px mr-8px"
            :src="getAssets('icon-location.png')"
          />
          {{ ruralInfo.address }}
        </div>
        <div class="mt-26px mb-22px" :class="{ ellipsis4: !isLaunch.info }">
          {{ ruralInfo.description }}
        </div>
        <div class="flex justify-end">
          <div class="zk-btn" @click="isLaunch.info = !isLaunch.info">
            {{ isLaunch.info ? "收起" : "展开" }}
            <img
              class="w-20px h-11px"
              :src="getAssets(isLaunch.info ? 'icon-sh1.png' : 'icon-xh1.png')"
            />
          </div>
        </div>
      </div>
      <!-- 主要领导 -->
      <van-tabs
        class="tabs"
        v-model:active="active"
        title-inactive-color="#999"
        title-active-color="#353535"
        :line-width="40"
      >
        <van-tab title="主要领导">
          <div class="box overflow-x-auto flex">
            <div
              :class="[
                'leader-list',
                { 'max-h-50 overflow-hidden': !i.isLaunch },
              ]"
              v-for="i in tab?.leader"
              :key="i.img"
            >
              <div class="flex items-center">
                <van-image
                  class="w-108px h-108px mr-28px rounded-50% overflow-hidden"
                  :src="i.img"
                />
                <div class="flex flex-col justify-center text-#353535">
                  <span class="text-26px">{{ i.name }}</span>
                  <span class="text-#B5B5B5 text-24px">{{ i.position }}</span>
                </div>
              </div>
              <div
                class="text-28px text-#6D6D6D mt-26px mb-22px"
                :class="{ ellipsis2: !i.isLaunch }"
              >
                {{ i.info }}
              </div>
              <div class="flex justify-end">
                <div class="zk-btn" @click="i.isLaunch = !i.isLaunch">
                  {{ i.isLaunch ? "收起" : "展开" }}
                  <img
                    class="w-20px h-11px"
                    :src="
                      getAssets(i.isLaunch ? 'icon-sh1.png' : 'icon-xh1.png')
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="村规民约">
          <div class="box">{{ tab?.rules }}</div></van-tab
        >
        <van-tab :title="null" />
        <van-tab :title="null" />
      </van-tabs>
      <!-- 太平镇故事 -->
      <div class="box">
        <div class="text-center mb-40px text-32px text-#353535 w-170px">
          <span class="z-2">太平镇故事</span>
          <div class="w-100% h-16px bg-#C5E7E8 rounded-8px mt-[-22px]"></div>
        </div>
        <video controls class="w-690px h-400px">
          <source :src="getSeverImg(ruralInfo.story_video)" type="video/webm" />
          <source :src="getSeverImg(ruralInfo.story_video)" type="video/mp4" />
        </video>
        <div class="mt-28px mb-22px" :class="{ ellipsis4: !isLaunch.special }">
          {{ ruralInfo.story }}
        </div>
        <div class="flex justify-end">
          <div class="zk-btn" @click="isLaunch.special = !isLaunch.special">
            {{ isLaunch.special ? "收起" : "展开" }}
            <img
              class="w-20px h-11px"
              :src="
                getAssets(isLaunch.special ? 'icon-sh1.png' : 'icon-xh1.png')
              "
            />
          </div>
        </div>
      </div>
      <!-- 特色产业 -->
      <div class="box" style="margin-bottom: 0">
        <div class="text-center mb-40px text-32px text-#353535 w-148px">
          <span class="z-2">特色产业</span>
          <div class="w-100% h-16px bg-#C5E7E8 rounded-8px mt-[-22px]"></div>
        </div>
        <van-swipe class="swipe" :loop="false" :width="310">
          <van-swipe-item v-for="i in ruralInfo.images" :key="i"
            ><van-image width="302" height="200" :src="getSeverImg(i)"
          /></van-swipe-item>
        </van-swipe>
      </div>
    </div>
  </div>
  <AppArouse :go-there-val="goThereVal" v-model:is-show-action="isShowAction" />
</template>

<script setup lang="ts">
import { getLeader } from "@/service/map";
import { getAssets, getSeverImg } from "@/utils";
import localCache from "@/utils/Cache";

const isLaunch = reactive<any>({
  special: false, //特色产业展开按钮
  info: false, //详情信息展开按钮
});
const active = ref(0);
const tab = ref<any>();
const ruralInfo = ref<any>();
const isShowAction = ref(false); //是否显示唤起APP选项Action
const goThereVal = ref<any>(); //点击去这里的item值

const init = async () => {
  ruralInfo.value = localCache.getCache("ruralInfo");
  tab.value = await getLeader();
};

// 去这里
const goThere = () => {
  isShowAction.value = true;
  goThereVal.value = {
    name: ruralInfo.value.name,
    latitude: JSON.parse(ruralInfo.value.mapCenter)[0],
    longitude: JSON.parse(ruralInfo.value.mapCenter)[1],
  };
};
init();
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  position: absolute;
  margin-top: -50px;
  left: 0;
  z-index: 1;
  border-radius: 20px 20px 0px 0px;
  background-color: #f4f4f4;
  overflow: hidden;
  .box {
    background-color: #fff;
    padding: 28px 30px;
    margin-bottom: 20px;
    color: #6d6d6d;
    font-size: 28px;

    .leader-list {
      width: 546px;
      box-sizing: border-box;
      background: #ffffff;
      box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.16);
      border-radius: 20px;
      margin-right: 24px;
      flex-shrink: 0;
      padding: 40px 21px 32px 28px;
    }

    .zk-btn {
      background-color: #e5fcf7;
      padding: 9px 22px;
      color: #626b6a;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120px;
      box-sizing: border-box;
      border-radius: 24px;
      img {
        margin-left: 8px;
      }
    }

    .ellipsis2 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box; //作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
      -webkit-line-clamp: 2; //显示的行
    }

    .ellipsis4 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box; //作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
      -webkit-line-clamp: 4; //显示的行
    }
  }

  ::v-deep(.swipe) {
    .van-swipe-item {
      .van-image {
        overflow: hidden;
        border-radius: 20px;
      }
    }
  }
}
</style>
