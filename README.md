# ResumeMaker - Professional Resume Builder

![Status](https://img.shields.io/badge/status-production-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Node.js](https://img.shields.io/badge/Node.js-v18-blue)
![React](https://img.shields.io/badge/React-18-blue)

## Live Demo
🚀 **Frontend**: https://resume-maker-co.netlify.app/
🔗 **Backend**: https://resume-maker-backend.onrender.com  
📊 **Database**: MongoDB Atlas (resumemaker.myex2ke.mongodb.net)

---

## Features

✅ **User Authentication**
- Real MongoDB-based signup & login
- JWT tokens (7-day expiry)
- Password hashing with bcryptjs
- Email uniqueness validation

✅ **Resume Builder**
- Multiple templates
- Drag-and-drop interface
- Real-time preview
- Export functionality

✅ **Security**
- CORS protection
- Secure password hashing
- JWT token validation
- Environment variable configuration

---

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- jsonwebtoken

### Deployment
- **Frontend**: Netlify
- **Backend**: Render.com
- **Database**: MongoDB Atlas

---

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB URI (included)
- git

### Local Development

1. **Clone Repository**
```bash
git clone https://github.com/Sirichandanakota/resume-maker.git
cd resume-maker
```

2. **Install & Start Backend**
```bash
cd BACKEND
npm install
npm run dev
```

3. **Install & Start Frontend** (new terminal)
```bash
cd FRONTEND
npm install
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Signup: Create new account
- Login: Use credentials from signup

---

## Deployment

### Deploy to Netlify (Frontend)
```bash
# Automatic on push to main branch
# Or manual:
cd FRONTEND
npm run build
netlify deploy --prod
```

### Deploy to Render (Backend)
1. Push to GitHub
2. Connect repository at render.com
3. Set environment variables (see DEPLOYMENT_GUIDE.md)
4. Auto-deploy on push

### Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb+srv://kotasirichandana7:chandana2082@resumemaker.myex2ke.mongodb.net/resumemaker
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
```

**Frontend (.env.production)**
```
VITE_API_URL=https://resume-maker-backend.onrender.com
```

---

## API Endpoints

### Authentication
```
POST /api/auth/signup      - Create new user
POST /api/auth/login       - Login & get JWT token
GET  /api/health           - Health check
```

### Request/Response Examples

**Signup**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Project Structure

```
resume-maker/
├── BACKEND/
│   ├── server.js           # Express server & MongoDB connection
│   ├── models/
│   │   └── User.js         # User schema with password hashing
│   ├── routes/
│   │   └── auth.js         # Signup & Login endpoints
│   ├── middleware/
│   │   └── auth.js         # JWT verification
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
│
├── FRONTEND/
│   ├── resume.jsx          # Main React app with LoginPage, SignUpPage
│   ├── vite.config.js      # Vite configuration
│   └── package.json        # Frontend dependencies
│
├── netlify.toml            # Netlify deployment config
├── Dockerfile              # Docker setup for backend
├── DEPLOYMENT_GUIDE.md     # Complete deployment instructions
└── README.md               # This file
```

---

## MongoDB Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Testing

### Test Signup
1. Open https://resume-maker.netlify.app
2. Click "Sign Up"
3. Enter name, email, password
4. Verify success message
5. Check MongoDB for user document

### Test Login
1. Click "Sign In"
2. Enter same email & password
3. Verify JWT token in localStorage
4. Verify redirect to templates

### Test API Directly
```bash
# Health check
curl https://resume-maker-backend.onrender.com/api/health

# Signup
curl -X POST https://resume-maker-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test123"}'

# Login
curl -X POST https://resume-maker-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}'
```

---

## Troubleshooting

### Issue: "Failed to fetch" error
- Check backend URL in frontend .env
- Verify backend is running
- Check CORS configuration
- Check browser console for actual error

### Issue: "User already exists"
- Email already registered in MongoDB
- Use different email or login with existing account

### Issue: "Invalid credentials"
- Email doesn't exist in MongoDB
- Password is incorrect
- Case-sensitive email check

### Issue: MongoDB connection failed
- Verify MONGODB_URI in .env
- Check MongoDB Atlas IP whitelist
- Verify database name (resumemaker)

---

## Security Best Practices

✅ **Implemented**
- Password hashing (bcryptjs, 10 rounds)
- JWT token authentication
- CORS protection
- Environment variables for secrets
- Email uniqueness validation
- Secure cookie/token storage

✅ **Recommended for Production**
- HTTPS only
- Rate limiting
- Input validation & sanitization
- CORS whitelist specific domains
- Refresh tokens
- Password reset functionality
- Email verification

---

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

MIT License - feel free to use for personal and commercial projects

---

## Support & Contact

- 📧 Email: kotasirichandana7@example.com
- 🐙 GitHub: https://github.com/Sirichandanakota
- 🌐 Website: resumemaker.netlify.app

---

## Changelog

### v1.0.0 (Current)
- ✅ Real MongoDB authentication
- ✅ JWT token generation
- ✅ Password hashing
- ✅ Netlify deployment
- ✅ Email uniqueness validation

---

**Last Updated**: March 31, 2026  
**Status**: ✅ Production Ready
