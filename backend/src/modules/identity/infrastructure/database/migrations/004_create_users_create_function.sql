CREATE OR REPLACE FUNCTION auth.users_create_function(
    p_email VARCHAR(255),
    p_first_name VARCHAR(100),
    p_last_name VARCHAR(100),
    p_password_hash TEXT
)
    RETURNS auth.users AS
$$
DECLARE
    v_user auth.users;
BEGIN
    INSERT INTO auth.users(email, first_name, last_name, password_hash)
    VALUES (p_email, p_first_name, p_last_name, p_password_hash)
    RETURNING * INTO v_user;

    RETURN  v_user;
END;
$$ LANGUAGE plpgsql;