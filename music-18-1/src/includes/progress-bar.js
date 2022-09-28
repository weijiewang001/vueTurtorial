import Nprogress from "nprogress";

export default (router) => {

  // 在加载网页的时候路由切换发动加载功能
  router.beforeEach( (to, from, next) => {
    Nprogress.start();
    next();
  });
  // 在网页加载完毕之后发动路由加载完全的样式
  router.afterEach(Nprogress.done);
}