"use client";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  const handleGetStartedSignedOut = () => {
    router.push("/sign-in");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Header with Sign Up and Sign In */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`shadow-lg transition-colors duration-300 fixed top-0 left-0 right-0 z-50
          ${theme === 'dark' 
            ? 'bg-gray-800/80 backdrop-blur-lg border-b border-gray-700' 
            : 'bg-white/80 backdrop-blur-lg border-b border-gray-200'
          }`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <motion.h1 
            className={`text-xl md:text-2xl font-bold transition-colors duration-300
              ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
            whileHover={{ scale: 1.05 }}
          >
            AcronymVerse 🚀
          </motion.h1>
          
          {/* Desktop Navigation */}
          <div className="flex items-center gap-2 md:gap-4">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors duration-300
                ${theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
            >
              {theme === 'dark' ? <Sun className="w-4 md:w-5 h-4 md:h-5" /> : <Moon className="w-4 md:w-5 h-4 md:h-5" />}
            </motion.button>
            
            <SignedOut>
              <div className="hidden md:flex gap-3 lg:gap-4 items-center">
                <SignUpButton>
                  <button className={`px-3 md:px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base
                    ${theme === 'dark' 
                      ? 'bg-gradient-to-r from-pink-600 to-teal-600 hover:from-pink-700 hover:to-teal-700 text-white' 
                      : 'bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white'
                    }`}>
                    Sign Up ✨
                  </button>
                </SignUpButton>
                <SignInButton>
                  <button className={`px-3 md:px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base
                    ${theme === 'dark' 
                      ? 'bg-gradient-to-r from-teal-600 to-pink-600 hover:from-teal-700 hover:to-pink-700 text-white' 
                      : 'bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white'
                    }`}>
                    Sign In 🎯
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
            
            <SignedIn>
              <div className="hidden md:flex gap-3 lg:gap-4 items-center">
                <Link href="/dashboard" className={`px-3 md:px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base
                  ${theme === 'dark' 
                    ? 'bg-gradient-to-r from-pink-600 to-teal-600 hover:from-pink-700 hover:to-teal-700 text-white' 
                    : 'bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white'
                  }`}>
                  📊 Dashboard
                </Link>
                <Link href="/profile" className={`px-3 md:px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base
                  ${theme === 'dark' 
                    ? 'bg-gradient-to-r from-teal-600 to-pink-600 hover:from-teal-700 hover:to-pink-700 text-white' 
                    : 'bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white'
                  }`}>
                  👤 Profile
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
              </div>
            </SignedIn>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-full transition-colors duration-300
                  ${theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Background Overlay */}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed top-[72px] left-0 right-0 z-40 md:hidden shadow-lg transition-colors duration-300
              ${theme === 'dark' 
                ? 'bg-gray-800/95 border-b border-gray-700' 
                : 'bg-white/95 border-b border-gray-200'
              }`}
          >
            <div className="max-w-6xl mx-auto p-4">
              <div className="flex flex-col gap-3">
                <SignedOut>
                  <SignUpButton>
                    <button className={`w-full px-4 py-3 rounded-full font-medium transition-all duration-300 shadow-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gradient-to-r from-pink-600 to-teal-600 text-white' 
                        : 'bg-gradient-to-r from-pink-500 to-teal-500 text-white'
                      }`}>
                      Sign Up ✨
                    </button>
                  </SignUpButton>
                  <SignInButton>
                    <button className={`w-full px-4 py-3 rounded-full font-medium transition-all duration-300 shadow-lg text-sm
                      ${theme === 'dark' 
                        ? 'bg-gradient-to-r from-teal-600 to-pink-600 text-white' 
                        : 'bg-gradient-to-r from-teal-500 to-pink-500 text-white'
                      }`}>
                      Sign In 🎯
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className={`w-full text-center px-4 py-3 rounded-full font-medium transition-all duration-300 shadow-lg text-sm
                    ${theme === 'dark' 
                      ? 'bg-gradient-to-r from-pink-600 to-teal-600 text-white' 
                      : 'bg-gradient-to-r from-pink-500 to-teal-500 text-white'
                    }`}>
                    📊 Dashboard
                  </Link>
                  <Link href="/profile" className={`w-full text-center px-4 py-3 rounded-full font-medium transition-all duration-300 shadow-lg text-sm
                    ${theme === 'dark' 
                      ? 'bg-gradient-to-r from-teal-600 to-pink-600 text-white' 
                      : 'bg-gradient-to-r from-teal-500 to-pink-500 text-white'
                    }`}>
                    👤 Profile
                  </Link>
                  <div className="flex justify-center pt-2">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                          userButtonPopoverCard: theme === 'dark' ? "bg-gray-800 shadow-lg" : "bg-white shadow-lg",
                          userButtonPopoverActions: theme === 'dark' ? "text-gray-200" : "text-gray-700"
                        }
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`min-h-screen transition-colors duration-300 pt-[72px]
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-pink-900 to-teal-900' 
          : 'bg-gradient-to-br from-gray-100 via-pink-100 to-teal-100'
        }`}>
        
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center px-4 py-12 md:py-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className={`text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 drop-shadow-2xl text-center animate-text-pop transition-colors duration-300
              ${theme === 'dark' 
                ? 'text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]' 
                : 'text-gray-900 drop-shadow-[0_4px_8px_rgba(255,255,255,0.8)]'
              }`}>
            AcronymVerse 🚀
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`text-lg md:text-xl lg:text-2xl mb-12 text-center max-w-4xl animate-fade-in transition-colors duration-300 leading-relaxed px-4 font-semibold
              ${theme === 'dark' 
                ? 'text-gray-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
                : 'text-gray-800 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]'
              }`}>
            Unlock the world of acronyms! Discover, create, and share the coolest abbreviations Gen Z style. 
            Level up your lingo, flex your creativity, and vibe with the community. 💫
          </motion.p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 w-full max-w-7xl px-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-lg flex flex-col items-center hover:scale-105 transition-all duration-300 animate-card-bounce border
                ${theme === 'dark' 
                  ? 'bg-gray-800/80 border-gray-700 text-white hover:border-pink-500' 
                  : 'bg-white/80 border-gray-200 text-gray-800 hover:border-pink-300'
                }`}
            >
              <div className="text-4xl md:text-5xl mb-4 animate-emoji-bounce">🔥</div>
              <h2 className={`font-bold text-xl md:text-2xl mb-3 text-center
                ${theme === 'dark' 
                  ? 'bg-gradient-to-r from-pink-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg' 
                  : 'bg-gradient-to-r from-pink-700 to-teal-700 bg-clip-text text-transparent drop-shadow-lg'
                }`}>
                Trending Acronyms
              </h2>
              <p className={`text-center text-sm md:text-base leading-relaxed font-medium
                ${theme === 'dark' 
                  ? 'text-gray-200 drop-shadow-md' 
                  : 'text-gray-700 drop-shadow-md'
                }`}>
                Stay updated with the hottest acronyms everyone&apos;s using right now. No cap! 📈
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-lg flex flex-col items-center hover:scale-105 transition-all duration-300 animate-card-bounce border relative overflow-hidden
                ${theme === 'dark' 
                  ? 'bg-gray-800/80 border-gray-700 text-white hover:border-teal-500' 
                  : 'bg-white/80 border-gray-200 text-gray-800 hover:border-teal-300'
                }`}
            >
              {/* Coming Soon Overlay */}
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold
                ${theme === 'dark' 
                  ? 'bg-orange-600/80 text-white' 
                  : 'bg-orange-500/90 text-white'
                }`}>
                COMING SOON
              </div>
              
              <div className="text-4xl md:text-5xl mb-4 animate-emoji-bounce opacity-60">🎨</div>
              <h2 className={`font-bold text-xl md:text-2xl mb-3 text-center
                ${theme === 'dark' 
                  ? 'bg-gradient-to-r from-teal-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg opacity-70' 
                  : 'bg-gradient-to-r from-teal-700 to-pink-700 bg-clip-text text-transparent drop-shadow-lg opacity-70'
                }`}>
                Create Your Own
              </h2>
              <p className={`text-center text-sm md:text-base leading-relaxed font-medium opacity-60
                ${theme === 'dark' 
                  ? 'text-gray-300 drop-shadow-md' 
                  : 'text-gray-600 drop-shadow-md'
                }`}>
                Soon you&apos;ll be able to create and share your own custom acronyms! Stay tuned for this exciting feature. 🚀
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-lg flex flex-col items-center hover:scale-105 transition-all duration-300 animate-card-bounce border md:col-span-2 lg:col-span-1 relative overflow-hidden
                ${theme === 'dark' 
                  ? 'bg-gray-800/80 border-gray-700 text-white hover:border-purple-500' 
                  : 'bg-white/80 border-gray-200 text-gray-800 hover:border-purple-300'
                }`}
            >
              {/* Coming Soon Overlay */}
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold
                ${theme === 'dark' 
                  ? 'bg-purple-600/80 text-white' 
                  : 'bg-purple-500/90 text-white'
                }`}>
                COMING SOON
              </div>
              
              <div className="text-4xl md:text-5xl mb-4 animate-emoji-bounce opacity-60">🤝</div>
              <h2 className={`font-bold text-xl md:text-2xl mb-3 text-center
                ${theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg opacity-70' 
                  : 'bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent drop-shadow-lg opacity-70'
                }`}>
                Community Vibes
              </h2>
              <p className={`text-center text-sm md:text-base leading-relaxed font-medium opacity-60
                ${theme === 'dark' 
                  ? 'text-gray-300 drop-shadow-md' 
                  : 'text-gray-600 drop-shadow-md'
                }`}>
                Get ready to vote, comment, and connect with fellow acronym enthusiasts! Community features launching soon. 🌟
              </p>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 px-4">
            <SignedOut>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                onClick={handleGetStartedSignedOut}
                className={`font-bold py-4 px-8 md:px-10 rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 animate-btn-pop text-base md:text-lg
                  ${theme === 'dark' 
                    ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-teal-600 hover:from-pink-700 hover:via-purple-700 hover:to-teal-700 text-white' 
                    : 'bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 hover:from-pink-600 hover:via-purple-600 hover:to-teal-600 text-white'
                  }`}
              >
                Get Started - It&apos;s Free! 🎉
              </motion.button>
            </SignedOut>
            
            <SignedIn>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                onClick={handleGetStarted}
                className={`font-bold py-4 px-8 md:px-10 rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 animate-btn-pop text-base md:text-lg
                  ${theme === 'dark' 
                    ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-teal-600 hover:from-pink-700 hover:via-purple-700 hover:to-teal-700 text-white' 
                    : 'bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 hover:from-pink-600 hover:via-purple-600 hover:to-teal-600 text-white'
                  }`}
              >
                Go to Dashboard 🚀
              </motion.button>
            </SignedIn>
          </div>

          {/* Hashtags */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-wrap gap-3 md:gap-4 justify-center px-4"
          >
            <span className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold animate-tag-float shadow-lg border transition-all duration-300
              ${theme === 'dark' 
                ? 'bg-gray-800/80 text-pink-400 border-pink-400/30 hover:bg-pink-400/20' 
                : 'bg-white/90 text-pink-600 border-pink-600/30 hover:bg-pink-100'
              }`}>
              #GenZ 🔥
            </span>
            <span className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold animate-tag-float shadow-lg border transition-all duration-300
              ${theme === 'dark' 
                ? 'bg-gray-800/80 text-teal-400 border-teal-400/30 hover:bg-teal-400/20' 
                : 'bg-white/90 text-teal-600 border-teal-600/30 hover:bg-teal-100'
              }`}>
              #AcronymLife 💯
            </span>
            <span className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold animate-tag-float shadow-lg border transition-all duration-300
              ${theme === 'dark' 
                ? 'bg-gray-800/80 text-purple-400 border-purple-400/30 hover:bg-purple-400/20' 
                : 'bg-white/90 text-purple-600 border-purple-600/30 hover:bg-purple-100'
              }`}>
              #VibeCheck ✨
            </span>
          </motion.div>
        </div>

        {/* Enhanced Animations in CSS */}
        <style jsx>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-move {
            background-size: 400% 400%;
            animation: gradientMove 15s ease infinite;
          }
          @keyframes textPop {
            0% { transform: scale(0.9) rotate(-1deg); opacity: 0; letter-spacing: -2px;}
            60% { transform: scale(1.08) rotate(1deg); opacity: 1; letter-spacing: 2px;}
            100% { transform: scale(1) rotate(0deg); letter-spacing: 0;}
          }
          .animate-text-pop {
            animation: textPop 1.5s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px) scale(0.95);}
            to { opacity: 1; transform: translateY(0) scale(1);}
          }
          .animate-fade-in {
            animation: fadeIn 1.8s ease;
          }
          @keyframes cardBounce {
            0% { transform: scale(0.9) rotateY(-10deg);}
            60% { transform: scale(1.05) rotateY(5deg);}
            100% { transform: scale(1) rotateY(0deg);}
          }
          .animate-card-bounce {
            animation: cardBounce 1.5s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes emojiBounce {
            0%, 100% { transform: translateY(0) rotate(0deg);}
            25% { transform: translateY(-8px) rotate(-5deg);}
            75% { transform: translateY(-8px) rotate(5deg);}
          }
          .animate-emoji-bounce {
            animation: emojiBounce 2s infinite;
          }
          @keyframes btnPop {
            0% { transform: scale(0.8) rotateZ(-2deg);}
            60% { transform: scale(1.1) rotateZ(2deg);}
            100% { transform: scale(1) rotateZ(0deg);}
          }
          .animate-btn-pop {
            animation: btnPop 1.5s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes tagFloat {
            0%, 100% { transform: translateY(0) rotate(0deg);}
            33% { transform: translateY(-8px) rotate(1deg);}
            66% { transform: translateY(-4px) rotate(-1deg);}
          }
          .animate-tag-float {
            animation: tagFloat 3s infinite;
          }
        `}</style>

        {/* Footer */}
        <footer className={`mt-16 md:mt-24 py-8 md:py-12 px-4 border-t transition-colors duration-300
          ${theme === 'dark' 
            ? 'bg-gray-900/80 backdrop-blur-lg border-gray-700' 
            : 'bg-white/80 backdrop-blur-lg border-gray-200'
          }`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand Section */}
              <div className="text-center md:text-left">
                <h3 className={`text-xl md:text-2xl font-bold mb-4 transition-colors duration-300
                  ${theme === 'dark' 
                    ? 'text-white drop-shadow-lg' 
                    : 'text-gray-900 drop-shadow-lg'
                  }`}>
                  AcronymVerse 🚀
                </h3>
                <p className={`text-sm md:text-base transition-colors duration-300 font-medium
                  ${theme === 'dark' 
                    ? 'text-gray-200 drop-shadow-md' 
                    : 'text-gray-700 drop-shadow-md'
                  }`}>
                  The ultimate destination for discovering, creating, and sharing acronyms in the digital age.
                </p>
              </div>

              {/* Quick Links */}
              <div className="text-center">
                <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300
                  ${theme === 'dark' 
                    ? 'text-white drop-shadow-lg' 
                    : 'text-gray-900 drop-shadow-lg'
                  }`}>
                  Quick Links
                </h4>
                <div className="space-y-2">
                  <SignedIn>
                    <Link href="/dashboard" className={`block text-sm md:text-base hover:underline transition-colors duration-300 font-medium
                      ${theme === 'dark' 
                        ? 'text-gray-200 hover:text-pink-300 drop-shadow-md' 
                        : 'text-gray-700 hover:text-pink-600 drop-shadow-md'
                      }`}>
                      Dashboard
                    </Link>
                    <Link href="/profile" className={`block text-sm md:text-base hover:underline transition-colors duration-300 font-medium
                      ${theme === 'dark' 
                        ? 'text-gray-200 hover:text-teal-300 drop-shadow-md' 
                        : 'text-gray-700 hover:text-teal-600 drop-shadow-md'
                      }`}>
                      Profile
                    </Link>
                  </SignedIn>
                  <SignedOut>
                    <Link href="/sign-up" className={`block text-sm md:text-base hover:underline transition-colors duration-300 font-medium
                      ${theme === 'dark' 
                        ? 'text-gray-200 hover:text-pink-300 drop-shadow-md' 
                        : 'text-gray-700 hover:text-pink-600 drop-shadow-md'
                      }`}>
                      Sign Up
                    </Link>
                    <Link href="/sign-in" className={`block text-sm md:text-base hover:underline transition-colors duration-300 font-medium
                      ${theme === 'dark' 
                        ? 'text-gray-200 hover:text-teal-300 drop-shadow-md' 
                        : 'text-gray-700 hover:text-teal-600 drop-shadow-md'
                      }`}>
                      Sign In
                    </Link>
                  </SignedOut>
                </div>
              </div>

              {/* Community */}
              <div className="text-center md:text-right">
                <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300
                  ${theme === 'dark' 
                    ? 'text-white drop-shadow-lg' 
                    : 'text-gray-900 drop-shadow-lg'
                  }`}>
                  Join the Community
                </h4>
                <div className="flex justify-center md:justify-end gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-colors duration-300
                    ${theme === 'dark' 
                      ? 'bg-pink-600/20 text-pink-400 border border-pink-400/30' 
                      : 'bg-pink-100 text-pink-600 border border-pink-200'
                    }`}>
                    #GenZ
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-colors duration-300
                    ${theme === 'dark' 
                      ? 'bg-teal-600/20 text-teal-400 border border-teal-400/30' 
                      : 'bg-teal-100 text-teal-600 border border-teal-200'
                    }`}>
                    #Innovation
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className={`pt-8 border-t text-center transition-colors duration-300
              ${theme === 'dark' 
                ? 'border-gray-700 text-gray-300 drop-shadow-md' 
                : 'border-gray-200 text-gray-600 drop-shadow-md'
              }`}>
              <p className="text-xs md:text-sm font-medium">
                © 2025 AcronymVerse. Made with 💜 for the acronym community.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
