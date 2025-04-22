# REKRO 社交网络应用

REKRO是一个面向用户社交互动的移动应用程序，专注于促进用户之间的社交互动、活动共享和实时聊天功能。该应用使用React Native和Expo开发，提供跨平台兼容性。

## 应用功能

### 核心功能

- **用户认证系统**：支持注册、登录和个人资料设置
- **首页动态流**：展示推荐活动和潜在社交联系
- **活动发现与参与**：浏览、查看详情和参加各种活动
- **社交连接**：添加朋友、查看用户资料
- **实时聊天**：与联系人进行私人对话，支持WebSocket实时消息
- **个人资料管理**：查看和编辑个人信息，管理关注者和正在关注的人

### 技术特点

- 使用MobX进行状态管理
- React Navigation实现应用导航
- 支持实时数据通信
- 响应式用户界面设计

## 项目结构

```
├── src/                  # 源代码目录
│   ├── assets/           # 图像和静态资源
│   ├── hooks/            # 自定义React Hooks
│   ├── screens/          # 应用屏幕组件
│   │   ├── auth/         # 认证相关屏幕
│   │   ├── connections/  # 社交连接功能
│   │   ├── conversations/# 聊天对话功能
│   │   ├── events/       # 活动相关功能
│   │   ├── home/         # 主页屏幕
│   │   └── profile/      # 用户资料屏幕
│   ├── services/         # API服务和数据访问
│   ├── styles/           # 共享样式
│   └── types/            # TypeScript类型定义
├── App.tsx               # 应用入口组件
├── app.json              # Expo配置
└── package.json          # 依赖和脚本
```

## 技术栈

- **前端框架**：React Native (v0.76.9)
- **UI库**：React Native原生组件
- **状态管理**：MobX (v6.13.6)
- **导航**：React Navigation (v7.x)
- **HTTP客户端**：Axios (v1.7.9)
- **数据存储**：AsyncStorage
- **实时通信**：WebSocket (sockjs-client)
- **开发环境**：Expo (v52.0.46)

## 安装与运行

### 先决条件

- Node.js (>=18)
- Yarn或npm
- iOS/Android模拟器或真机调试设备

### 安装步骤

1. 克隆项目仓库
   ```bash
   git clone [仓库URL]
   cd my-app
   ```

2. 安装依赖
   ```bash
   yarn install
   # 或
   npm install
   ```

3. 启动开发服务器
   ```bash
   yarn start
   # 或
   npm start
   ```

4. 运行应用
   - 按 `i` 在iOS模拟器上运行
   - 按 `a` 在Android模拟器上运行
   - 扫描QR码在Expo Go应用上运行

## 应用导航结构

应用采用了嵌套导航结构：

1. **认证栈导航**：
   - 登录
   - 注册
   - 个人资料设置

2. **主标签导航**：
   - 首页标签
   - 活动标签
   - 连接标签
   - 聊天标签
   - 账户标签

## 开发指南

### 代码风格与规范

项目使用ESLint进行代码质量检查，采用TypeScript进行类型检查。

### 添加新功能

1. 在适当的目录中创建新组件
2. 在相应的导航栈中添加新屏幕
3. 如需添加新的API服务，请在`services`目录中创建

### 数据流

1. 使用MobX Store管理应用状态
2. 通过自定义Hooks连接组件与Store
3. API请求通过服务层处理

## 部署

### 构建生产版本

```bash
expo build:android  # 构建Android APK
expo build:ios      # 构建iOS IPA
```

### 发布更新

```bash
expo publish
```

## 贡献指南

1. Fork该仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

[添加许可证信息] 