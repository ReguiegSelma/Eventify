# =========================================================
# app/features/auth/repository.py
# =========================================================

from app.database import get_cursor


def get_admin_by_email(db, email: str) -> dict | None:
    """
    Cherche un admin par son email
    Retourne: dict ou None
    """

    cursor = get_cursor(db)

    cursor.execute(
        """
        SELECT 
            ID_ADMIN,
            EMAIL,
            PASSWORD AS PASSWORD_HASH,
            ROLE_ADMIN
        FROM ADMIN
        WHERE EMAIL = %s
        """,
        (email,)
    )

    admin = cursor.fetchone()

    cursor.close()

    return admin


def get_all_admins(db) -> list:
    """
    Retourne tous les admins
    """

    cursor = get_cursor(db)

    cursor.execute(
        """
        SELECT 
            ID_ADMIN,
            EMAIL,
            ROLE_ADMIN
        FROM ADMIN
        ORDER BY ID_ADMIN ASC
        """
    )

    admins = cursor.fetchall()

    cursor.close()

    return admins


def create_admin(db, email: str, password_hash: str, role: str) -> int:
    """
    Crée un nouvel admin
    """

    cursor = get_cursor(db)

    cursor.execute(
        """
        INSERT INTO ADMIN (EMAIL, PASSWORD, ROLE_ADMIN)
        VALUES (%s, %s, %s)
        """,
        (email, password_hash, role)
    )

    db.commit()

    new_id = cursor.lastrowid

    cursor.close()

    return new_id


def delete_admin(db, admin_id: int) -> bool:
    """
    Supprime un admin
    """

    cursor = get_cursor(db)

    cursor.execute(
        "DELETE FROM ADMIN WHERE ID_ADMIN = %s",
        (admin_id,)
    )

    db.commit()

    deleted = cursor.rowcount > 0

    cursor.close()

    return deleted