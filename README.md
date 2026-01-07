# 电影管理器

一个跨平台的电影管理客户端，支持 Windows 和 macOS。

## 功能特性

- 自动扫描目录下的电影文件
- 显示电影的时长、分辨率、编码等详细信息
- 支持浏览子文件夹
- 直观的网格布局展示电影
- 点击电影查看详细信息

## 如何使用

1. 将本应用直接复制到存放电影的文件夹中
2. 运行应用程序
3. 应用会自动扫描当前目录下的所有电影文件和子文件夹
4. 点击文件夹可以浏览子文件夹中的电影
5. 点击电影卡片可以查看电影的详细信息

## 技术栈

- Electron - 跨平台桌面应用框架
- Node.js - JavaScript 运行时
- ffprobe - 用于提取视频文件元数据

## 开发环境搭建

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 运行开发版本

```bash
# 使用 npm
npm start

# 或使用 yarn
yarn start
```

### 构建应用

#### 构建 Windows 版本

```bash
# 首先安装 electron-builder
npm install electron-builder --save-dev

# 然后构建
npx electron-builder --win
```

#### 构建 macOS 版本

```bash
# 首先安装 electron-builder
npm install electron-builder --save-dev

# 然后构建
npx electron-builder --mac
```

## 支持的视频格式

- MP4 (.mp4)
- MKV (.mkv)
- AVI (.avi)
- MOV (.mov)
- WMV (.wmv)
- FLV (.flv)
- WebM (.webm)

## 注意事项

- 首次运行时，应用会扫描当前目录下的所有文件，可能需要一些时间
- 提取视频元数据需要使用 ffprobe，应用会自动处理
- 应用会在当前目录下运行，不会修改任何电影文件