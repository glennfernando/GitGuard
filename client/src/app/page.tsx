import React from 'react'
import Footer from '@/components/layout/Footer'
import HeroBanner from '@/components/sections/HeroBanner'
import StatisticsCards from '@/components/sections/StatisticsCards'
import Technologies from '@/components/sections/Technologies'
import PlatformTabs from '@/components/sections/PlatformTabs'
import Testimonials from '@/components/sections/Testimonials'
import PartnerLogos from '@/components/sections/PartnerLogos'
import Resources from '@/components/sections/Resources'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <div id="page-home">
          <HeroBanner />
          <StatisticsCards />
          <Technologies />
          <PlatformTabs />
          <Testimonials />
          <PartnerLogos />
          <Resources />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Home
