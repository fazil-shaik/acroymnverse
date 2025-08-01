# AcronymVerse 🚀

**Unlock the world of acronyms! Discover, create, and share the coolest abbreviations Gen Z style.**

A modern web application built with Next.js that allows users to discover trending acronyms, search for meanings, and engage with a community of language enthusiasts.


## ✨ Features

### 🔥 **Core Features**
- **Acronym Search**: Discover meanings of trending acronyms and abbreviations
- **AI-Powered Explanations**: Get detailed explanations powered by Google's Gemini AI
- **Real-time Search**: Instant search results with smart suggestions
- **Trending Acronyms**: Stay updated with the hottest acronyms everyone's using

### 🎨 **User Experience**
- **Dark/Light Theme**: Toggle between beautiful dark and light themes
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Mobile-First**: Optimized for mobile users with touch-friendly interactions

### 🔐 **Authentication & Profile**
- **Secure Authentication**: Powered by Clerk for robust user management
- **User Profiles**: Personalized user profiles with search history
- **Protected Routes**: Secure access to dashboard and profile features

### 🚀 **Coming Soon**
- **Create Your Own**: Submit and share custom acronyms
- **Community Vibes**: Vote, comment, and connect with fellow enthusiasts
- **Leaderboards**: Compete with other users
- **Categories**: Browse acronyms by topics

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 (App Router),
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Animations**: Framer Motion
- **State Management**: React Hooks

### **Backend & Database**
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **API**: Next.js API Routes
- **AI Integration**: Google Gemini AI

### **Authentication & Deployment**
- **Auth**: Clerk Authentication
- **Deployment**: Vercel (recommended)
- **Version Control**: Git & GitHub

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- Clerk account
- Google Gemini API key

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/fazil-shaik/acroymnverse.git
cd acroymnverse/myapp
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Database
MONGODB_URI=your_mongodb_connection_string
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
myapp/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── acronyms/            # Acronym-related endpoints
│   │   └── search/              # Search functionality
│   ├── dashboard/               # Dashboard page
│   ├── profile/                 # User profile page
│   ├── sign-in/                 # Authentication pages
│   ├── sign-up/
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # Reusable components
│   ├── AcronymSearch.tsx        # Main search component
│   ├── ThemeProvider.tsx        # Theme context provider
│   └── ui/                      # UI components
├── lib/                         # Utility functions
│   ├── mongodb.ts               # Database connection
│   └── utils.ts                 # Helper functions
├── models/                      # Database models
│   └── Acronym.ts               # Acronym schema
├── public/                      # Static assets
└── types/                       # TypeScript type definitions
```

## 🎯 Key Components

### **AcronymSearch Component**
The heart of the application featuring:
- Real-time search with debouncing
- AI-powered explanations
- Responsive grid layout
- Loading states and error handling

### **Theme Provider**
Manages dark/light theme switching with:
- System preference detection
- Persistent theme storage
- Smooth transitions

### **Authentication Flow**
Secure user management with:
- Sign up/Sign in flows
- Protected routes
- User session management


## 🎨 Design System

### **Colors**
- **Primary**: Pink to Teal gradient (`from-pink-500 to-teal-500`)
- **Dark Theme**: Gray-800 backgrounds with accent colors
- **Light Theme**: White/Gray-100 backgrounds

### **Typography**
- **Headings**: Bold, responsive font sizes
- **Body**: Clean, readable text with proper contrast
- **Interactive**: Hover effects and smooth transitions

### **Responsive Breakpoints**
- **Mobile**: Base (320px+)
- **Tablet**: sm (640px+), md (768px+)
- **Desktop**: lg (1024px+), xl (1280px+)

## 🚀 Deployment

### **Vercel Deployment**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### **Environment Variables**
Make sure to add all required environment variables in your deployment platform.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain responsive design principles
- Add proper error handling
- Write meaningful commit messages

## 📱 Mobile Responsiveness

AcronymVerse is built mobile-first with:
- **Responsive Navigation**: Hamburger menu for mobile
- **Touch-Friendly**: Proper touch targets and gestures
- **Optimized Performance**: Fast loading on mobile networks
- **Adaptive UI**: Components that work well on all screen sizes

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🐛 Troubleshooting

### **Common Issues**

1. **Build Errors**
   - Check TypeScript types
   - Verify environment variables
   - Clear `.next` folder and rebuild

2. **Authentication Issues**
   - Verify Clerk configuration
   - Check environment variables
   - Ensure proper redirect URLs

3. **Database Connection**
   - Verify MongoDB URI
   - Check network connectivity
   - Ensure database permissions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Fazil Shaik**
- GitHub: [@fazil-shaik](https://github.com/fazil-shaik)
- Project: [AcronymVerse](https://github.com/fazil-shaik/acroymnverse)

## 🙏 Acknowledgments

- **Clerk** for authentication services
- **Google Gemini AI** for AI-powered explanations
- **Vercel** for hosting and deployment
- **MongoDB** for database services
- **Next.js** team for the amazing framework

---

<div align="center">

**Built with ❤️ by Fazil Shaik**

[Live Demo](https://acroymnverse.vercel.app) • [Report Bug](https://github.com/fazil-shaik/acroymnverse/issues) • [Request Feature](https://github.com/fazil-shaik/acroymnverse/issues)

</div>
