# Private Gallery（私密画廊）设计文档

日期：2026-08-06
状态：已批准设计

## 背景与目标

现有 Ser3nus AIGC Gallery 是纯静态开源网站（Next.js 16 + GitHub Pages），公开展示 AIGC 作品。用户需要存放部分 NSFW 图片，不适合公开展示。

目标：新增一个**隐藏入口的私密画廊**，图片以密文形式存在于仓库，访客需输入固定密码才能解密查看。源码仓库中只有密文数据，没有明文图片。

## 需求（已与用户确认）

- **内容**：NSFW 图片，单独一个私密画廊页面
- **密码**：单个固定密码（字母+数字+符号，8-10 位），随时可改
- **入口**：隐藏（导航栏不显示，URL 直达 `/private`）
- **展示**：解锁后网格 + 点开大图
- **存放**：本地加密脚本手动加密后放入目录
- **不加密 MDX 元信息**：文件名做标题，保持简单

## 约束

- 纯静态导出（`output: 'export'`），无服务器
- 代码开源，仓库公开
- GitHub Pages 托管
- 因此：解密必须在浏览器端完成，解密算法公开，**密码是唯一防线**

## 技术方案：AES-GCM + PBKDF2（方案 A）

已比较三种方案（A：AES-GCM+PBKDF2 / B：XOR 轻量 / C：仅隐藏），选定 A。

### 核心原则

**密码即密钥**：仓库里永不存密码、不存密码哈希。前端不校验密码，而是直接用密码派生密钥解密——密码正确则解密成功，错误则 AES-GCM 认证标签校验失败、解密抛错。

### 加密格式

每个图片一个密文文件 `public/media/private/<slug>.enc.json`：

```json
{
  "iv": "<base64>",
  "ciphertext": "<base64>"
}
```

全局盐文件 `public/media/private/salt.json`：

```json
{
  "salt": "<base64>",
  "iterations": 1000000
}
```

- 密钥派生：`PBKDF2(密码, salt, 1000000 次) → AES-256 密钥`
- 每个图片使用独立的随机 IV
- salt 由加密脚本首次运行时生成并固定
- 标题由前端从文件名 slug 化派生（与公开画廊 bare 条目一致），密文文件不含 title 字段

### 安全度评估

8-10 位混合密码（95^8 ≈ 6.6×10¹⁵）+ PBKDF2 100 万次迭代：GPU 集群暴力破解需数月，对个人画廊足够。

## 架构与数据流

```
发布前（本地）：
  private-src/xxx.png ──npm run encrypt-private──> public/media/private/xxx.enc.json
  明文图可删除；private-src/ 加入 .gitignore 防止明文误提交

访客访问：
  GET /private
    → 密码门（输入框）
    → PBKDF2(密码, salt, 100万次) 派生 AES-256 密钥
    → 尝试 AES-GCM 解密
       ├─ 成功 → 解密全部图片 → 网格 → 点开大图
       └─ 失败 → 提示"密码错误"，留在密码门
```

- 密钥仅存于前端内存，不写 localStorage，刷新需重新输入密码
- 未解锁时不渲染任何图片
- 密文文件在仓库中公开，但无密码无法解密

## 组件结构

```
src/app/private/page.tsx               服务端壳（静态导出 /private/）
src/components/private/PrivateGallery.tsx    'use client' 密码门 + 解密 + 网格状态
src/components/private/PrivateCard.tsx       网格卡片（风格对齐 WorkCard）
src/components/private/usePrivateImages.tsx  解密逻辑 hook（派生密钥→解密→缓存）
src/lib/private-crypto.ts               加解密纯函数（Node 与浏览器复用）
scripts/encrypt-private.mjs             本地加密脚本（Node Web Crypto）
```

### 依赖关系

- `PrivateGallery` 依赖 `usePrivateImages`（解密）与 `PrivateCard`（展示）
- `usePrivateImages` 依赖 `private-crypto`（AES/PBKDF2）
- `encrypt-private.mjs` 依赖 `private-crypto`（Node 端复用同一套加密逻辑）
- 解密产物为 `data:` URL / blob URL，喂给 `next/image`（`unoptimized` 下直接 `<img>`）

## 密码管理

- 密码只存在于本地运行加密脚本时，不进仓库、不内联前端代码
- 改密码 = 用新密码重跑 `npm run encrypt-private`，重新加密全部图片
- 密码泄露 = 内容公开，需改密码重新加密

## 测试（vitest）

- `private-crypto` 往返：加密 → 解密还原原图字节
- 错误密码 → 解密抛错
- 不同 salt/IV → 密文不同
- 加密脚本端到端：`private-src` 示例图 → 密文 → 前端解密还原（可选）

## 工作流

1. 用户把 NSFW 图放入 `private-src/`
2. 运行 `npm run encrypt-private`（提示输入密码）
3. 明文图删除/被 gitignore，密文进入 `public/media/private/`
4. 提交密文，push main，GitHub Actions 自动构建部署
5. 访问 `/private` 输入密码查看

## 非目标

- 不提供防截图/防下载（解密后用户可另存）
- 不阻止已获密码者的传播
- 不加密公开画廊的现有内容
