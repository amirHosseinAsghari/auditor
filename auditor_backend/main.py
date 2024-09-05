from typing import Annotated, Optional, Union

from fastapi import Depends, FastAPI, HTTPException, Header

import models
import schemas
import crud
from database import engine, SessionLocal
import database
from sqlalchemy.orm import Session
app = FastAPI()

database.Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: db_dependency):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/auth/login", response_model=schemas.AuthResponse)
def login( credentials: schemas.Credentials ,db: db_dependency):
    authenticated = crud.login(db=db,username=credentials.username, password=credentials.password)
    if not authenticated:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    else:
        return authenticated

@app.post("/auth/logout")
async def logout(token: schemas.Token,db: db_dependency):
    result = crud.logout(db=db, token=token.token)
    if result:
        raise HTTPException(status_code=200, detail="Logged out successfully")


@app.post("/auth/isAuthenticated", response_model=schemas.AuthResponse)
def is_authenticated(token: schemas.Token,db: db_dependency):
    result = crud.isAuthenticated(db=db,token=str(token.token))
    if not result:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return result


@app.post("/api/report/create", response_model=schemas.Report)
def create_report(token: schemas.Token, report: schemas.ReportCreate, db: db_dependency):
    is_authorized = crud.isAuthenticated(db=db,token=token.token)
    if is_authorized:
        if is_authorized.role == "auditor":
            raise HTTPException(status_code=403, detail="auditors are not allowed to write reports")
        user_id = crud.get_user_id_by_token(db, token=token.token)
        report = crud.create_report(db=db, report=report, user_id=user_id)
        return report
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.delete("/api/report/delete/{id}")
def delete_report(token: schemas.Token,id:int,db: db_dependency):
    is_authorized = crud.isAuthenticated(db=db, token=token.token)
    if is_authorized:
        if is_authorized.role == "auditor":
            raise HTTPException(status_code=403, detail="auditors are not allowed to delete reports")
        author_user_id = crud.get_report_author(db=db, report_id=id)
        if author_user_id == crud.get_user_id_by_token(db, token=token.token):
            crud.remove_report(db=db, report_id=id)
        else:
            raise HTTPException(status_code=404, detail="Report does not exist")
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")
@app.get("/api/report/{id}", response_model=schemas.Report)
def get_report(id: int, db: db_dependency,access_token: Annotated[Union[str, None], Header()] = None):
    is_authorized = crud.isAuthenticated(db=db,token=access_token)

    if is_authorized:
        report = crud.get_report_by_id(db=db, report_id=id)
        if report:
            if is_authorized.role == "author":
                author_user_id = crud.get_report_author(db=db, report_id=id)
                if author_user_id == crud.get_user_id_by_token(db, token=access_token):
                    return report
                else:
                    raise HTTPException(status_code=401, detail="Unauthorized")
            if is_authorized.role == "auditor":
                return report
        else:
            raise HTTPException(status_code=404, detail="Resource not found")
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.get("/api/reports/{page}", response_model=list[schemas.Report])
def get_reports(db: db_dependency, page: int = 1,status: Union[str, None] = None,access_token: Annotated[Union[str, None], Header()] = None):
    is_authorized = crud.isAuthenticated(db=db,token=access_token)
    if is_authorized:
        if is_authorized.role == "author":
            author_user_id = crud.get_user_id_by_token(db, token=access_token)
            reports = crud.get_reports(role=is_authorized.role,user_id=author_user_id, page=page, db=db)
            if reports:
                return reports
            else:
                raise HTTPException(status_code=404, detail="Resource not found")
        if is_authorized.role == "auditor":
            auditor_user_id = crud.get_user_id_by_token(db, token=access_token)
            reports = crud.get_reports(role=is_authorized.role, user_id=auditor_user_id, page=page, db=db)
            if reports:
                return reports
            else:
                raise HTTPException(status_code=404, detail="Resource not found")


    else:
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.patch("/api/report/approve/{id}", response_model=bool)
def approve_report(token: schemas.Token, id:int, db: db_dependency):
    is_authorized = crud.isAuthenticated(db=db,token=token.token)
    if is_authorized:
        if is_authorized.role == "auditor":
            auditor_user_id = crud.get_user_id_by_token(db, token=token.token)
            report = crud.approve_report(db=db, report_id=id, auditor_id=auditor_user_id)
            if report:
                return report
            else:
                raise HTTPException(status_code=401, detail="Resource not found")
        else:
            raise HTTPException(status_code=401, detail="Authors are not allowed to approve/reject reports")
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.patch("/api/report/reject/{id}", response_model=bool)
def reject_report(token: schemas.Token, id:int, db: db_dependency):
    is_authorized = crud.isAuthenticated(db=db,token=token.token)
    if is_authorized:
        if is_authorized.role == "auditor":
            auditor_user_id = crud.get_user_id_by_token(db, token=token.token)
            report = crud.reject_report(db=db, report_id=id, auditor_id=auditor_user_id)
            if report:
                return report
            else:
                raise HTTPException(status_code=401, detail="Resource not found")
        else:
            raise HTTPException(status_code=401, detail="Authors are not allowed to approve/reject reports")
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")