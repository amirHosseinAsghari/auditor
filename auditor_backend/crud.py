from datetime import datetime
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session
import security

import models
import schemas
from security import create_access_token


def get_user(db: Session, user_id: int):
    return db.query(models.Users).filter(models.Users.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.Users).filter(models.Users.username == username).first()

def get_user_id_by_token(db: Session, token: str):
    db_active_user = db.query(models.Active_Users).filter(models.Active_Users.token == token).first()
    return db_active_user.user_id

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Users).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.Users(username=user.username, hashed_password=hashed_password, usertype=user.usertype)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_reports(db: Session,author_id: int, page: int = 1, limit: int = 10):
    if page <= 0:
        page = 1
    reports = db.query(models.Reports).filter(models.Reports.author_id == author_id).offset((page * 10) - 10).limit(limit).all()
    result_reports = []
    for i in range(len(reports)):
        author = get_user(db, reports[i].author_id)
        auditor = get_user(db, reports[i].auditor_id)
        if author or auditor:
            result_reports.append(schemas.Report(id=reports[i].id, status=reports[i].status, author=author.username,
                                  auditor=auditor.username if auditor else None, description=reports[i].description,
                                  vulnerability_path=reports[i].vulnerability_path, source=reports[i].source,
                                  documents=reports[i].documents, cvss_vector=reports[i].cvss_vector, title=reports[i].title,
                                  date=reports[i].date))

    return result_reports


def remove_report(db: Session, report_id: int) -> bool:
    deleted_report = db.query(models.Reports).filter(models.Reports.id == report_id).delete()
    if deleted_report:
        db.commit()
        return True


def create_report(db: Session, report: schemas.ReportCreate, user_id: int) -> schemas.Report:
    db_item = models.Reports(**report.model_dump(), author_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return schemas.Report(**report.model_dump(), id=db_item.id,status=db_item.status, author=db_item.author.username,auditor=None)

def get_report_by_id(db: Session, report_id: int):
    report = db.query(models.Reports).filter(models.Reports.id == report_id).first()
    author = get_user(db, report.author_id)
    auditor = get_user(db, report.auditor_id)
    if author or auditor:
        return schemas.Report(id=report.id, status=report.status, author=author.username,
                              auditor=auditor.username if auditor else None, description=report.description,
                              vulnerability_path=report.vulnerability_path, source=report.source,
                              documents=report.documents, cvss_vector=report.cvss_vector, title=report.title,
                              date=report.date)



def get_report_author(db: Session, report_id: int):
    report = db.query(models.Reports).filter(models.Reports.id == report_id).first()
    if report:
        return report.author_id



def login(db: Session, username: str, password: str) -> Optional[schemas.AuthResponse]:
    db_user = get_user_by_username(db=db, username=username)
    if not db_user:
        return None
    if not security.verify_password(password, db_user.hashed_password):
        return None

    db_active_user = db.query(models.Active_Users).filter(models.Active_Users.user_id == db_user.id).first()
    if db_active_user:
        return schemas.AuthResponse(token=db_active_user.token, role=db_user.usertype)

    activate_user = models.Active_Users(token=create_access_token(),user_id=db_user.id)
    db.add(activate_user)
    db.commit()
    db.refresh(activate_user)
    db_active_user = db.query(models.Active_Users).filter(models.Active_Users.user_id == db_user.id).first()
    return schemas.AuthResponse(token=db_active_user.token, role=db_user.usertype)

def logout(db: Session, token: str):
    return db.query(models.Active_Users).filter(models.Active_Users.token == token).delete()



def isAuthenticated(db: Session, token: str) -> Optional[schemas.AuthResponse]:
    db_active_user = db.query(models.Active_Users).filter(models.Active_Users.token == token).first()
    if db_active_user:
        db_user = db.query(models.Users).filter(models.Users.id == db_active_user.user_id).first()
        return schemas.AuthResponse(token= db_active_user.token, role= db_user.usertype)
    return None


def approve_report(db: Session, report_id: int, auditor_id: int) -> bool:
    report = db.query(models.Reports).filter(models.Reports.id == report_id)
    if not report.first():
        raise HTTPException(status_code=401, detail="Unauthorized")
    reportobj = report.first()
    report.update({"id":reportobj.id, "status":"Approved", "author_id":reportobj.author_id,
                                 "auditor_id":auditor_id, "description":reportobj.description,
                                 "vulnerability_path":reportobj.vulnerability_path, "source":reportobj.source,
                                 "documents":reportobj.documents, "cvss_vector":reportobj.cvss_vector,
                                 "title":reportobj.title,
                                 "date":reportobj.date})
    db.commit()
    return True

def reject_report(db: Session, report_id: int, auditor_id: int) -> bool:
    report = db.query(models.Reports).filter(models.Reports.id == report_id)
    if not report.first():
        raise HTTPException(status_code=401, detail="Unauthorized")
    reportobj = report.first()
    report.update({"id":reportobj.id, "status":"Rejected", "author_id":reportobj.author_id,
                                 "auditor_id":auditor_id, "description":reportobj.description,
                                 "vulnerability_path":reportobj.vulnerability_path, "source":reportobj.source,
                                 "documents":reportobj.documents, "cvss_vector":reportobj.cvss_vector,
                                 "title":reportobj.title,
                                 "date":reportobj.date})
    db.commit()
    return True
