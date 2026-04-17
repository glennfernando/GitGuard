'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const PartnerLogos: React.FC = () => {
  const logoRows = [
    [
      'logounicil.webp',
      'logomarseillefos.webp',
      'logochangouleme.webp',
      'logobrocliandeatlantique.webp',
      'logochumartinique.webp',
      'logosocredo.webp',
      'logoccibordeauxgironde.webp',
      'logochurouennormandie.webp',
      'logodoubsledepartement.webp',
      'logoghtcollinesdenormandie.webp',
      'logorovaltainmenuiseries.webp',
      'logoaereau.webp',
      'logoqualityassistance.webp',
      'logomelunhydraulique.webp',
      'logoforbach.webp'
    ],
    [
      'logopalaisdesfestivalsetdescongres.webp',
      'logooperadelyon.webp',
      'logomairiecolombes.webp',
      'logovilledesaintchamas.webp',
      'logoneovixbiosciencesgroupe.webp',
      'logolouisroederer.webp',
      'logopasdecalaishabitat.webp',
      'logounysilva.webp',
      'logograndfrais1.webp',
      'logoolivades.webp',
      'logonereides.webp',
      'logomairiesartrouville.webp',
      'logolaboroadel.webp',
      'logoinddigo.webp',
      'logocreusotmontceau.webp'
    ]
  ]

  const mediaLogos = [
    'BFMBusiness.svg',
    'France3.svg',
    'kisspng-m6-group-logo-television-france-5af438a39971b91.svg',
    'Latribune.svg',
    'Lefigaro.svg',
    'Lesechos.svg'
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <>
      {/* Customer Logos Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center mb-8">
              <div className="h-px bg-gray-300 w-20"></div>
              <h2 className="px-6 text-2xl font-semibold uppercase tracking-wider text-gray-900">
                MORE THAN 24 000 ORGANIZATIONS TRUST US
              </h2>
              <div className="h-px bg-gray-300 w-20"></div>
            </div>
          </motion.div>

          {/* Scrolling Logo Rows */}
          <div className="space-y-8 overflow-hidden">
            {logoRows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative">
                <motion.div
                  className="flex space-x-8"
                  animate={{
                    x: [0, -50 * row.length]
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: 'loop',
                      duration: 30 + rowIndex * 5,
                      ease: 'linear'
                    }
                  }}
                >
                  {/* Duplicate logos for seamless loop */}
                  {[...row, ...row].map((logo, index) => (
                    <div
                      key={`${rowIndex}-${index}`}
                      className="flex-shrink-0 w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center p-4"
                    >
                      <img
                        src={`/logos/${logo}`}
                        alt={`Partner logo ${index + 1}`}
                        className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Logo</div>`;
                          }
                        }}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Logos Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center mb-8">
                <div className="h-px bg-gray-300 w-20"></div>
                <h2 className="px-6 text-2xl font-semibold uppercase tracking-wider text-gray-900">
                  They talk about us
                </h2>
                <div className="h-px bg-gray-300 w-20"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-4xl mx-auto">
              {mediaLogos.map((logo, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={`/logos/${logo}`}
                    alt={`Media logo ${index + 1}`}
                    className="max-w-full h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Media</div>`;
                      }
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default PartnerLogos
