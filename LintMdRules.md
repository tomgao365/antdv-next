## 🎯 任务目标

请整理以下路径下的组件文档：

```
playground/src/pages/components/*/index.zh-CN.md
playground/src/pages/components/*/index.en-US.md
```

整理目标是：

* 统一结构，便于后续生成 `web-types.json`
* 确保 API 表格可被程序稳定解析
* 严格区分 **Props / Events / Slots / Methods / Types**
* 保持中英文结构一致

---

## 📌 整理范围（非常重要）

**只允许修改 `## API` 及其以下的内容。**
以下内容**绝对不允许改动**：

* YAML frontmatter（`---` 之间内容）
* `<DocHeading />`
* `## 何时使用 / When To Use`
* `## 示例 / Examples` 及所有 `<demo>` 内容
* 所有代码块（`ts / `vue / ```js）
* `## Semantic DOM`、`## Design Token` 的位置与层级

---

# 一、API 结构规范（必须遵守）

### 1. 顶层结构（无论中英文）

在 `## API` 下面，**优先按以下顺序组织（有就写，没有就删）**：

**中文**

```
## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性
### 事件
### 插槽
### 方法
### Types
```

**英文**

```
## API

Common props ref：[Common Props](/docs/vue/common-props)

### Props
### Events
### Slots
### Methods
### Types
```

---

### 2. 包含子组件的结构（如 Form）

**中文标准结构：**

```
## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Form

#### 属性 {#form-props}
#### 事件 {#form-events}
#### 插槽 {#form-slots}   （如有）
#### 方法 {#form-methods}

### FormItem {#form-item}

#### Props {#form-item-props}

### Types
#### validateMessages {#validatemessages}
```

**英文标准结构：**

```
## API

Common props ref：[Common Props](/docs/vue/common-props)

### Form

#### Props {#form-props}
#### Events {#form-events}
#### Slots {#form-slots}   (if any)
#### Methods {#form-methods}

### FormItem {#form-item}

#### Props {#form-item-props}

### Types
#### validateMessages {#validatemessages}
```

**关键层级规则（不可违反）：**

* `### Types` **必须是 `## API` 的子章节**
* `validateMessages` **必须作为 `### Types` 的子小节（`####`）**
* ❌ 绝对不允许：`## Types`
* ❌ 绝对不允许：`validateMessages` 与 Props/Events/Methods 平级

最终层级示意：

```
## API
  ├── Form（Props / Events / Methods）
  ├── FormItem（Props）
  └── Types
       └── validateMessages

## Semantic DOM   ← 不动
## Design Token   ← 不动
```

---

# 二、版本列统一规则

**适用于：所有 API 表格（Props / Events / Methods / Slots）**

### 1. 若已有“版本”列：

* 把所有具体版本号改为：`-`

示例：

```diff
| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
- | action | 自定义操作项 | ReactNode | - | 4.9.0 |
+ | action | 自定义操作项 | ReactNode | - | - |
```

### 2. 若没有“版本”列：

* **必须补齐“版本”列**
* 内容统一填：`-`

---

# 三、API 表格转义规则（核心）

> 仅对 **`## API` 及其下属表格单元格** 生效，其它地方不处理。

## 1. `<` 和 `>` 必须转义

| 原字符 | 替换为    |
| --- | ------ |
| `<` | `&lt;` |
| `>` | `&gt;` |

示例：

```
Record<string, any>
```

必须改为：

```
Record&lt;string, any&gt;
```

---

## 2. `{}` 默认需要转义

| 原字符 | 默认替换为 |
| --- | ----- |
| `{` | `\{`  |
| `}` | `\}`  |

示例：

```
boolean | { icons: FeedbackIcons }
```

必须改为：

```
boolean | \{ icons: FeedbackIcons \}
```

---

## 3. `{}` 的例外（你明确要求）

**若 `{...}` 被反引号包裹，则不转义。**

✅ 允许不转义：

```
`{span: 3, offset: 12}`
`sm: {span: 3, offset: 12}`
```

❌ 仍需转义：

```
boolean | { icons: FeedbackIcons }
TooltipProps & { icon: VueNode }
```

---

## 4. 转义执行顺序（避免二次转义）

处理顺序必须如下：

1. **先识别并跳过**所有反引号包裹的代码片段（`` `...` ``）
2. 对剩余文本：

    * `{` → `\{`
    * `}` → `\}`
3. 最后统一：

    * `<` → `&lt;`
    * `>` → `&gt;`

---

# 四、组件命名规范

文档中出现：

```
Splitter.Panel
```

必须改为：

```
SplitterPanel
```

**命名依据：**

* 以 `packages/antdv-next/src/components.ts` 中的导出名为准。
* 不确定时必须查该文件，而不是猜。

---

# 五、`### Types` 规则（你最终确认版）

在 `## API` 下面新增：

```
### Types
```

**必须迁移到 `### Types` 下面的内容：**

* 原 `### validateMessages {#validatemessages}`
  → 变为：

```
### Types
#### validateMessages {#validatemessages}
```

* 任何“独立类型说明”（如有）：

    * `ValidateErrorEntity` 结构说明
    * `FormClassNamesType` 字段含义表
    * `FormStylesType` 字段含义表

---

## **不受影响的章节（必须保持原样）**

下面这些**仍然是独立一级标题 `##`，位置与层级不变**：

* `## Semantic DOM {#semantic-dom}`
* `## Design Token {#design-token}`

---

# 六、最终结构骨架（标准模板）

### 中文

```
## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Form
#### 属性 {#form-props}
#### 事件 {#form-events}
#### 插槽 {#form-slots}   （如有）
#### 方法 {#form-methods}

### FormItem {#form-item}
#### Props {#form-item-props}

### Types
#### validateMessages {#validatemessages}
```

### 英文

```
## API

Common props ref：[Common Props](/docs/vue/common-props)

### Form
#### Props {#form-props}
#### Events {#form-events}
#### Slots {#form-slots}   (if any)
#### Methods {#form-methods}

### FormItem {#form-item}
#### Props {#form-item-props}

### Types
#### validateMessages {#validatemessages}
```

---

# 七、AI 执行 Checklist（可直接复制）

* [ ] 仅修改 `## API` 及其以下内容
* [ ] 所有 API 表格补齐“版本”列，内容统一为 `-`
* [ ] 统一为 Props / Events / Slots / Methods 结构
* [ ] 若有子组件，拆分为独立小节
* [ ] 所有 Props 标题必须带 anchor（如 `{#form-props}`）
* [ ] `Splitter.Panel` → `SplitterPanel`（以 components.ts 为准）
* [ ] 在 API 表格中：`< >` → `&lt; &gt;`
* [ ] 在 API 表格中：**非反引号包裹的** `{}` → `\{ \}`
* [ ] 反引号包裹的 `{}` 保持原样
* [ ] 在 `## API` 下新增 `### Types`
* [ ] 将 `validateMessages` 迁移到 `### Types` 作为 `#### validateMessages`
* [ ] `## Semantic DOM` 与 `## Design Token` 保持原有层级和位置不动
* [ ] 执行`pnpm -F playground build` 确保build无误
