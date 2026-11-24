# FlowDesk

企业事项协同工作台。首页和录入、核对、列表、详情使用中英文界面，默认中文。演示使用脱敏群聊和本地规则；数据保存在当前浏览器标签页的 sessionStorage 中。

## 本地运行

使用支持 Next.js 16 的 Node.js 环境，在项目根目录执行：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

打开开发服务器显示的地址。可从首页直达 `/intake`、`/review`、`/items`、`/items/sample`。英文路径以 `/en` 开头。

## 配置与验证

- `NEXT_PUBLIC_APP_URL` 用于生成正式站点的 canonical、分享图和站点地图地址。
- `NEXT_PUBLIC_SUPPORT_EMAIL` 可配置真实支持邮箱，配置后会显示页脚联系入口。
- `src/config/flowdesk.ts` 集中控制脚手架入口的可见性。
- `pnpm check:flowdesk` 核对双语资源并回归简写匹配、日期、核对、合并与撤回流程。
- `pnpm build` 执行生产构建。

基于 ShipAny Template Two。许可与原始署名见 [LICENSE](./LICENSE)。
