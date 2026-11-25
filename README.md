# SANSPHASE V3 前端

無相主站的中文版和英文版前端。主站继续提供文章、账号、会员、媒体和管理服务。香港社区由现有服务承接。

## 本地运行

使用 Node.js 24.22.3 或兼容的较新 Node.js 24 版本。克隆仓库后，在仓库根目录执行以下命令。

```sh
npm ci
npm test
npm run build
npm start -- --hostname localhost --port 4308
```

浏览器打开 `http://localhost:4308` 查看中文首页，英文入口为 `/en`。本地预览请沿用命令和访问地址里的 `localhost`。开发时可运行 `npm run dev -- --hostname localhost --port 4308`。

这个仓库已包含独立运行所需的共享模块。单独启动时使用演示内容。真实登录、VIP、媒体权限与管理功能由主站后端通过同域接口提供。只运行这里的源码不会连接正式账号或数据库。

`npm test` 运行随源码提供的独立用例。依赖主站测试工具的浏览器联调用例保留在主站工程。

## 源码结构

- `src/app/[locale]` 存放 V3 页面和语言布局。
- `src/components/three` 提供首页粒子展示。
- `src/lib` 包含现有主站接口的适配、地址兼容和预览数据加载。
- `src/messages` 包含中英文界面文本。
- `content/sansphase-blog` 提供可独立浏览的演示文章。

V3 使用 Next.js、React、TypeScript、Tailwind CSS、next-intl、Three.js、Motion 和 Lenis。依赖版本以 `package-lock.json` 为准。

## 版权

前端结构包含 Dingxin Tao 的 MIT 授权代码，保留原版权和许可证。上游版本与适配范围见 [SOURCE.json](SOURCE.json) 和 [LICENSE](LICENSE)。
