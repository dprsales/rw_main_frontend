import React, { useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BookingProvider } from './components/BookingModal'
import ScrollProgress from './components/ScrollProgress'
import SiteLoader from './components/SiteLoader'
import { ThemeProvider } from './components/ThemeProvider'
import { useSiteVisitTracker } from './hooks/useSiteVisitTracker'
import About from './pages/About'
import Assessment from './pages/Assessment'
import AssessmentResult from './pages/AssessmentResult'
import Careers from './pages/Careers'
import CareersApply from './pages/CareersApply'
import Coaching from './pages/Coaching'
import CoachingResult from './pages/CoachingResult'
import CoachingPurchase from './pages/CoachingPurchase'
import Consulting from './pages/Consulting'
import Contact from './pages/Contact'
import Form from './pages/Form'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Project from './pages/Project'
import Realty from './pages/Realty'
import Start from './pages/Start'
import Partner from './pages/Partner'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'

// Stop the browser (Safari especially) restoring the old scroll position on reload,
// which would land a refreshed homepage on the finder instead of the hero.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

/** Every route change lands at the top before the page is painted. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  useSiteVisitTracker()

  return (
    <ThemeProvider>
      {/* <SiteLoader /> */}
      <BookingProvider>
        <ScrollToTop />
        <ScrollProgress />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coaching" element={<Coaching />} />
          {/* KRISAH returns here after the assessment — the route maps to a score scenario. */}
          <Route path="/coaching/result" element={<CoachingResult />} />
          <Route path="/coaching/result/:scenario" element={<CoachingResult />} />
          {/* Checkout: selection → details → review → purchase request (UI only, no gateway wired). */}
          <Route path="/coaching/purchase" element={<CoachingPurchase />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/realty" element={<Realty />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/apply" element={<CareersApply />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/assesment" element={<Assessment />} />
          <Route path="/assessment/result" element={<AssessmentResult />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          {/* /start is the guided finder on its own page; service pages link here with ?who= */}
          <Route path="/start" element={<Start />} />
          {/* /form is the track picker; each questionnaire has its own URL (/form/coaching etc) for direct links */}
          <Route path="/form" element={<Form />} />
          <Route path="/form/:track" element={<Form />} />
          <Route path="/realty/portfolio" element={<Portfolio />} />
          <Route path="/partner" element={<Partner />} />
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
