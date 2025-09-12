"use client";

import { motion } from "motion/react";
import React, { useState } from "react";

export default function QnAPitchCard({ isDark = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="relative w-full h-[280px] overflow-hidden group">
        {/* Main card */}
        <div className={`relative h-full rounded-3xl border-2 backdrop-blur-sm transition-all duration-500 ${
          isDark 
            ? 'bg-zinc-800/95 border-zinc-700/60 shadow-2xl shadow-black/50' 
            : 'bg-yellow-50 border-gray-300/60 shadow-xl shadow-gray-900/15'
        }`}>
          
          {/* Animated laser border */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            {/* Top laser */}
            <div className={`absolute top-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-all duration-1000 ease-out ${
              isDark ? 'shadow-[0_0_15px_rgba(16,185,129,0.7)]' : 'shadow-[0_0_10px_rgba(16,185,129,0.5)]'
            }`} />
            
            {/* Right laser */}
            <div className={`absolute top-0 right-0 w-[2px] h-0 group-hover:h-full bg-gradient-to-b from-transparent via-orange-500 to-transparent transition-all duration-1000 delay-300 ease-out ${
              isDark ? 'shadow-[0_0_15px_rgba(249,115,22,0.7)]' : 'shadow-[0_0_10px_rgba(249,115,22,0.5)]'
            }`} />
            
            {/* Bottom laser */}
            <div className={`absolute bottom-0 right-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-l from-transparent via-purple-500 to-transparent transition-all duration-1000 delay-700 ease-out ${
              isDark ? 'shadow-[0_0_15px_rgba(147,51,234,0.7)]' : 'shadow-[0_0_10px_rgba(147,51,234,0.5)]'
            }`} />
            
            {/* Left laser */}
            <div className={`absolute bottom-0 left-0 w-[2px] h-0 group-hover:h-full bg-gradient-to-t from-transparent via-blue-500 to-transparent transition-all duration-1000 delay-1000 ease-out ${
              isDark ? 'shadow-[0_0_15px_rgba(59,130,246,0.7)]' : 'shadow-[0_0_10px_rgba(59,130,246,0.5)]'
            }`} />
            
            {/* Trail effects */}
            <div className={`absolute top-0 left-0 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-emerald-500/40 to-transparent transition-all duration-2000 delay-500 ease-out`} />
            <div className={`absolute top-0 right-0 w-[1px] h-0 group-hover:h-full bg-gradient-to-b from-orange-500/40 to-transparent transition-all duration-2000 delay-800 ease-out`} />
            <div className={`absolute bottom-0 right-0 h-[1px] w-0 group-hover:w-full bg-gradient-to-l from-purple-500/40 to-transparent transition-all duration-2000 delay-1200 ease-out`} />
            <div className={`absolute bottom-0 left-0 w-[1px] h-0 group-hover:h-full bg-gradient-to-t from-blue-500/40 to-transparent transition-all duration-2000 delay-1500 ease-out`} />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center"
          >
            {/* Icon */}
            <div className={`mb-6 p-3 rounded-3xl border ${
              isDark 
                ? 'bg-gradient-to-br from-emerald-500/20 to-blue-600/20 border-zinc-600' 
                : 'bg-gradient-to-br from-emerald-100 to-blue-100 border-zinc-300'
            } group-hover:scale-110 transition-transform duration-500`}>
              <svg className={`w-8 h-8 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Main text */}
            <h3 className={`text-xl md:text-2xl font-semibold mb-4 leading-tight tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            } group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500`}>
              Ask questions about your codebase
            </h3>
            
            <p className={`text-sm md:text-base leading-relaxed font-normal ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Get instant answers about your code structure, functions, and implementation details through advanced RAG technology
            </p>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
              className={`mt-6 px-8 py-3 rounded-full text-sm font-medium backdrop-blur-md transition-all duration-200 border ${
                isDark
                  ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25'
                  : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25'
              }`}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative w-full max-w-2xl rounded-3xl border-2 backdrop-blur-2xl shadow-2xl ${
              isDark 
                ? 'bg-zinc-800/95 border-zinc-700/60' 
                : 'bg-white/95 border-gray-300/60'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className={`absolute top-4 right-4 p-2 rounded-full border transition-all duration-200 ${
                isDark
                  ? 'hover:bg-zinc-700/50 text-zinc-400 hover:text-white border-zinc-600'
                  : 'hover:bg-gray-100/50 text-gray-500 hover:text-gray-700 border-gray-300'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className={`mb-4 p-4 rounded-3xl border inline-block ${
                  isDark 
                    ? 'bg-emerald-500/20 border-emerald-400/30' 
                    : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <svg className={`w-10 h-10 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Q&A Features
                </h2>
                <p className={`text-base ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Intelligent codebase questioning powered by RAG technology
                </p>
              </div>

              {/* Feature Points */}
              <div className="space-y-4">
                {[
                  {
                    number: "1",
                    title: "RAG-Powered Intelligence",
                    description: "Ask questions about your codebase and get accurate answers powered by Retrieval-Augmented Generation technology that understands your code context."
                  },
                  {
                    number: "2", 
                    title: "Instant Code Comprehension",
                    description: "Get immediate insights about functions, classes, dependencies, and implementation details without manually searching through files."
                  },
                  {
                    number: "3",
                    title: "Natural Language Queries", 
                    description: "Ask questions in plain English like 'How does authentication work?' or 'What APIs handle user data?' and get comprehensive answers."
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
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30'
                        : 'bg-emerald-100 text-emerald-600 border-emerald-200'
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
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/25'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25'
                  }`}
                >
                  Try Q&A Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}