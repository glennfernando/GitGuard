'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { motion } from 'framer-motion'
import { Quote, Star, ArrowLeft, ArrowRight } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Testimonials: React.FC = () => {
  const [swiper, setSwiper] = useState<any>(null)

  const testimonials = [
    {
      id: 1,
      company: 'Palais des Festivals de Cannes',
      logo: '/logos/logopalaisdesfestivalsetdescongres.webp',
      content: 'The Cyber Coach and Cyber Academy solutions offered by Mailinblack proved to be perfectly suited to our needs. They enable us to raise awareness among as many people as possible in a fun and interactive way, with relevant and engaging content.\n\nOur vulnerability rate is falling, and that\'s a real success!',
      author: 'Bruno DEMAREST',
      position: 'HUMAN RESOURCES'
    },
    {
      id: 2,
      company: 'Quality Assistance',
      logo: '/logos/logoqualityassistance.webp',
      content: 'Today, too many people think that email is safe. Unfortunately, this is no longer true at all! With Cyber Coach, employees are really aware of problem. They are now more vigilant about this type of practice.',
      author: 'Jean-Pol DOLATA',
      position: 'IT Director'
    },
    {
      id: 3,
      company: 'Laboratoires Pharmaceutiques Rodael',
      logo: '/logos/logolaboroadel.webp',
      content: 'In my experience, IT security is of great importance. Indeed, a few years ago, when we were not equipped with an email protection solution, we were victims of emailing attacks. In order not to relive these high-impact incidents, we have integrated Protect into our teams. Because of high risk of cyber attacks on hospitals, we have to be extra vigilant in securing our daily exchanges with them.',
      author: 'Guillaume Keirel',
      position: 'RI'
    },
    {
      id: 4,
      company: 'CHU Martinique',
      logo: '/logos/logochumartinique.webp',
      content: 'Mailinblack gives us real extra security. The latest attacks on the hospital have been stopped and quarantined by Protect and staff mailbox is now sorted and clean. We work more serenely while ensuring constant monitoring of our IT system.',
      author: 'Gérald GALIM',
      position: 'RSSI'
    },
    {
      id: 5,
      company: 'Communauté d\'Agglomération de Forbach',
      logo: '/logos/logoforbach.webp',
      content: 'Yes, I would definitely recommend Mailinblack solutions! On the one hand, because I am a satisfied user but also because they allow us to see future with serenity. Moreover, as you are a French solution, it is our responsibility as a customer to promote it when we can.',
      author: 'Pascal LICATA',
      position: 'DSI'
    },
    {
      id: 6,
      company: 'Mairie de Colombes',
      logo: '/logos/logomairiecolombes.webp',
      content: 'Efficient and simple! 223,000 spam messages stopped and 4,000 viruses blocked. Mailinblack protects us from a large number of email attacks. I clearly recommend the use of Protect!',
      author: 'Nicolas Antoine',
      position: 'DSI'
    },
    {
      id: 7,
      company: 'Socredo',
      logo: '/logos/logosocredo.webp',
      content: 'Because of our banking activity, our institution is regularly targeted by various threats. [...] And in the event of an attack, bank\'s image would be severely damaged within the population with a breakdown in trust. We therefore turned to Mailinblack. Its Protect solution provides very good protection and is easy to use.',
      author: 'Philippe Chaumine',
      position: 'DSI'
    },
    {
      id: 8,
      company: 'Office du tourisme de Fréjus',
      logo: '/logos/logofrejus.webp',
      content: 'We are very satisfied with Mailinblack\'s offer, particularly in this period of increased cyber attacks. This season is impacted by Covid-19 crisis, we want to be vigilant and protect our equipment as much as possible. We are starting the season very late and knowing that we are protected by Mailinblack is very reassuring.',
      author: 'Nathalie COURRÈGE',
      position: 'Director'
    }
  ]

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

  const slideVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section className="py-16 bg-gray-50">
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
              TESTIMONIALS
            </h2>
            <div className="h-px bg-gray-300 w-20"></div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-4xl mx-auto">
            French solutions, adapted to your cybersecurity needs
          </h3>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.testimonials-button-next',
              prevEl: '.testimonials-button-prev',
            }}
            pagination={{
              clickable: true,
              el: '.testimonials-pagination',
            }}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            loop={true}
            onSwiper={setSwiper}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  variants={slideVariants}
                  className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
                >
                  <div className="grid md:grid-cols-3 gap-8 items-start">
                    {/* Company Logo */}
                    <div className="md:col-span-1">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl"></div>
                        <img
                          src={testimonial.logo}
                          alt={testimonial.company}
                          className="relative w-full h-32 object-contain object-center"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">${testimonial.company}</div>`;
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <div className="md:col-span-2">
                      <div className="relative">
                        <Quote className="absolute -top-4 -left-4 w-8 h-8 text-blue-200" />
                        
                        <blockquote className="text-gray-700 leading-relaxed mb-8 text-lg italic">
                          {testimonial.content}
                        </blockquote>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 text-lg">
                              {testimonial.author}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {testimonial.position}
                            </div>
                          </div>

                          <div className="text-blue-600 font-medium">
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              className="testimonials-button-prev bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-colors"
              onClick={() => swiper?.slidePrev()}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="testimonials-pagination flex space-x-2"></div>
            
            <button
              className="testimonials-button-next bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-colors"
              onClick={() => swiper?.slideNext()}
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </motion.div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => swiper?.slideTo(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === swiper?.activeIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .testimonials-swiper .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 1;
          width: 8px;
          height: 8px;
          margin: 0 4px;
        }
        
        .testimonials-swiper .swiper-pagination-bullet-active {
          background: #2563eb;
        }
      `}</style>
    </section>
  )
}

export default Testimonials
