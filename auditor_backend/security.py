import uuid
from hashlib import sha256
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "meowmeownigga"
ALGORITHM = "HS256"


def create_access_token() -> str:
    token = str(sha256(str(uuid.uuid4()).encode()).hexdigest())
    return token


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)