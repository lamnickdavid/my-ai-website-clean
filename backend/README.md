# Backend - FastAPI

## 简介
本目录为后端服务，基于 FastAPI 框架，负责用户、余额、AI 应用等 API。

## 运行方式

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows 下用 venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 目录结构
```
backend/
├── app/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── routers/
│        ├── users.py
│        └── balance.py
├── requirements.txt
└── README.md
```
