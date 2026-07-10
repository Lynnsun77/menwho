# 统一交易用户画像 · 集市门户 Demo

基于飞书 PRD《统一交易用户画像 — 数据对接安全规范与权限管理》搭建的可运行前端 Demo。覆盖 **消费方 / 供给方 Owner / 平台合规** 三视角，串起「标签发现 → 权限申请 → 审批路由 → ACL 授权 → 调用审计 → 使用回写 → 治理运营」的完整闭环。

- 源文档：https://bytedance.larkoffice.com/docx/PoiodHcsIoxSwNxqkgQch34Bn1g

## 技术栈

- Vue 3 (Composition API + `<script setup>`) + Vite 5
- Element Plus 2.8 + `@element-plus/icons-vue`
- Pinia 状态管理
- Vue Router 4（hash 模式）
- ECharts 5（`vue-echarts` + 按需引入）

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
# 默认地址 http://localhost:5173

# 3. 生产构建
npm run build

# 4. 预览构建产物
npm run preview
```

> 无需后端服务，全部业务数据由 `src/mock/` 提供，可直接跑通全部页面。

## 目录结构

```
menhu/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.js                  # 应用入口（挂载 Pinia / Router / ElementPlus / 图标）
    ├── App.vue                  # 根组件（仅承载 router-view）
    ├── router/index.js          # 路由（含 consumer / owner / admin 分组）
    ├── store/
    │   ├── app.js               # 当前角色、用户、侧边栏折叠
    │   └── tag.js               # 标签、申请单、申请提交与最高分级路由
    ├── mock/
    │   ├── constants.js         # 统一四档、来源域、权限状态、场景等枚举
    │   └── data.js              # 标签 / 申请 / 审计 / 异常 / 无主 / 推荐 / KPI 数据
    ├── styles/global.css        # Design tokens + 通用样式（卡片/徽章/状态点/响应式）
    ├── layouts/MainLayout.vue   # 侧边栏（三分组菜单）+ 顶栏（面包屑/搜索/角色/通知）
    ├── components/
    │   ├── LevelTag.vue         # 统一四档分级徽章
    │   ├── PermissionStatus.vue # 权限状态点
    │   ├── EChart.vue           # ECharts 按需封装
    │   └── ApplyDialog.vue      # 通用申请弹窗（含最高分级计算与提交）
    └── views/
        ├── Dashboard.vue        # 工作台首页
        ├── consumer/            # 消费方视角
        │   ├── TagMarket.vue
        │   ├── TagDetail.vue
        │   ├── Recommend.vue
        │   ├── MyPermissions.vue
        │   └── MyApplications.vue
        ├── owner/               # 供给方 Owner 视角
        │   ├── OwnerPending.vue
        │   ├── OwnerMyTags.vue
        │   ├── OwnerUsage.vue
        │   ├── OwnerRisk.vue
        │   └── OwnerOnboard.vue
        └── admin/               # 平台 / 合规视角
            ├── AdminOverview.vue
            ├── AdminOrphan.vue
            ├── AdminAnomaly.vue
            ├── AdminAudit.vue
            └── AdminReport.vue
```

## 页面索引

### 首页
| 路由 | 说明 |
|-|-|
| `/dashboard` | 工作台 Hero + KPI + 4 张图表 + 三视角快捷入口 |

### 消费方视角
| 路由 | 说明 |
|-|-|
| `/market` | 标签广场：来源域/分级/场景/权限状态多维筛选、卡片与表格视图切换、批量申请 |
| `/market/:id` | 标签详情：基础/约束/趋势/相关 4 个 Tab，含申请、续期、催办 |
| `/recommend` | 智能推荐：业务目标 → 标签组合，展示预计审批路径与替代方案 drawer |
| `/my-permissions` | 我的权限：已授权 / 即将到期 / 审批中 / 被拒 / 冻结 Tab |
| `/my-applications` | 我的申请：申请单列表 + 时间线 drawer |

### 供给方 Owner 视角
| 路由 | 说明 |
|-|-|
| `/owner/pending` | 待审批：通过 / 拒绝弹窗 |
| `/owner/my-tags` | 名下标签：状态、分级、覆盖率、调用量、授权数量 |
| `/owner/usage` | 使用回写：趋势 / 团队 / 场景 / 效果 |
| `/owner/risk` | 风险提醒：高频调用 / 跨场景 / 即将到期 / 无主 |
| `/owner/onboard` | 4 步接入向导：元信息 → 分级 → 审批入口 → 质量确认 |

### 平台 / 合规视角
| 路由 | 说明 |
|-|-|
| `/admin/overview` | 全域接入总览：KPI + 来源域接入图 + 分级饼图 + 高敏清单 |
| `/admin/orphan` | 无主标签治理：认领弹窗 + 冻结 |
| `/admin/anomaly` | 异常事件：KPI 卡片 + 严重度/类型筛选 |
| `/admin/audit` | 审计日志：who/when/what/where/why/result + 多维筛选 + 分页 |
| `/admin/report` | 合规报表：权限周报 / 事件日报 / 审计月报 / Owner 影响力（4 Tab） |

## 核心业务模型

- **统一四档消费管控**：开放 / 通用 / 受控 / 高敏，颜色与徽章统一由 `LevelTag` 呈现。
- **组合就高原则**：`store/tag.js` 内 `applyForTags` 按 `levelOrder` 计算组合中的最高分级，并据此路由至 `granted / pending` 状态（通用级自助通过、受控级 Owner 审批、高敏级源头合规审批）。
- **8 大来源域**：电商 DMP、生服 LDMP、广告、AI 用户画像、序列、LLM 理解标签、小端、外采。
- **Owner 机制**：`owner` / `owner_team` 双兜底，无主标签在 `AdminOrphan` 触发认领与冻结。
- **ACL & 审计**：申请通过后写入 `permissions`，审计日志覆盖 who / when / what / where / why / result，可在 `AdminAudit` 中检索。

## 响应式与设计规范

- 采用 CSS 变量作为 Design Tokens（`src/styles/global.css`）。
- 通用类：`.section-card` / `.kpi-card` / `.level-tag-*` / `.status-dot`。
- 布局：≥1440px 宽屏三栏、1024–1440 双栏、<1024 单列，侧边栏可折叠。

## 常见问题

- **端口冲突**：修改 `vite.config.js` 中的 `server.port`。
- **图表白屏**：确认 ECharts 组件已通过 `vue-echarts` 的 `use()` 注册（`components/EChart.vue`）。
- **数据重置**：刷新页面即可（全部 mock 状态存于 Pinia，未持久化）。
