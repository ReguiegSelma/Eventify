from fastapi import APIRouter, Depends
from app.database import get_db
from app.features.users import repository as user_repo

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("")
def get_users(db = Depends(get_db)):
    return user_repo.get_all_users(db)