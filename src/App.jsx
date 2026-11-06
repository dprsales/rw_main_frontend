import React, { Suspense, lazy, useEffect, useLayoutEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BookingProvider } from './components/BookingModal'
import ScrollProgress from './components/ScrollProgress'
import SiteLoader from './components/SiteLoader'
import HiringModal from './components/HiringModal'
import { ThemeProvider } from './components/ThemeProvider'
import { LangProvider } from './i18n/LangProvider'
import { ListingAuthProvider } from './listings/AuthContext'
import { headerOffset } from './hooks/useSmoothScroll'
import { useSiteVisitTracker } from './hooks/useSiteVisitTracker'
import About from './pages/About'
import Article from './pages/Article'
import Articles from './pages/Articles'
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
import ProjectHyderabad from './pages/ProjectHyderabad'
import Project from './pages/Project'
import Realty from './pages/Realty'
import Start from './pages/Start'
import Partner from './pages/Partner'
import PartnerTerms from './pages/PartnerTerms'
import VendorPartner from './pages/VendorPartner'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import Faqs from './pages/Faqs'

const ListPropertyPage = lazy(() => import('./listings/pages/ListPropertyPage'))
const DashboardPage = lazy(() => import('./listings/pages/DashboardPage'))
const LoginPage = lazy(() => import('./listings/pages/LoginPage'))
const ResetPasswordPage = lazy(() => import('./listings/pages/ResetPasswordPage'))
const ListingDetailPage = lazy(() => import('./listings/pages/ListingDetailPage'))

function ListingsRedirect() {
  const { search } = useLocation()
  return <Navigate to={{ pathname: '/list-property', search, hash: '#listings' }} replace />
}

// Stop the browser (Safari especially) restoring the old scroll position on reload,
// which would land a refreshed homepage on the finder instead of the hero.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

/** The pixel in index.html already sends the landing PageView. This covers the
 *  routes a visitor opens after that, which never reload the document. */
function MetaPageView() {
  const { pathname } = useLocation()
  const skipFirst = useRef(true)
  useEffect(() => {
    if (skipFirst.current) { skipFirst.current = false; return }
    if (typeof window.fbq === 'function') window.fbq('track', 'PageView')
  }, [pathname])
  return null
}

/** Every route change lands at the top before the page is painted - unless the link
 *  names a section (e.g. /coaching#assessment), which lands on that section. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useLayoutEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return }
    const id = decodeURIComponent(hash.slice(1))
    const targetY = (el) => Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset())
    let frame
    let settleTimer
    let tries = 0
    const go = () => {
      const el = document.getElementById(id)
      if (!el) {
        // The page may still be rendering; give it ~1s before falling back to the top.
        if (++tries < 60) frame = requestAnimationFrame(go)
        else window.scrollTo(0, 0)
        return
      }
      window.scrollTo(0, targetY(el))
      // Images above the section can still shift it; correct once, unless the visitor has scrolled.
      const landedAt = window.scrollY
      settleTimer = setTimeout(() => {
        if (Math.abs(window.scrollY - landedAt) < 4 && Math.abs(targetY(el) - landedAt) > 8) window.scrollTo(0, targetY(el))
      }, 700)
    }
    go()
    return () => { cancelAnimationFrame(frame); clearTimeout(settleTimer) }
  }, [pathname, hash])
  return null
}

export default function App() {
  useSiteVisitTracker()

  return (
    <ThemeProvider>
      <LangProvider>
        <SiteLoader />
        <BookingProvider>
          <ListingAuthProvider>
          <ScrollToTop />
          <MetaPageView />
          <ScrollProgress />
          <HiringModal />
          <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg)' }} />}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coaching" element={<Coaching />} />
          {/* KRISAH returns here after the assessment — the route maps to a score scenario. */}
          <Route path="/coaching/result" element={<CoachingResult />} />
          <Route path="/coaching/result/:scenario" element={<CoachingResult />} />
          {/* Checkout: selection → details → review → purchase request (UI only, no gateway wired). */}
          <Route path="/coaching/purchase" element={<CoachingPurchase />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/project-hyderabad" element={<ProjectHyderabad />} />
          <Route path="/realty" element={<Realty />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/apply" element={<CareersApply />} />
          <Route path="/careers/:roleSlug" element={<CareersApply />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/assesment" element={<Assessment />} />
          <Route path="/assessment/result" element={<AssessmentResult />} />
          <Route path="/about" element={<About />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<Article />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/partner/terms" element={<PartnerTerms />} />
          {/* /start is the guided finder on its own page; service pages link here with ?who= */}
          <Route path="/start" element={<Start />} />
          {/* /form is the track picker; each questionnaire has its own URL (/form/coaching etc) for direct links */}
          <Route path="/form" element={<Form />} />
          <Route path="/form/:track" element={<Form />} />
          <Route path="/realty/portfolio" element={<Portfolio />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/vendorpartner" element={<VendorPartner />} />
          {/* Project detail pages, keyed by API slug; both bare and realty-nested paths resolve here */}
          <Route path="/projects/:slug" element={<Project />} />
          <Route path="/realty/projects/:slug" element={<Project />} />

          {/* Property listings — builders list, team approves by email, approved ones go live */}
          <Route path="/list-property" element={<ListPropertyPage key="new" />} />
          <Route path="/list-property/edit/:id" element={<ListPropertyPage key="edit" />} />
          <Route path="/list-property/login" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/list-property/login" replace />} />
          <Route path="/list-property/dashboard" element={<DashboardPage />} />
          <Route path="/list-property/reset-password" element={<ResetPasswordPage />} />
          <Route path="/realty/listings" element={<ListingsRedirect />} />
          <Route path="/realty/listings/:slug" element={<ListingDetailPage />} />

          {/* Legacy URLs from the old site, still indexed — redirect to nearest live equivalent */}
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/services" element={<Navigate to="/" replace />} />
          <Route path="/services/luxury-sales-coach" element={<Navigate to="/coaching" replace />} />
          <Route path="/services/luxury-sales-consulting" element={<Navigate to="/consulting" replace />} />
          <Route path="/services/branding" element={<Navigate to="/consulting" replace />} />
          <Route path="/portfolio" element={<Navigate to="/realty/portfolio" replace />} />
          <Route path="/blogs" element={<Navigate to="/articles" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
          </ListingAuthProvider>
        </BookingProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
