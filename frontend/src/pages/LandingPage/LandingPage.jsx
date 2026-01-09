
import FAQs from '../../components/landing/FAQs'
import Features from '../../components/landing/Features'
import Footer from '../../components/landing/Footer'
import Header from '../../components/landing/Header'
import Hero from '../../components/landing/Hero'
import Testimonial from '../../components/landing/Testimonial'


const LandingPage = () => {
  return (
    <div>
      <Header/>
      <main>
        <Hero/>
        <Features/>
        <Testimonial/>
        <FAQs/>
        <Footer/>
      </main>
    </div>
  )
}

export default LandingPage