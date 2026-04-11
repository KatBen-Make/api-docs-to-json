# Security Improvements - Session-Based Authentication

This application now uses secure session-based authentication instead of storing credentials in localStorage.

## What Changed

### Server-Side Security Improvements
- **Session Management**: Uses `cookie-session` middleware for secure session handling
- **HTTP-Only Cookies**: Prevents XSS attacks by making cookies inaccessible to JavaScript
- **CSRF Protection**: Uses `sameSite: 'strict'` cookie setting
- **Secure Cookies**: Automatically enabled in production (HTTPS only)
- **Session Expiration**: 24-hour session timeout
- **Authentication Middleware**: Protects API endpoints requiring authentication

### Client-Side Security Improvements
- **No Credential Storage**: No longer stores sensitive tokens in localStorage
- **Automatic Session Management**: Sessions are handled transparently via cookies
- **Credentials in Requests**: All API calls include `credentials: 'include'` for session cookies

## Environment Variables

Add these to your `.env` file:

```env
SESSION_SECRET=your-very-secure-random-string-change-this-in-production
FRONTEND_URL=https://your-frontend-domain.com  # For production CORS
```

## Security Features

1. **Session-Based Authentication**: User tokens are stored server-side in encrypted sessions
2. **HTTP-Only Cookies**: Prevents client-side access to session data
3. **CSRF Protection**: SameSite cookie policy prevents cross-site request forgery
4. **Secure Transport**: Cookies are only sent over HTTPS in production
5. **Session Expiration**: Automatic logout after 24 hours of inactivity
6. **Protected Routes**: API endpoints require valid session

## API Endpoints

- `POST /api/auth/login` - Authenticate with token, creates session
- `POST /api/auth/logout` - Destroys session
- `GET /api/auth/me` - Check current authentication status
- `POST /api/data` - Protected endpoint requiring authentication

## Production Deployment Notes

1. Set `NODE_ENV=production`
2. Use a strong, random `SESSION_SECRET`
3. Configure `FRONTEND_URL` for proper CORS
4. Ensure HTTPS is enabled (required for secure cookies)
