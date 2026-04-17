'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Shield, Users, GraduationCap, Lock } from 'lucide-react'
import Button from '../ui/Button'

const PlatformTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      id: 'platform',
      title: 'Mailinblack Platform',
      preTitle: 'Mailinblack Platform',
      description: 'Protect, educate, train: the winning triptych for your cybersecurity',
      content: 'Mailinblack solutions are a combination of technological innovations that allow you to secure your organization and educate and train your employees against cyber attacks. Let\'s find them on the Mailinblack platform.',
      videoSrc: '/videos/plateforme.mp4',
      icon: Shield,
      href: '/platform'
    },
    {
      id: 'protect',
      title: 'Protect',
      preTitle: 'Protect',
      description: 'Strengthen your security and gain productivity and peace of mind with our AI',
      content: 'Our Protect solution implements an advanced filtering of emails before they are received. Our proprietary AI defuses phishing, spearphishing and ransomware attacks and keeps your teams focused on their legitimate emails.',
      videoSrc: '/videos/protect.mp4',
      icon: Shield,
      href: '/products/mailinblack-spam-protection'
    },
    {
      id: 'cyber-coach',
      title: 'Cyber Coach',
      preTitle: 'Cyber Coach',
      description: 'Coach your employees like a high performance team',
      content: 'Audit your organization and implement a 100% automated attack simulation program with Cyber Coach, the most complete cybersecurity awareness solution on the market.',
      videoSrc: '/videos/cyber_coach.mp4',
      icon: Users,
      href: '/products/mailinblack-phishing-simulation'
    },
    {
      id: 'cyber-academy',
      title: 'Cyber Academy',
      preTitle: 'Cyber Academy',
      description: 'Train your teams in cybersecurity with a complete and fun solution',
      content: 'Cyber Academy is based on the 4 pillars of learning: attention, active engagement, return on error and consolidation. Our e-learning platform offers your employees a complete and fun educational experience in cybersecurity training.',
      videoSrc: '/videos/cyber_academie.mp4',
      icon: GraduationCap,
      href: '/products/mailinblack-cybersecurity-training'
    },
    {
      id: 'sikker',
      title: 'Sikker',
      preTitle: 'Sikker',
      description: 'Simplify password management within your organization',
      content: 'Sikker transforms the concept of digital security by combining ease of use with robust protection, without making any concessions. With its password manager for enterprises, it provides centralized access management and integrates advanced security features, offering complete peace of mind. Engage your teams in your company\'s cybersecurity to achieve higher levels of digital protection.',
      videoSrc: null, // Image instead of video for Sikker
      imageSrc: '/images/mysikker2.webp',
      icon: Lock,
      href: '/products/password-manager'
    }
  ]

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const contentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center mb-8">
            <div className="h-px bg-gray-300 w-20"></div>
            <h2 className="px-6 text-2xl font-semibold uppercase tracking-wider text-gray-900">
              Platform
            </h2>
            <div className="h-px bg-gray-300 w-20"></div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-4xl mx-auto">
            Reduce your risk of being attacked with our cybersecurity solutions
          </h3>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === index
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Left Content */}
              <div className="space-y-6">
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                  {tabs[activeTab].preTitle}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900">
                  {tabs[activeTab].description}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {tabs[activeTab].content}
                </p>
                
                <Button
                  href={tabs[activeTab].href}
                  variant="primary"
                  size="medium"
                >
                  {tabs[activeTab].id === 'platform' ? 'Discover the platform' : `Discover ${tabs[activeTab].title}`}
                </Button>
              </div>

              {/* Right Content - Video/Image */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                  {tabs[activeTab].videoSrc ? (
                    <div className="relative rounded-xl overflow-hidden bg-black">
                      <video
                        className="w-full h-auto rounded-xl"
                        autoPlay
                        muted
                        loop
                        playsInline
                        onError={(e) => {
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-gray-600">Video Demo</div>`;
                          }
                        }}
                      >
                        <source src={tabs[activeTab].videoSrc} type="video/mp4" />
                        <source src={tabs[activeTab].videoSrc?.replace('.mp4', '.webm')} type="video/webm" />
                      </video>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 rounded-full p-4">
                          <Play className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden">
                      <img
                        src={tabs[activeTab].imageSrc}
                        alt={tabs[activeTab].title}
                        className="w-full h-auto rounded-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-gray-600">${tabs[activeTab].title}</div>`;
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default PlatformTabs
