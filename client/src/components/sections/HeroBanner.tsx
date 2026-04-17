'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Button from '../ui/Button'

const HeroBanner: React.FC = () => {
  const videoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const scrollY = window.scrollY
        gsap.to(videoRef.current, {
          y: scrollY * 0.5,
          duration: 0.1,
          overwrite: 'auto'
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-[#0b0e27] via-[#1a1f3a] to-[#2d1b4e]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(88,166,255,0.3),transparent_50%),radial-gradient(circle_at_76%_18%,rgba(168,85,247,0.25),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.2),transparent_50%)]"></div>
        {/* Additional glow layers */}
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 px-4 max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left" ref={textRef}>
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white tracking-tight"
              variants={itemVariants}
            >
              GITGUARD
            </motion.h1>

            <motion.div
              className="text-lg md:text-xl mb-8 max-w-2xl text-[#a0aec0] font-light"
              variants={itemVariants}
            >
              GitGuard scans GitHub repositories for malware risk
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                href="/login"
                variant="primary"
                size="large"
                className="inline-flex"
              >
                Start a GitGuard scan
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="relative z-20"
            variants={itemVariants}
            ref={videoRef}
          >
            <div className="rounded-2xl overflow-hidden border border-blue-400/30 shadow-2xl shadow-blue-500/20 bg-black/60 backdrop-blur-sm">
              <video
                className="w-full h-auto"
                autoPlay
                muted
                loop
                playsInline
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-64 bg-linear-to-br from-[#1a1f3a] to-black flex items-center justify-center text-blue-100">GitGuard Demo</div>';
                  }
                }}
              >
                <source src="/videos/kling_20260417_作品_Video_Back_336_0 (1).mp4" type="video/mp4" />
                <source src="/videos/plateforme.webm" type="video/webm" />
              </video>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-[#0b0e27] via-[#1a1f3a]/50 to-transparent"></div>
    </section>
  )
}

export default HeroBanner
