"use client";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
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
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-2xl font-bold drop-shadow transition-colors duration-300
            ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          AcronymVerse 🚀
        </motion.h2>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-300 hover:rotate-180 transform
              ${theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <SignedOut>
            <SignUpButton>
              <button className="bg-gradient-to-r from-custom-pink to-custom-green text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Sign Up ✨
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="bg-gradient-to-r from-custom-green to-custom-pink text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Sign In 🎯
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="bg-gradient-to-r from-custom-pink to-custom-green text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Dashboard 📊
            </Link>
            <Link href="/profile" className="bg-gradient-to-r from-custom-green to-custom-pink text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Profile 👤
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

      {/* Main Content */}
      <div className={`flex flex-col items-center justify-center min-h-screen px-4 animate-gradient-move pt-24 transition-colors duration-300
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-custom-dark via-custom-pink to-custom-green' 
          : 'bg-gradient-to-br from-custom-green via-custom-pink to-custom-dark'
        }`}>
        
        {/* Hero Section */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className={`text-6xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl text-center animate-text-pop transition-colors duration-300
            ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
          AcronymVerse 🚀
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`text-xl md:text-2xl mb-12 text-center max-w-3xl animate-fade-in transition-colors duration-300 leading-relaxed
            ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>
          Unlock the world of acronyms! Discover, create, and share the coolest abbreviations Gen Z style. 
          Level up your lingo, flex your creativity, and vibe with the community. 💫
        </motion.p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`rounded-2xl p-8 shadow-2xl backdrop-blur-lg flex flex-col items-center hover:scale-105 transition-all duration-300 animate-card-bounce border-2
              ${theme === 'dark' 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-white/90 border-white/40 text-gray-800'
              }`}
          >
            <div className="text-5xl mb-4 animate-emoji-bounce">🔥</div>
            <h2 className="font-bold text-2xl mb-3 bg-gradient-to-r from-custom-pink to-custom-green bg-clip-text text-transparent">
              Trending Acronyms
            </h2>
            <p className={`text-center text-base leading-relaxed
              ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Stay updated with the hottest acronyms everyone&apos;s using right now. No cap! 📈
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`rounded-2xl p-8 shadow-2xl backdrop-blur-lg flex flex-col items-center hover:scale-105 transition-all duration-300 animate-card-bounce border-2
              ${theme === 'dark' 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-white/90 border-white/40 text-gray-800'
              }`}
          >
            <div className="text-5xl mb-4 animate-emoji-bounce">🎨</div>
            <h2 className="font-bold text-2xl mb-3 bg-gradient-to-r from-custom-green to-custom-pink bg-clip-text text-transparent">
              Create Your Own
            </h2>
            <p className={`text-center text-base leading-relaxed
              ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Invent new acronyms and share your unique style with the world. Let&apos;s get creative! ✨
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`rounded-2xl p-8 shadow-2xl backdrop-blur-lg flex flex-col items-center hover:scale-105 transition-all duration-300 animate-card-bounce border-2
              ${theme === 'dark' 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-white/90 border-white/40 text-gray-800'
              }`}
          >
            <div className="text-5xl mb-4 animate-emoji-bounce">🤝</div>
            <h2 className="font-bold text-2xl mb-3 bg-gradient-to-r from-custom-pink to-custom-dark bg-clip-text text-transparent">
              Community Vibes
            </h2>
            <p className={`text-center text-base leading-relaxed
              ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Vote, comment, and connect with fellow acronym lovers. Good vibes only! 🌟
            </p>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <SignedOut>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onClick={handleGetStartedSignedOut}
            className="bg-gradient-to-r from-custom-green via-custom-pink to-custom-dark text-white font-bold py-4 px-10 rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 mb-8 animate-btn-pop text-lg"
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
            className="bg-gradient-to-r from-custom-green via-custom-pink to-custom-dark text-white font-bold py-4 px-10 rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 mb-8 animate-btn-pop text-lg"
          >
            Go to Dashboard 🚀
          </motion.button>
        </SignedIn>

        {/* Hashtags */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-wrap gap-4 mt-6 justify-center"
        >
          <span className={`px-6 py-3 rounded-full text-base font-semibold animate-tag-float shadow-lg
            ${theme === 'dark' 
              ? 'bg-white/20 text-custom-green border border-custom-green/30' 
              : 'bg-white/90 text-custom-green border border-custom-green/30'
            }`}>
            #GenZ 🔥
          </span>
          <span className={`px-6 py-3 rounded-full text-base font-semibold animate-tag-float shadow-lg
            ${theme === 'dark' 
              ? 'bg-white/20 text-custom-pink border border-custom-pink/30' 
              : 'bg-white/90 text-custom-pink border border-custom-pink/30'
            }`}>
            #AcronymLife 💯
          </span>
          <span className={`px-6 py-3 rounded-full text-base font-semibold animate-tag-float shadow-lg
            ${theme === 'dark' 
              ? 'bg-white/20 text-custom-dark border border-custom-dark/30' 
              : 'bg-white/90 text-custom-dark border border-custom-dark/30'
            }`}>
            #VibeCheck ✨
          </span>
        </motion.div>

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
      </div>
    </>
  );
}
