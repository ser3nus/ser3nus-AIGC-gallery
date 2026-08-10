# 文件夹分类（Folder Categories）设计文档

日期：2026-08-06
状态：已批准设计

## 背景与目标

现有 Ser3nus AIGC Gallery 的公开和私密画廊都是平铺展示。用户需要**按文件夹自动分类**：把图片按主题拖入不同子目录，目录路径自动成为类别，站点上通过类别按钮筛选浏览。

目标：公开画廊与私密画廊都支持"文件夹即类别"，多层嵌套，类别筛选按钮交互。无需任何元信息标注（延续"拖文件即识别"的简化流程）。

## 需求（已与用户确认）

- **分类模型**：文件夹 = 单一类别（一张图归一个文件夹）
- **层级**：支持多层嵌套（`images/邦邦乐队/动画/*.png`）
- **展示**：类别筛选按钮（作品页顶部一排，点击过滤），保留"全部"
- **大类包含子类**：点「邦邦乐队」显示 `邦邦乐队/` 下所有作品（含子目录）；点「邦邦乐队/动画」只看该层
- **类别名**：即目录路径，可为中文（仅显示，不进入 URL slug）
- **公开 + 私密**：两个画廊都实现
- **未分类**：根目录下的文件无类别，不产生按钮（点「全部」可见）

## 数据模型

### WorkEntry（公开，`src/lib/types.ts`）

新增字段：
```ts
category?: string   // 相对路径，如 "邦邦乐队/动画"；根目录文件无此字段
```

### 私密 manifest（`public/media/private/manifest.json`）

每项新增：
```json
{ "slug": "...", "file": "...", "category": "邦邦乐队/动画" }
```
根目录文件无 `category` 字段。

## 扫描逻辑

### 公开：`src/lib/content.ts` 的 `scanMediaFiles`

改为**递归**扫描 `images/`（以及 banner/background 等目录）下的子目录：
- 相对路径（如 `邦邦乐队/动画`）记录为 `category`
- 直接位于 `images/` 根的文件 → 无 category
- 跳过隐藏目录/文件（`.` 开头）

### 私密：`scripts/encrypt-private.ts`

改为**递归**扫描 `private-src/` 子目录：
- 加密后 `manifest.json` 每项写入相对路径 `category`
- 文件命名仍用 slug（`<slug>.enc.json`），类别与文件解耦（slug 不含类别，避免重名冲突用独立目录？）

**注意**：私密密文输出平铺到 `public/media/private/`。若两个子目录有同名文件（如 `私人/1.png` 和 `公开/1.png`），slug 冲突会导致密文互相覆盖。设计上：**输出仍平铺，加密脚本对重复 slug 追加序号后缀保证唯一**（`1` → `1`、`1-2`），`category` 只记录来源相对路径。

## 类别聚合

`content.ts` 新增 `getCategories(): string[]`：
- 从所有作品收集 category（含父级路径：如作品在 `邦邦乐队/动画`，则「邦邦乐队」和「邦邦乐队/动画」都是可选类别）
- 去重、按路径层级排序

## UI 组件

### 公开：`src/components/gallery/CategoryFilter.tsx`（新建，client）

- props：`categories: string[]`、`onSelect: (cat: string | null) => void`、`active: string | null`
- 渲染按钮行：`[全部] [邦邦乐队] [邦邦乐队/动画] ...`
- 点击设置 active；`null` = 全部
- 样式对齐现有 FilterBar（pill 按钮，warm 配色）

### 公开：`src/app/works/page.tsx`（修改）

- 调用 `getCategories()`，接入 `CategoryFilter`
- 按 active 过滤 `allWorks`（active 为 `cat` 时保留 `category === cat || category.startsWith(cat + '/')`）
- 过滤是纯前端状态（`useState`），无新路由

### 私密：`src/components/private/usePrivateImages.ts`（修改）

- `PrivateImage` 加 `category?: string`，从 manifest 读取

### 私密：`src/components/private/PrivateGallery.tsx`（修改）

- 解锁后收集解密图的类别，渲染同类 `CategoryFilter`，点击过滤网格

## 测试

`src/lib/content.test.ts` 补充：
- 递归扫描：`images/风景/a.png` → category `风景`；`images/邦邦乐队/动画/b.png` → category `邦邦乐队/动画`；根目录文件无 category
- `getCategories()`：含父级路径、去重、排序

## 现有文件归类

- 公开：35 张图由用户按主题手动拖入子目录（一次性整理）
- 私密：NSFW 图在 `private-src/` 下建子目录，重跑 `npm run encrypt-private`

## 非目标

- 不做多标签（一图多类）
- 不做类别独立路由（纯前端过滤）
- 不自动归类现有文件（用户手动拖）
