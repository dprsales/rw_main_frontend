import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BookingProvider } from './components/BookingModal'
import ScrollProgress from './components/ScrollProgress'
import { ThemeProvider } from './components/ThemeProvider'
import About from './pages/About'
import Careers from './pages/Careers'
import Coaching from './pages/Coaching'
import Consulting from './pages/Consulting'
import Contact from './pages/Contact'
import Form from './pages/Form'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Project from './pages/Project'
import Realty from './pages/Realty'

/** Every route change lands at the top, the way a full page load used to. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <BookingProvider>
        <ScrollToTop />
        <ScrollProgress />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coaching" element={<Coaching />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/realty" element={<Realty />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* /form is the track picker; each questionnaire has its own URL (/form/coaching etc) for direct links */}
          <Route path="/form" element={<Form />} />
          <Route path="/form/:track" element={<Form />} />
          <Route path="/realty/portfolio" element={<Portfolio />} />
          {/* Project detail pages, keyed by API slug; both bare and realty-nested paths resolve here */}
          <Route path="/projects/:slug" element={<Project />} />
          <Route path="/realty/projects/:slug" element={<Project />} />

          {/* Legacy URLs from the old site, still indexed — redirect to nearest live equivalent */}
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/services" element={<Navigate to="/" replace />} />
          <Route path="/services/luxury-sales-coach" element={<Navigate to="/coaching" replace />} />
          <Route path="/services/luxury-sales-consulting" element={<Navigate to="/consulting" replace />} />
          <Route path="/services/branding" element={<Navigate to="/consulting" replace />} />
          <Route path="/portfolio" element={<Navigate to="/realty/portfolio" replace />} />
          <Route path="/blogs" element={<Navigate to="/" replace />} />
          <Route path="/faqs" element={<Navigate to="/" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BookingProvider>
    </ThemeProvider>
  )
}
