# app-admin
基于新齐低代码开发框架的后台管理模块
包括系统配置、管理员管理、角色管理等功能

## 许可协议（双重授权）

本项目采用**双重授权**模式，您可任选其一：

1. **开源免费授权**：将本项目（含您基于本项目开发的用户代码）以
   [AGPL-3.0-only](https://www.gnu.org/licenses/agpl-3.0.html) 条款公开发布，
   即通过网络提供服务时也向用户提供相应源码，即可**免费使用**，无需购买商业授权。
2. **商业授权**：若您的代码**未**以 [OSI 认证的开源许可证](https://opensource.org/licenses) 开源
   （例如闭源商业软件、SaaS/云服务、嵌入式产品、内部工具等任意场景），
   则必须事先与授权方签署《商业许可协议》并支付费用后方可使用。

> 开源授权的完整条款以仓库根目录的 [LICENSE](./LICENSE)（AGPL-3.0 全文）为准；
> 商业授权的范围、期限与费用以双方签署的《商业许可协议》为准。

## 如何获取商业授权

如需商业授权，请联系开发者（xqkeji）洽询授权范围、期限与费用。官网：https://xqkeji.cn/

> **提示：** 本项目运行所依赖的 `php-xqkeji`（新齐低代码开发框架的 PHP 扩展）为**闭源程序**，
> 不在本项目 AGPL-3.0 授权范围内，使用它须遵循该扩展自身的许可条款（同样采用双重授权，详见其仓库 README）。

## 随包字体的开源协议说明

图像验证码用 `src/resource/captcha/` 下的 6 个 TTF 渲染字形。安装或更新本包时，composer 通过
`xqkeji\composer\Asset::copyDirs` 把该目录**整体**复制到宿主的 `resource/captcha/`（不按扩展名过滤），
因此每个字体旁的许可全文 `captchaN_license.txt` 会随字体一同分发。

> **字体是独立的第三方作品，不被本项目的 AGPL-3.0 / 商业双重授权覆盖，其条款也不因本项目的授权方式而改变。**
> 下表 6 个字体均可免费用于商业产品，使用字体本身无需购买商业授权；但本项目的**代码**仍按上文
> 《许可协议（双重授权）》执行。

### 字体清单

| 文件 | 字体与版本 | 版权 | 许可 |
| --- | --- | --- | --- |
| `captcha0.ttf` | Bitstream Vera Sans Mono（Release 1.10） | Copyright (c) 2003 Bitstream, Inc. | Bitstream Vera License |
| `captcha1.ttf` | TGL 0-17（Version 1.003 2010） | Copyright (c) 2010 Peter Wiegel | 作者同时提供 GPL（含字体例外）与 OFL-1.1，本包按 **OFL-1.1** 使用与再分发 |
| `captcha2.ttf` | Permanent Marker（Version 1.001） | Copyright (c) 2010 Font Diner, Inc. | Apache-2.0 |
| `captcha3.ttf` | Alfa Slab One（Version 2.000） | Copyright 2016 The Alfa Slab One Project Authors，保留字体名「Alfa Slab」 | OFL-1.1 |
| `captcha4.ttf` | PT Serif（Version 1.000W OFL） | Copyright (c) 2010 ParaType Ltd.，保留字体名「PT Sans」「PT Serif」「ParaType」 | OFL-1.1 |
| `captcha5.ttf` | Special Elite（Version 1.001） | Copyright (c) 2010 Brian J. Bonislawsky DBA Astigmatic (AOETI) | Apache-2.0 |

字体名称、版本与版权均取自各 TTF 自身的 `name` 表，与所附许可全文一致。
许可全文分别位于同目录的 `captcha0_license.txt` … `captcha5_license.txt`。

### 来源与完整性校验

`captcha2`–`captcha5` 取自 Google Fonts 官方仓库 `google/fonts`，与上游发布文件**逐字节一致**
（git blob SHA-1 相同），未子集化、未改名、未转换格式，即上游原版；对 OFL 字体而言属于
「Original Version」，不触发保留字体名条款。

| 文件 | 上游路径（`google/fonts`） | git blob SHA-1 |
| --- | --- | --- |
| `captcha2.ttf` | `apache/permanentmarker/PermanentMarker-Regular.ttf` | `3218fc5b3d395c3a3fc207fdf17a27bb32af3242` |
| `captcha3.ttf` | `ofl/alfaslabone/AlfaSlabOne-Regular.ttf` | `0158f184619023509f750ad3def1c39be2bd7872` |
| `captcha4.ttf` | `ofl/ptserif/PT_Serif-Web-Regular.ttf` | `5310691a999658437d6db608b9447d606598753e` |
| `captcha5.ttf` | `apache/specialelite/SpecialElite-Regular.ttf` | `6654876f95f11cb2b55c7c4254727ef68dbea74c` |

许可全文同样取自上游：`captcha3_license.txt`、`captcha4_license.txt` 与上游 `OFL.txt` 逐字节一致；
`captcha2_license.txt`、`captcha5_license.txt` 是上游 Apache-2.0 `LICENSE.txt` 正文前置该字体的版权声明。
`captcha0.ttf`、`captcha1.ttf` 沿用既有文件，本次未作任何修改。

复核方式（仓库根目录执行，输出应与上表一致）：

```bash
git hash-object src/resource/captcha/captcha2.ttf
```

### 再分发与使用义务

- **保留声明**：再分发字体（含随产品打包、容器镜像分发）时必须一并保留版权声明与对应许可全文，
  即 `captchaN_license.txt` 不可删除。OFL 第 2 条、Apache-2.0 第 4 条与 Bitstream Vera License 均有此要求。
- **不得单独销售字体**：OFL 第 1 条与 Bitstream Vera License 都禁止把字体本身作为独立商品出售；
  作为软件包的一部分随产品分发或销售是允许的。
- **修改后必须改名**：若子集化、增删字形或转换格式后再分发，OFL 第 3 条禁止继续使用保留字体名
  （「Alfa Slab」「PT Sans」「PT Serif」「ParaType」），Bitstream Vera License 禁止名称中含有
  「Bitstream」或「Vera」。当前 6 个文件均未修改，不触发该条款。
- **字体须仍以原许可分发，但渲染结果不受限**：OFL 第 5 条要求字体整体仍以 OFL 分发、不得改用其他许可；
  该条同时明确**不适用于用字体创建的文档**——本包渲染出的验证码图片属于此类，可随闭源商业产品分发。
- **不得借作者名义背书**：OFL 第 4 条禁止以版权持有人或作者名义推广修改版；Bitstream Vera License
  同样限制在广告中使用 Gnome / Gnome Foundation / Bitstream 的名称。

### 自 v1.3.10 起替换掉的字体

v1.3.9 及更早版本含以下字体，因许可不兼容或未获授权，已替换为上表中的字体：

| 原文件 | 原字体 | 替换原因 |
| --- | --- | --- |
| `captcha2.ttf` | SchulVokalDotless（© M. Klein, 10.2003） | `name` 表仅有版权声明、无任何许可条款，再分发授权不明 |
| `captcha3.ttf` | Tepeno Sans v1.15（© GrandChaos9000） | 许可为 CC BY-NC-SA 3.0，**禁止商业使用**，与本项目商业授权冲突 |
| `captcha4.ttf` | Linux Libertine 5.1.3（Philipp H. Poll） | GPL（含字体例外）与 OFL 双条款，改用纯 OFL 的 PT Serif；体积由 906980 B 降至 359048 B |
| `captcha5.ttf` | Sling 2.0（© 1994 STAR Retrieval Systems） | **All Rights Reserved**，未附任何授权，不可再分发 |

> 仍在用 v1.3.9 及更早版本的用户请升级。composer 的 `post-package-update` 会先 `rmDirs` 清空宿主的
> `resource/captcha/` 再 `copyDirs` 重新复制，正常更新即可移除上述旧字体，无需手工清理。

