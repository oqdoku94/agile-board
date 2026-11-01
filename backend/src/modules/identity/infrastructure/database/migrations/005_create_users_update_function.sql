CREATE OR REPLACE FUNCTION auth.users_update_function(
    p_id UUID,
    p_email VARCHAR(255),
    p_first_name VARCHAR(100),
    p_last_name VARCHAR(100),
    p_password_hash TEXT
) RETURNS auth.users AS
$$
DECLARE
    v_user auth.users;
BEGIN
    UPDATE auth.users
    SET email = p_email,
        first_name = p_first_name,
        last_name = p_last_name,
        password_hash = p_password_hash,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING * INTO v_user;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Пользователь не найден.'
            USING ERRCODE = 'P1001';
    END IF;

    return v_user;
END;
$$ LANGUAGE plpgsql;