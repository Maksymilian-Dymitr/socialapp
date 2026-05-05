# Quick Start - Production API Frontend

## Frontend Setup (Production API)

The frontend is now configured to use the production API at `https://socialapp-u7hp.onrender.com`

### Install and Run Frontend

```bash
cd frontend-new
bun install
bun run dev
```

The frontend will run on `http://localhost:5173`

### What's Configured

✅ **API URL**: `https://socialapp-u7hp.onrender.com`
✅ **Modern React 18** with TypeScript
✅ **Tailwind CSS** for styling
✅ **React Router** for navigation
✅ **React Query** for API calls
✅ **Authentication flow** with JWT tokens

### Features

- **Login/Register** pages
- **Home Feed** with post creation
- **User Profiles** with follow functionality
- **Responsive design**
- **Modern UI components**

### API Endpoints Used

- POST `/register` - User registration
- POST `/login` - User authentication
- POST `/create` - Create posts
- GET `/feed` - Get user feed
- POST `/toggle-follow/:username` - Follow/unfollow users

### Next Steps

1. Install dependencies: `cd frontend-new && bun install`
2. Start development server: `bun run dev`
3. Open `http://localhost:5173` in your browser
4. Test registration and login functionality

The frontend is ready to work with your existing production API!
