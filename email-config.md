# Email Configuration Setup

To enable OTP email delivery, you need to set up the following environment variables:

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/devtinder

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=5000

# Email Configuration
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password_here

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password (not your regular Gmail password) in `EMAIL_APP_PASSWORD`

## Important Notes

- Replace `your_gmail_address@gmail.com` with your actual Gmail address
- Replace `your_gmail_app_password_here` with the generated app password
- The app password is different from your regular Gmail password
- Make sure to keep your `.env` file secure and never commit it to version control
