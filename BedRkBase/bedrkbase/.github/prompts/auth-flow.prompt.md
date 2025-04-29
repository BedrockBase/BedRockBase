# Generate Authentication/Authorization Flow

Your goal is to implement secure authentication and authorization features using Supabase.

Requirements:
* Use Supabase Auth client for authentication
* Implement proper session management
* Add secure role-based access control
* Include proper error handling
* Add comprehensive logging
* Implement security best practices
* Add proper TypeScript types
* Include rate limiting for auth endpoints

Reference files:
* Supabase Client: [../../lib/supabaseClient.ts](../../lib/supabaseClient.ts)
* Auth Context: [../../contexts/AuthContext.tsx](../../contexts/AuthContext.tsx)
* Protected Route: [../../components/ProtectedRoute.tsx](../../components/ProtectedRoute.tsx)

Security Considerations:
* Implement proper token handling
* Add refresh token rotation
* Include session timeout handling
* Add proper password policies
* Implement MFA where required
* Add proper audit logging
* Include brute force protection
* Implement proper CORS policies

Ask for:
1. Authentication type (signup/signin/reset/etc)
2. Required user data
3. Role requirements
4. Security requirements
5. Error handling needs
6. Audit logging requirements