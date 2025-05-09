from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, database
from pydantic import BaseModel

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 静态AI应用列表
APPS = [
    {"id": 1, "name": "智能文案生成", "desc": "输入主题，生成高质量文案", "price": 10},
    {"id": 2, "name": "图片风格转换", "desc": "上传图片，一键转换风格", "price": 20},
    {"id": 3, "name": "语音转文字", "desc": "上传音频，快速转文字", "price": 15},
]

@router.get("/list")
def list_apps():
    return {"apps": APPS}

# 管理员获取全部应用列表
@router.get("/all")
def list_all_apps():
    # 添加状态字段，以匹配前端期望的格式
    apps_with_status = [
        {**app, "status": "上架"} for app in APPS
    ]
    return apps_with_status

class UseAppRequest(BaseModel):
    app_id: int

from app.utils_jwt import get_current_user

@router.post("/use")
def use_app(req: UseAppRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    app = next((a for a in APPS if a["id"] == req.app_id), None)
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    if user.balance < app["price"]:
        raise HTTPException(status_code=400, detail="余额不足，请先充值")
    # 强制用db查一次，确保user为当前session的持久对象
    db_user = db.query(models.User).filter(models.User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.balance -= app["price"]
    from app.models import History
    record = History(user_id=db_user.id, type='consume', amount=-app['price'], desc=f"调用{app['name']}")
    db.add(record)
    db.commit()
    return {"msg": f"成功调用 {app['name']}！已扣除{app['price']}元。", "balance": db_user.balance}
