# Event-Reporting-Platform

A comprehensive event management platform with secure user authentication, event booking, and administrative features. This application includes Google reCAPTCHA v3 protection for enhanced security.

## Features

- **User Authentication**: Secure sign-up and sign-in with email and password
- **CAPTCHA Protection**: Google reCAPTCHA v3 for bot prevention
- **Event Management**: Browse, search, filter, and register for events
- **Admin Dashboard**: Manage events, venues, clubs, and user registrations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Statistics**: Display active events, clubs, and venues

## Project Structure

```
Event-Reporting-Platform/
├── backend/                    # Node.js/Express REST API
│   ├── src/
│   │   ├── app.js             # Express application setup
│   │   ├── index.js           # Server entry point
│   │   ├── config/
│   │   │   └── database.js    # MongoDB connection
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # MongoDB schemas
│   │   └── routes/            # API endpoints
│   ├── package.json
│   └── .env
│
├── frontend/                   # Static HTML/CSS/JS
│   ├── home.html              # Landing page with auth forms
│   ├── css/                   # Stylesheets
│   ├── js/                    # Client-side logic
│   ├── pages/                 # User and admin pages
│   └── assets/                # Images and media
│
├── CAPTCHA_SETUP.md          # Detailed CAPTCHA configuration guide
└── README.md                 # This file
```

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (running locally or cloud instance)
- **Google Account** (for reCAPTCHA keys)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mandalabharathmandala-cpu/Event-Reporting-Platform.git
cd Event-Reporting-Platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```bash
cp ../.env.example .env
```

Update `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/event-reporting-platform
PORT=3000
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 3. Frontend Setup

No build process required - the frontend is static HTML/CSS/JS. Just ensure it points to the correct backend API URL.

## Running the Application

### Start MongoDB

```bash
# If using MongoDB locally
mongod
```

### Start Backend Server

```bash
cd backend
npm run dev    # Development with auto-reload
# or
npm start      # Production
```

The server will start on `http://localhost:3000`

### Access Frontend

Open `frontend/home.html` in your browser or serve it with a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server frontend
```

Then navigate to `http://localhost:8000` or the displayed URL.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "registerRole": "participant|admin",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123",
    "captchaToken": "token_from_google"
  }
  ```

### Events

- `GET /api/events/menu` - Get all events
- `POST /api/events/create` - Create new event (admin only)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

## CAPTCHA Setup

For detailed instructions on setting up Google reCAPTCHA v3, see [CAPTCHA_SETUP.md](CAPTCHA_SETUP.md).

**Quick Start:**
1. Get your reCAPTCHA keys from [Google reCAPTCHA Console](https://www.google.com/recaptcha/admin)
2. Replace `YOUR_RECAPTCHA_SITE_KEY` in `frontend/home.html` and `frontend/js/home.js`
3. Add `RECAPTCHA_SECRET_KEY` to backend `.env` file

## Security Features

- ✅ Google reCAPTCHA v3 protection on login
- ✅ Password hashing (implement bcrypt for production)
- ✅ CORS headers for API security
- ✅ Environment variables for sensitive data
- ✅ Input validation on backend

## Environment Variables

Create a `.env` file in the `backend` folder with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/event-reporting-platform
DB_NAME=event-reporting-platform

# Server
PORT=3000
NODE_ENV=development

# Security
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Client
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify database name matches configuration

### CAPTCHA Verification Failed
- Verify your reCAPTCHA keys are correct
- Check that your domain is registered in reCAPTCHA console
- For localhost, ensure `localhost` is in the domains list

### CORS Errors
- Backend CORS is configured to allow all origins
- Verify the API URL in frontend matches backend location
- Check that backend is running on correct port

### Port Already in Use
```bash
# To use a different port, set in .env
PORT=4000

# Or kill the process using the port
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -i :3000
```

## Development Workflow

1. **Make changes** to frontend HTML/CSS/JS files
2. **Test locally** by opening files in browser or serving with a local server
3. **For backend changes**, restart the server (`npm run dev` auto-reloads)
4. **Commit changes**: 
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

## Best Practices

- ✅ Never commit `.env` files with real keys
- ✅ Use `.env.example` as a template for configuration
- ✅ Always verify reCAPTCHA is enabled before deploying
- ✅ Test authentication on both participant and admin roles
- ✅ Keep dependencies updated: `npm update`

## Deployment

For production deployment:

1. **Environment Setup**
   - Use a production MongoDB instance (MongoDB Atlas)
   - Set `NODE_ENV=production`
   - Use a strong secret for reCAPTCHA

2. **Frontend**
   - Host on Netlify, Vercel, or GitHub Pages
   - Update API URLs to production backend

3. **Backend**
   - Deploy to Heroku, AWS, DigitalOcean, or similar
   - Set environment variables on hosting platform
   - Use HTTPS for all communications

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

ISC License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check [CAPTCHA_SETUP.md](CAPTCHA_SETUP.md) for CAPTCHA-related questions
- Review existing issues for solutions

## Authors

- **Bharath Mandala** - Event-Reporting-Platform
- Based on Event-Management-and-Reporting-System by Prashanth Sakapuram

---

**Last Updated:** February 8, 2026
