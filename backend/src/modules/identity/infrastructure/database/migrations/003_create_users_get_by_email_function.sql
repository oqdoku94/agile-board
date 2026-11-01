CREATE OR REPLACE FUNCTION auth.users_get_by_email_function(
    p_email VARCHAR(255)
)
    RETURNS SETOF auth.users AS $$
BEGIN
    RETURN QUERY
        SELECT *
        FROM auth.users u
        WHERE u.email = p_email;
END;
$$ LANGUAGE plpgsql;