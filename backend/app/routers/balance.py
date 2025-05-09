from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, database
from datetime import datetime

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me")
def get_my_balance(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"balance": user.balance}

from pydantic import BaseModel

class RechargeRequest(BaseModel):
    amount: float

from app.utils_jwt import get_current_user

@router.post("/recharge")
def recharge_balance(req: RechargeRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    # 强制用db查一次，确保user为当前session的持久对象
    db_user = db.query(models.User).filter(models.User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.balance += req.amount
    from app.models import History
    record = History(user_id=db_user.id, type='recharge', amount=req.amount, desc='余额充值')
    db.add(record)
    db.commit()
    return {"balance": db_user.balance}
