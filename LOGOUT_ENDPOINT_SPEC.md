# Logout Endpoint Specification

## Required Backend Endpoint

### Endpoint Details
- **URL**: `POST /api/schedulr/google-auth/logout`
- **Method**: POST
- **Authentication**: Cookies (withCredentials: true)
- **Content-Type**: application/json

### Request
```typescript
// No body required, authentication via cookies
{}
```

### Response
```typescript
// Success Response (200)
{
  "message": "Logged out successfully"
}

// Error Response (500)
{
  "error": "Logout failed",
  "message": "Unable to process logout request"
}
```

### Backend Implementation Requirements

1. **Clear server-side session data**
   - Remove or invalidate session tokens
   - Clear any cached user data
   - Invalidate refresh tokens if applicable

2. **Clear authentication cookies**
   - Clear session cookies
   - Clear any auth-related cookies
   - Set cookie expiration to past date

3. **Google Auth Integration** (if applicable)
   - Revoke Google access tokens if needed
   - Clean up any Google-specific session data

### Example Implementation (Node.js/Express)

```javascript
app.post('/api/schedulr/google-auth/logout', async (req, res) => {
  try {
    // Clear session data
    req.session.destroy();
    
    // Clear cookies
    res.clearCookie('session');
    res.clearCookie('auth-token');
    
    // Optional: Revoke Google tokens
    // await googleAuthClient.revokeCredentials();
    
    res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      error: "Logout failed",
      message: "Unable to process logout request"
    });
  }
});
```

### Frontend Implementation Status
✅ **COMPLETED** - Frontend logout functionality is fully implemented:
- Logout button in sidebar
- **Confirmation dialog** before logout (prevents accidental logouts)
- Loading state during logout process
- API call to backend logout endpoint
- User state cleanup
- Toast notifications (success/error)
- Automatic redirect to login page
- Error handling with user feedback
- Dialog can be cancelled or confirmed

### Testing
Test the logout flow by:
1. Login to the application
2. Click the "Log Out" button in the sidebar
3. **Verify confirmation dialog appears** with "Confirm Logout" title
4. **Test Cancel**: Click "Cancel" → Dialog closes, user stays logged in
5. **Test Confirm**: Click "Log Out" → Loading state appears
6. Verify success toast shows "Logged out successfully"
7. Verify dialog closes automatically
8. Verify redirect to `/auth` page after 1.5s delay
9. Verify user cannot access protected routes
10. Verify session is completely cleared
11. **Test Error Handling**: With network issues, verify error toast shows
