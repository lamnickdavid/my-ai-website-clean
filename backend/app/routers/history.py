from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, database

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.utils_jwt import get_current_user
from typing import List
from app import schemas

@router.get("/list")
def list_history(db: Session = Depends(get_db), user=Depends(get_current_user)):
    records = db.query(models.History).filter(models.History.user_id == user.id).order_by(models.History.timestamp.desc()).all()
    return {"history": [
        {
            "type": r.type,
            "amount": r.amount,
            "desc": r.desc,
            "timestamp": r.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        } for r in records
    ]}

# 管理员获取全部订单流水
@router.get("/all")
def list_all_history(db: Session = Depends(get_db)):
    # 使用join查询同时获取历史记录和用户信息
    records = db.query(models.History, models.User.username)\
             .join(models.User, models.History.user_id == models.User.id)\
             .order_by(models.History.timestamp.desc()).all()
    
    return [
        {
            "id": r[0].id,
            "user_id": r[0].user_id,
            "username": r[1],  # 添加用户名
            "type": r[0].type,
            "amount": r[0].amount,
            "desc": r[0].desc,
            "timestamp": r[0].timestamp.strftime('%Y-%m-%d %H:%M:%S')
        } for r in records
    ]
