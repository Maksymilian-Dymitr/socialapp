# New Frontend Setup Instructions

The new frontend has been created in the `frontend-new` directory. To complete the setup:

## 1. Install Dependencies
```bash
cd frontend-new
npm install
```

## 2. Start Development Server
```bash
npm run dev
```

## 3. Replace Old Frontend
Once you've verified the new frontend works:
1. Delete the old `frontend` directory
2. Rename `frontend-new` to `frontend`

## New Frontend Features
- Modern React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- React Query for state management
- Radix UI components
- Axios for API calls
- Responsive design
- Authentication flow
- Profile pages
- Feed functionality

## API Integration
The frontend is configured to connect to the backend at `http://localhost:3000` with the following endpoints:
- POST `/register` - User registration
- POST `/login` - User login
- POST `/toggle-follow/:username` - Follow/unfollow users
- POST `/create` - Create posts
- GET `/feed` - Get user feed

## Pages
- `/login` - Login page
- `/register` - Registration page
- `/` - Home feed (requires auth)
- `/profile/:username` - User profile page
