from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    balance: float

    class Config:
        orm_mode = True

class HistoryOut(BaseModel):
    id: int
    user_id: int
    type: str
    amount: float
    desc: str
    timestamp: str

    class Config:
        orm_mode = True
