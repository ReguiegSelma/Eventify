from app.database import get_cursor


def get_all_users(db):

    cursor = get_cursor(db)

    cursor.execute("""
    SELECT 
        ID_USER,
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        DISCORD_USERNAME,
        UNIVERSITY,
        FIELD_OF_STUDY,
        ROLE
    FROM USERS
    """)

    return cursor.fetchall()