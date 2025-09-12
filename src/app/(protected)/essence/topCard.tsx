"use client";

import { motion } from "motion/react";
import React, { useState } from "react";

export default function SequenceDiagramsPitchCard({ isDark = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="relative w-full h-[280px] overflow-hidden group">
        {/* Main card */}
        <div className={`relative h-full rounded-2xl border backdrop-blur-sm transition-all duration-500 ${
          isDark 
            ? 'bg-zinc-900/80 border-zinc-800' 
            : 'bg-blue-50 border-zinc-200'
        }`}>
          
          {/* Animated laser border */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            {/* Top laser */}
            <div className={`absolute top-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-1000 ease-out ${
              isDark ? 'shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'shadow-[0_0_8px_rgba(59,130,246,0.6)]'
            }`} />
            
            {/* Right laser */}
            <div className={`absolute top-0 right-0 w-[2px] h-0 group-hover:h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent transition-all duration-1000 delay-300 ease-out ${
              isDark ? 'shadow-[0_0_10px_rgba(147,51,234,0.8)]' : 'shadow-[0_0_8px_rgba(147,51,234,0.6)]'
            }`} />
            
            {/* Bottom laser */}
            <div className={`absolute bottom-0 right-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-l from-transparent via-cyan-500 to-transparent transition-all duration-1000 delay-700 ease-out ${
              isDark ? 'shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'shadow-[0_0_8px_rgba(34,211,238,0.6)]'
            }`} />
            
            {/* Left laser */}
            <div className={`absolute bottom-0 left-0 w-[2px] h-0 group-hover:h-full bg-gradient-to-t from-transparent via-pink-500 to-transparent transition-all duration-1000 delay-1000 ease-out ${
              isDark ? 'shadow-[0_0_10px_rgba(244,114,182,0.8)]' : 'shadow-[0_0_8px_rgba(244,114,182,0.6)]'
            }`} />
            
            {/* Trail effects */}
            <div className={`absolute top-0 left-0 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-blue-500/30 to-transparent transition-all duration-2000 delay-500 ease-out opacity-60`} />
            <div className={`absolute top-0 right-0 w-[1px] h-0 group-hover:h-full bg-gradient-to-b from-purple-500/30 to-transparent transition-all duration-2000 delay-800 ease-out opacity-60`} />
            <div className={`absolute bottom-0 right-0 h-[1px] w-0 group-hover:w-full bg-gradient-to-l from-cyan-500/30 to-transparent transition-all duration-2000 delay-1200 ease-out opacity-60`} />
            <div className={`absolute bottom-0 left-0 w-[1px] h-0 group-hover:h-full bg-gradient-to-t from-pink-500/30 to-transparent transition-all duration-2000 delay-1500 ease-out opacity-60`} />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center"
          >
            {/* Icon */}
            <div className={`mb-6 p-3 rounded-xl ${
              isDark 
                ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20' 
                : 'bg-gradient-to-br from-blue-100 to-purple-100'
            } group-hover:scale-110 transition-transform duration-500`}>
              <svg className={`w-8 h-8 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {/* Main text */}
            <h3 className={`text-xl md:text-2xl font-bold mb-4 leading-tight ${
              isDark ? 'text-white' : 'text-zinc-900'
            } group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500`}>
              Transform complex backend flows
            </h3>
            
            <p className={`text-sm md:text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-600'
            }`}>
              into clear, visual sequence diagrams that document your API interactions and client communications
            </p>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
              className={`mt-6 px-8 py-3 rounded-full text-sm font-medium backdrop-blur-md transition-all duration-200 border ${
                isDark
                  ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500 shadow-lg shadow-blue-600/25'
                  : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25'
              }`}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative w-full max-w-2xl rounded-3xl border backdrop-blur-2xl shadow-2xl ${
              isDark 
                ? 'bg-zinc-800/95 border-zinc-700/60' 
                : 'bg-white/95 border-gray-300/60'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                isDark
                  ? 'hover:bg-zinc-700/50 text-zinc-400 hover:text-white'
                  : 'hover:bg-gray-100/50 text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className={`mb-4 p-4 rounded-2xl inline-block ${
                  isDark 
                    ? 'bg-blue-500/20 border border-blue-400/30' 
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <svg className={`w-10 h-10 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Essence Features
                </h2>
                <p className={`text-base ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Intelligent documentation and visualization for your codebase
                </p>
              </div>

              {/* Feature Points */}
              <div className="space-y-4">
                {[
                  {
                    number: "1",
                    title: "Complete Codebase Context",
                    description: "RepoMind has the context of your entire codebase. Use the prompt box to create self-curated docs and sequence diagrams."
                  },
                  {
                    number: "2", 
                    title: "AI-Powered Documentation",
                    description: "Automatically generate comprehensive documentation that understands your code structure, patterns, and architecture."
                  },
                  {
                    number: "3",
                    title: "Visual Sequence Diagrams", 
                    description: "Transform complex backend flows into clear, visual sequence diagrams that document API interactions and client communications."
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className={`flex gap-4 p-4 rounded-3xl border ${
                      isDark 
                        ? 'bg-zinc-700/30 border-zinc-600/30' 
                        : 'bg-gray-50/80 border-gray-200/50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold ${
                      isDark
                        ? 'bg-blue-500/20 text-blue-400 border-blue-400/30'
                        : 'bg-blue-100 text-blue-600 border-blue-200'
                    }`}>
                      {feature.number}
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25'
                  }`}
                >
                  Get Started Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}