# CAPTCHA Setup Guide

This guide explains how to set up Google reCAPTCHA v3 for the Event-Reporting-Platform sign-in page.

## Step 1: Get Google reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account (create one if needed)
3. Click the **"+" button** to create a new site
4. Fill out the form:
   - **Label**: Event-Reporting-Platform (or any name you prefer)
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**: Add your domain (for local development: `localhost`)
   - Accept the terms and click **Submit**

5. You'll receive:
   - **Site Key** (public key)
   - **Secret Key** (private key - keep this confidential)

## Step 2: Frontend Configuration

In `frontend/home.html`, replace the placeholder with your Site Key:

```html
<!-- Replace YOUR_RECAPTCHA_SITE_KEY with your actual site key -->
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_RECAPTCHA_SITE_KEY"></script>
```

Example:
```html
<script src="https://www.google.com/recaptcha/api.js?render=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></script>
```

In `frontend/js/home.js`, replace the placeholder in the login form submission:

```javascript
const captchaToken = await grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', { action: 'login' });
```

## Step 3: Backend Configuration

### Option A: Using Environment Variables (Recommended)

1. In your backend folder, create a `.env` file:
```
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

2. Install dotenv if not already installed:
```bash
npm install dotenv
```

3. In `backend/src/app.js` or `backend/src/index.js`, add at the top:
```javascript
import dotenv from 'dotenv';
dotenv.config();
```

The backend code already reads from `process.env.RECAPTCHA_SECRET_KEY`.

### Option B: Direct Configuration (Less Secure)

In `backend/src/controllers/login.controllers.js`, replace the placeholder:

```javascript
const secretKey = 'YOUR_RECAPTCHA_SECRET_KEY';
```

Example:
```javascript
const secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
```

## Step 4: Test the Setup

1. Start your backend server
2. Open the application in your browser
3. Click "Sign In" on either Participant or Admin sections
4. Try logging in - the CAPTCHA will be verified invisibly
5. Check the browser console for any errors

## Understanding reCAPTCHA v3 Score

- **1.0**: Very likely a legitimate user
- **0.5**: Neutral
- **0.0**: Very likely a bot

The current configuration accepts scores above **0.5**. You can adjust this threshold in `login.controllers.js`:

```javascript
return data.success && data.score > 0.5;  // Change 0.5 to your preferred threshold
```

## Troubleshooting

### "grecaptcha is not defined"
- Ensure the reCAPTCHA script is properly loaded in the `<head>` of `home.html`
- Check that your Site Key is correct

### "CAPTCHA verification failed"
- Verify your Secret Key is correct in the backend
- Check that your domain is whitelisted in the reCAPTCHA console
- For localhost development, make sure `localhost` is added to registered domains

### API Error Messages
- Check the browser console for detailed error information
- Verify the reCAPTCHA keys match between frontend and backend
- Ensure the backend can access Google's verification API

## Security Notes

1. **Never commit Secret Key to version control** - Use environment variables
2. Keep your Secret Key confidential - only use it on the backend
3. Regularly review reCAPTCHA analytics in your Google account
4. Monitor suspicious activity patterns in your login attempts

## Additional Resources

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [Security Best Practices](https://developers.google.com/recaptcha/docs/v3)
