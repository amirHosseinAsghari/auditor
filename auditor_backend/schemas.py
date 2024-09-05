from datetime import datetime
from typing import Union

from pydantic import BaseModel


class ReportBase(BaseModel):
    title: str
    date: str


class ReportCreate(ReportBase):
    description: str
    vulnerability_path: str
    source: Union[str, None] = None
    documents: str
    cvss_vector: Union[str, None] = None

class Report(ReportCreate):
    id: int
    status: Union[str, None] = None
    author: str
    auditor: Union[str, None] = None

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    username: str
    usertype: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class Credentials(BaseModel):
    username: str
    password: str
    class Config:
        orm_mode = True

class AuthResponse(BaseModel):
    token: str
    role: str

class Token(BaseModel):
    token: str