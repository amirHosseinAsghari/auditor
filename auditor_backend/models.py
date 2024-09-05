
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
import database


class Users(database.Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    usertype = Column(String)



class Active_Users(database.Base):
    __tablename__ = "active_users"

    id = Column(Integer, primary_key=True)
    token = Column(String, unique=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("Users")


class Reports(database.Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    date = Column(String, index=True)
    description = Column(String, index=True)
    vulnerability_path = Column(String, index=True)
    source = Column(String, index=True)
    documents = Column(String, index=True)
    cvss_vector = Column(String, index=True)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("Users", foreign_keys=[author_id])
    status = Column(String, nullable=True)
    auditor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    auditor = relationship("Users", foreign_keys=[auditor_id])

