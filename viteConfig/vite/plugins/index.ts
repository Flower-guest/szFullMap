/**
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 */
import { PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueSetupExtend from "vite-plugin-vue-setup-extend";
import unocss from "unocss/vite";
import defineConfig from "./unocss";
import AutoRegistryComponents from "./components";
import AutoImportDeps from "./autoImport";
import ConfigEslintPlugin from "./eslintPlugin";
import ConfigCompressPlugin from "./compression";
import ConfigImageminPlugin from "./imagemin";

export function createVitePlugins() {
  const vitePlugins: PluginOption[] = [
    // 不用写`ref`语法糖`.value`的方法
    vue({
      reactivityTransform: true,
    }),
    // JSX支持
    vueJsx(),
    // setup语法糖组件名支持
    vueSetupExtend(),
    // unocss配置
    unocss(defineConfig),
  ];

  // 自动按需引入组件
  vitePlugins.push(AutoRegistryComponents());
  // 自动按需引入依赖
  vitePlugins.push(AutoImportDeps());
  // eslint配置
  vitePlugins.push(ConfigEslintPlugin());
  // 开启.gz压缩
  vitePlugins.push(ConfigCompressPlugin());
  // 图片压缩
  vitePlugins.push(ConfigImageminPlugin());

  return vitePlugins;
}
