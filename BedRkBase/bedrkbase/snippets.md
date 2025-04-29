## Key DB Logic: Establishment Access Function

**File:** database/create_get_all_establishments_for_user.sql

```sql
-- Returns all establishments accessible to a user (owner or via access table)
-- Parameter is named p_user_id to avoid ambiguity with table columns
CREATE OR REPLACE FUNCTION public.get_all_establishments_for_user(p_user_id UUID)
RETURNS TABLE (...)
AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'user_id cannot be null';
    END IF;

    RETURN QUERY
    SELECT ...
    FROM public.establishment e
    WHERE
        e.owner_id = p_user_id
        OR EXISTS (
            SELECT 1
            FROM public.establishment_access ea
            WHERE ea.establishment_id = e.id
              AND ea.user_id = p_user_id
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Notes:**
- Always use a unique parameter name (e.g., p_user_id) to avoid ambiguity in subqueries.
- Reference: [database/create_get_all_establishments_for_user.sql](database/create_get_all_establishments_for_user.sql)
- Update this snippet if the function logic changes.
