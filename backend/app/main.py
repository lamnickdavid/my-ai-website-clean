from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, balance

app = FastAPI()

# 自动建表，确保所有表都存在
from app import models, database
models.Base.metadata.create_all(bind=database.engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议指定前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(balance.router, prefix="/balance", tags=["balance"])
from app.routers import apps
app.include_router(apps.router, prefix="/apps", tags=["apps"])
from app.routers import history
app.include_router(history.router, prefix="/history", tags=["history"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI App Platform!"}
