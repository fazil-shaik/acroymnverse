"use client";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Moon, Sun, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  const handleGetStartedSignedOut = () => {
    router.push("/sign-in");
  };

  return (
    <>
      {/* Header with Sign Up and Sign In */}
      <header className={`w-full flex justify-between items-center py-6 px-8 backdrop-blur-lg shadow-lg fixed top-0 left-0 z-10 transition-colors duration-300
        ${theme === 'dark' 
          ? 'bg-gray-900/80 border-b border-gray-700' 
          : 'bg-white/80'
        }`}>
        <h2 className={`text-2xl font-bold drop-shadow transition-colors duration-300
          ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          AcronymVerse 🚀
        </h2>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-300
              ${theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <SignedOut>
            <SignUpButton>
              <button className="bg-gradient-to-r from-pink-500 to-teal-500 text-white font-semibold py-2 px-6 rounded-full shadow hover:from-pink-600 hover:to-teal-600 transition">
                Sign Up
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="bg-gradient-to-r from-teal-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-full shadow hover:from-teal-600 hover:to-pink-600 transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="bg-gradient-to-r from-pink-500 to-teal-500 text-white font-semibold py-2 px-6 rounded-full shadow hover:from-pink-600 hover:to-teal-600 transition">
              Dashboard
            </Link>
            <Link href="/profile" className="bg-gradient-to-r from-teal-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-full shadow hover:from-teal-600 hover:to-pink-600 transition">
              Profile
            </Link>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: theme === 'dark' ? "bg-gray-800 shadow-lg" : "bg-white shadow-lg",
                  userButtonPopoverActions: theme === 'dark' ? "text-gray-200" : "text-gray-700"
                }
              }}
            />
          </SignedIn>
        </div>
      </header>
      <div className={`flex flex-col items-center justify-center min-h-screen px-4 animate-gradient-move pt-24 transition-colors duration-300
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-custom-dark via-custom-pink to-custom-green' 
          : 'bg-gradient-to-br from-custom-green via-custom-pink to-custom-dark'
        }`}>
        <h1 className={`text-5xl font-extrabold mb-4 drop-shadow-lg text-center animate-text-pop transition-colors duration-300
          ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          AcronymVerse 🚀
        </h1>
        <p className={`text-xl mb-8 text-center max-w-xl animate-fade-in transition-colors duration-300
          ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
          Unlock the world of acronyms! Discover, create, and share the coolest abbreviations Gen Z style. Level up your lingo, flex your creativity, and vibe with the community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-4xl">
          <div className="bg-white bg-opacity-60 rounded-xl p-6 shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-card-bounce">
            <span className="text-3xl mb-2 animate-emoji-bounce">🔥</span>
            <h2 className="font-bold text-lg mb-1 text-green-700">Trending Acronyms</h2>
            <p className="text-center text-sm text-black">Stay updated with the hottest acronyms everyone’s using right now.</p>
          </div>
          <div className="bg-white bg-opacity-60 rounded-xl p-6 shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-card-bounce">
            <span className="text-3xl mb-2 animate-emoji-bounce">🎨</span>
            <h2 className="font-bold text-lg mb-1 text-teal-700">Create Your Own</h2>
            <p className="text-center text-sm text-black">Invent new acronyms and share your unique style with the world.</p>
          </div>
          <div className="bg-white bg-opacity-60 rounded-xl p-6 shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-card-bounce">
            <span className="text-3xl mb-2 animate-emoji-bounce">🤝</span>
            <h2 className="font-bold text-lg mb-1 text-gray-700">Community Vibes</h2>
            <p className="text-center text-sm text-black">Vote, comment, and connect with fellow acronym lovers.</p>
          </div>
        </div>
        <SignedOut>
          <button
            onClick={handleGetStartedSignedOut}
            className="bg-gradient-to-r from-gray-400 via-green-400 to-teal-400 text-black font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 hover:bg-gradient-to-l transition-all duration-300 mb-6 animate-btn-pop"
          >
            Get Started
          </button>
        </SignedOut>
        <SignedIn>
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-gray-400 via-green-400 to-teal-400 text-black font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 hover:bg-gradient-to-l transition-all duration-300 mb-6 animate-btn-pop"
          >
            Go to Dashboard
          </button>
        </SignedIn>
        <div className="flex gap-4 mt-4">
          <span className="bg-white bg-opacity-60 px-4 py-2 rounded-full text-sm text-green-700 animate-tag-float">#GenZ</span>
          <span className="bg-white bg-opacity-60 px-4 py-2 rounded-full text-sm text-teal-700 animate-tag-float">#AcronymLife</span>
          <span className="bg-white bg-opacity-60 px-4 py-2 rounded-full text-sm text-gray-700 animate-tag-float">#VibeCheck</span>
        </div>
        <style jsx>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-move {
            background-size: 200% 200%;
            animation: gradientMove 8s ease infinite;
          }
          @keyframes textPop {
            0% { transform: scale(0.9); opacity: 0; letter-spacing: -2px;}
            60% { transform: scale(1.08); opacity: 1; letter-spacing: 2px;}
            100% { transform: scale(1); letter-spacing: 0;}
          }
          .animate-text-pop {
            animation: textPop 1.2s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in {
            animation: fadeIn 1.5s ease;
          }
          @keyframes cardBounce {
            0% { transform: scale(0.95);}
            60% { transform: scale(1.05);}
            100% { transform: scale(1);}
          }
          .animate-card-bounce {
            animation: cardBounce 1.2s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes emojiBounce {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-10px);}
          }
          .animate-emoji-bounce {
            animation: emojiBounce 1.5s infinite;
          }
          @keyframes btnPop {
            0% { transform: scale(0.9);}
            60% { transform: scale(1.08);}
            100% { transform: scale(1);}
          }
          .animate-btn-pop {
            animation: btnPop 1.2s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes tagFloat {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-6px);}
          }
          .animate-tag-float {
            animation: tagFloat 2s infinite;
          }
        `}</style>
      </div>
    </>
  );
}
