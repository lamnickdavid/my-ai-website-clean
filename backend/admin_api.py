from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import time

app = Flask(__name__)
CORS(app)
SECRET_KEY = "your_secret_key"

ADMIN_USER = "admin"
ADMIN_PASS = "admin123"

@app.route("/api/admin/login", methods=["POST"])
@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json
    if data.get("username") == ADMIN_USER and data.get("password") == ADMIN_PASS:
        token = jwt.encode({"user": ADMIN_USER, "is_admin": True, "exp": time.time() + 3600}, SECRET_KEY, algorithm="HS256")
        return jsonify({"token": token})
    return jsonify({"msg": "账号或密码错误"}), 401

def admin_required(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if not payload.get("is_admin"):
                return jsonify({"msg": "无权限"}), 403
        except Exception:
            return jsonify({"msg": "未登录或token无效"}), 401
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

@app.route("/api/admin/apps", methods=["GET"])
@app.route("/admin/apps", methods=["GET"])
@admin_required
def get_apps():
    return jsonify({"apps": [
        {"id": 1, "name": "智能文案生成", "price": 10, "status": "上架"},
        {"id": 2, "name": "图片风格转换", "price": 20, "status": "下架"},
    ]})

# 用户与订单数据模拟
users = [
    {"id": 1, "username": "user1", "email": "user1@example.com", "status": "正常"},
    {"id": 2, "username": "user2", "email": "user2@example.com", "status": "禁用"},
]
orders = [
    {"id": 1, "user_id": 1, "amount": 100, "status": "已支付"},
    {"id": 2, "user_id": 2, "amount": 200, "status": "待支付"},
]

# 用户管理接口
@app.route("/api/admin/users", methods=["GET"])
@app.route("/admin/users", methods=["GET"])
@admin_required
def get_users():
    return jsonify({"users": users})

@app.route("/api/admin/users", methods=["POST"])
@app.route("/admin/users", methods=["POST"])
@admin_required
def add_user():
    data = request.json
    new_id = max([u['id'] for u in users]) + 1 if users else 1
    user = {"id": new_id, **data}
    users.append(user)
    return jsonify(user)

@app.route("/api/admin/users/<int:user_id>", methods=["PUT"])
@app.route("/admin/users/<int:user_id>", methods=["PUT"])
@admin_required
def edit_user(user_id):
    data = request.json
    for u in users:
        if u["id"] == user_id:
            u.update(data)
            return jsonify(u)
    return jsonify({"msg": "用户不存在"}), 404

@app.route("/api/admin/users/<int:user_id>", methods=["DELETE"])
@app.route("/admin/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    global users
    users = [u for u in users if u["id"] != user_id]
    return jsonify({"msg": "删除成功"})

# 订单管理接口
@app.route("/api/admin/orders", methods=["GET"])
@app.route("/admin/orders", methods=["GET"])
@admin_required
def get_orders():
    return jsonify({"orders": orders})

@app.route("/api/admin/orders", methods=["POST"])
@app.route("/admin/orders", methods=["POST"])
@admin_required
def add_order():
    data = request.json
    new_id = max([o['id'] for o in orders]) + 1 if orders else 1
    order = {"id": new_id, **data}
    orders.append(order)
    return jsonify(order)

@app.route("/api/admin/orders/<int:order_id>", methods=["PUT"])
@app.route("/admin/orders/<int:order_id>", methods=["PUT"])
@admin_required
def edit_order(order_id):
    data = request.json
    for o in orders:
        if o["id"] == order_id:
            o.update(data)
            return jsonify(o)
    return jsonify({"msg": "订单不存在"}), 404

@app.route("/api/admin/orders/<int:order_id>", methods=["DELETE"])
@app.route("/admin/orders/<int:order_id>", methods=["DELETE"])
@admin_required
def delete_order(order_id):
    global orders
    orders = [o for o in orders if o["id"] != order_id]
    return jsonify({"msg": "删除成功"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
