export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 尝试请求原始路径
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return response;
      }
    } catch (e) {
      // 404 或出错时回退到 index.html
    }
    
    // SPA fallback: 返回 index.html
    return env.ASSETS.fetch(new URL("/index.html", url.origin));
  }
};
