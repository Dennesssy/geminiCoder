"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react"; // Import useState

export default function Footer() {
  const [showPartyText, setShowPartyText] = useState(false); // State for text visibility

  const handleTipJarClick = () => {
    console.log("Tip Jar clicked!");
    setShowPartyText(true); // Show text on click
    // Example: window.open('your-tip-jar-link', '_blank');
  };

  return (
    <> {/* Fragment to wrap footer and the absolutely positioned animated text */}
      {/* Restored footer layout: justify-between */}
      <footer className="mb-3 mt-5 flex h-16 w-full flex-col items-center justify-between space-y-3 px-3 pt-4 text-center sm:mb-0 sm:h-20 sm:flex-row sm:space-y-0 sm:pt-2">
        {/* Left Side: Tip Jar Button Only */}
        <div>
          <button
            onClick={handleTipJarClick}
            className="rounded bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 font-semibold text-white shadow transition hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
            aria-label="Tip Jar"
          >
            Tip Jar 💖
          </button>
        </div>

        {/* Right Side: Only Telegram Icon */}
        <div className="flex space-x-4 pb-4 sm:pb-0"> {/* Removed sm:ml-auto */}
          {/* Telegram Icon */}
          <Link
            href="https://t.me/thedailypnp"
            className="group"
            aria-label="Telegram"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6 fill-gray-500 group-hover:fill-gray-700 dark:fill-slate-500 dark:group-hover:fill-slate-400"
              viewBox="0 0 24 24"
            >
              <path d="M21.9 3.31a1.07 1.07 0 0 0-1.44-.24L2.71 11.29a1 1 0 0 0 .18 1.85l4.8 1.53 1.52 4.8a1 1 0 0 0 1.85.18l8.22-17.75a1.07 1.07 0 0 0-.23-1.44zm-5.4 4.15-6.58 5.98-3.8-1.2Z"/>
            </svg>
          </Link>
        </div>
      </footer>

      {/* Animated Text Section - Absolutely positioned */}
      <AnimatePresence>
        {showPartyText && ( // Conditionally render based on state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-center justify-center p-4" // Fixed positioning
          >
            <div className="rounded-lg bg-black bg-opacity-75 p-4 text-center text-4xl font-bold text-transparent sm:text-5xl md:text-6xl">
              {/* Vibrant gradient text with pulse animation */}
              <span className="animate-pulse bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text">
                Party N Play Safely, Cloud with us on the Daily
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </> // Closing the main fragment
  );
}
