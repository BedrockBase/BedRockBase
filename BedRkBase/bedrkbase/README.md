## Key Database Logic: Establishment Access

- The function `public.get_all_establishments_for_user(user_id UUID)` returns all establishments a user can access (either as owner or via the access table).
- The parameter is named `user_id` to avoid ambiguity with table columns in subqueries.
- See [snippets.md](snippets.md) for a code snippet and explanation.
- Full implementation: [database/create_get_all_establishments_for_user.sql](database/create_get_all_establishments_for_user.sql)

**If you update the function logic, update both `snippets.md` and this README.**
