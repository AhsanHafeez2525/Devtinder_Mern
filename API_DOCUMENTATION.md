# API Documentation

## Authentication Endpoints

### 1. Generate OTP
**POST** `/generate-otp`

Generates a 6-digit OTP for the specified email address.

**Request Body:**
```json
{
  "emailId": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If the email exists in our system, you will receive an OTP.",
  "otp": "123456"
}
```

**Validation:**
- Email must be valid format
- Email is required

---

### 2. Verify OTP
**POST** `/verify-otp`

Verifies the 6-digit OTP for the specified email address.

**Request Body:**
```json
{
  "emailId": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "OTP verified successfully",
  "data": {
    "emailId": "user@example.com"
  }
}
```

**Validation:**
- Email must be valid format
- Email is required
- OTP must be exactly 6 digits
- OTP is required

**Error Response:**
```json
{
  "error": "Invalid or expired OTP"
}
```

---

### 3. Change Password
**POST** `/change-password`

Changes the password for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123!",
  "newPassword": "newPassword456!"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

**Validation:**
- Current password and new password are required
- New password must be different from current password
- New password must be strong (8+ chars, uppercase, lowercase, number, symbol)

**Error Responses:**
```json
{
  "error": "Current password is incorrect"
}
```

```json
{
  "error": "New password must be different from current password"
}
```

---

## Existing Endpoints

### 4. Sign Up
**POST** `/signup`

### 5. Login
**POST** `/login`

### 6. Logout
**POST** `/logout`

### 7. Forgot Password
**POST** `/forgot-password`

---

## Database Schema Updates

The User model now includes additional fields for OTP functionality:

```javascript
{
  // ... existing fields
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  }
}
```

## Security Features

1. **OTP Expiration**: OTPs expire after 10 minutes
2. **OTP Cleanup**: OTPs are cleared after successful verification
3. **Password Validation**: Strong password requirements enforced
4. **Authentication Required**: Change password requires valid JWT token
5. **Security Headers**: No sensitive information revealed in error messages

## Usage Examples

### Generate and Verify OTP Flow:
1. Call `/generate-otp` with email
2. User receives OTP (via SMS/email in production)
3. Call `/verify-otp` with email and OTP
4. OTP is verified and cleared

### Change Password Flow:
1. User must be logged in (valid JWT token)
2. Call `/change-password` with current and new password
3. Password is updated after validation

## Development Notes

- OTP is returned in response for development/testing only
- Remove OTP from response in production
- Implement actual SMS/email sending in production
- Consider rate limiting for OTP generation
- Add logging for security monitoring
