# ================================================================
# app/features/auth/service.py
# ================================================================
# logique métier pour auth
# ================================================================

from fastapi import HTTPException, status
from app.features.auth import repository as auth_repo
from app.features.auth.schemas import LoginResponse
from app.utils.security import verify_password, create_access_token, hash_password


def login_admin(db, email: str, password: str):

    # chercher admin
    admin = auth_repo.get_admin_by_email(db, email)

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe incorrect"
        )

    # verifier password
    if not verify_password(password, admin["PASSWORD_HASH"]):
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe incorrect"
        )

    # create token
    token = create_access_token({
        "email": admin["EMAIL"],
        "role": admin["ROLE_ADMIN"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": admin["ROLE_ADMIN"],
        "email": admin["EMAIL"]
    }


def create_admin(db, email: str, password: str, role: str) -> dict:

    # vérifier email existe
    existing = auth_repo.get_admin_by_email(db, email)

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un admin avec cet email existe déjà."
        )

    # vérifier role
    if role not in ["ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rôle invalide."
        )

    # hash password
    password_hash = hash_password(password)

    # créer admin
    new_id = auth_repo.create_admin(db, email, password_hash, role)

    return {
        "id_admin": new_id,
        "email": email,
        "role": role,
        "message": "Admin créé avec succès."
    }


def delete_admin(db, admin_id: int, current_admin_email: str) -> dict:

    admins = auth_repo.get_all_admins(db)

    target = next((a for a in admins if a["ID_ADMIN"] == admin_id), None)

    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin non trouvé."
        )

    # empêcher auto suppression
    if target["EMAIL"].lower() == current_admin_email.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous ne pouvez pas supprimer votre propre compte."
        )

    # delete admin
    auth_repo.delete_admin(db, admin_id)

    return {
        "message": f"Admin {target['EMAIL']} supprimé avec succès."
    }