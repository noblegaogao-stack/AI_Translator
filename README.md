# AI 翻译工具

一个基于 React 19 和 Python 的前后端分离 AI 翻译软件，支持文字翻译、文件翻译和图片翻译功能。

## 功能特性

- **文字翻译**：支持多语言互译，可选择翻译风格和行业规范
- **文件翻译**：支持 PDF、Word、Excel、PowerPoint 等格式，可选择是否翻译表格和图片
- **图片翻译**：支持上传图片或直接粘贴图片进行翻译
- **术语表导入**：支持上传 CSV 格式的术语表文件
- **用户登录**：登录用户可选择翻译完成后发送邮件

## 技术栈

### 前端
- React 19 + TypeScript
- Ant Design 组件库
- Axios 网络请求
- Vite 构建工具

### 后端
- FastAPI 框架
- Python 3.14
- pytesseract 图片 OCR
- pdfplumber PDF 处理
- python-docx Word 处理
- openpyxl Excel 处理
- python-pptx PowerPoint 处理

## 项目结构

```
AI_Translator/
├── frontend/           # 前端 React 19 项目
│   ├── src/
│   │   ├── components/  # 组件目录
│   │   ├── pages/       # 页面目录
│   │   ├── services/    # 服务目录
│   │   ├── utils/       # 工具目录
│   │   ├── App.tsx      # 主应用组件
│   │   ├── main.tsx     # 应用入口
│   │   └── index.css    # 全局样式
│   ├── package.json     # 前端依赖
│   ├── vite.config.ts   # Vite 配置
│   └── tsconfig.json    # TypeScript 配置
├── backend/            # 后端 Python 项目
│   ├── app/
│   │   ├── api/         # API 路由
│   │   ├── services/    # 业务服务
│   │   ├── models/      # 数据模型
│   │   └── utils/       # 工具函数
│   ├── main.py          # 后端入口
│   ├── requirements.txt # 后端依赖
│   └── .env             # 环境配置
└── README.md           # 项目说明
```

## 运行说明

### 1. 安装依赖

#### 前端依赖
在 `frontend` 目录下运行：
```bash
npm install
```

#### 后端依赖
在 `backend` 目录下运行：
```bash
pip install -r requirements.txt
```

### 2. 启动服务

#### 前端开发服务器
在 `frontend` 目录下运行：
```bash
npm run dev
```
前端服务将运行在 http://localhost:3000

#### 后端服务
在 `backend` 目录下运行：
```bash
python main.py
```
后端服务将运行在 http://localhost:8000

### 3. 环境配置

后端邮件服务需要在 `.env` 文件中配置 SMTP 服务器信息：

```
# SMTP 邮件服务器配置
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# 应用配置
APP_NAME=AI Translator
APP_VERSION=1.0.0
```

## 注意事项

1. **图片翻译功能**：需要安装 Tesseract OCR 引擎
2. **文件翻译支持的格式**：PDF、Word (.docx)、Excel (.xlsx)、PowerPoint (.pptx)
3. **术语表导入**：支持 CSV 格式，格式为：源术语,目标术语
4. **邮件发送功能**：需要正确配置 SMTP 服务器信息
5. **翻译 API**：当前使用的是模拟翻译函数，实际项目中需要替换为真实的翻译 API

## 项目启动流程

1. 启动后端服务
2. 启动前端开发服务器
3. 访问 http://localhost:3000 使用翻译工具

## 许可证

MIT License