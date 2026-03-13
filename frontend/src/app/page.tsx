import { HeroSection } from "@/components/sections/HeroSection"
import { ServicesSection } from "@/components/sections/ServicesSection";
import { GraphicDesignPreview } from "@/components/sections/GraphicDesignPreview";
import { CodeTransformation } from "@/components/sections/CodeTransformation";
import { ShowreelSection } from "@/components/sections/ShowreelSection"
import { PackagesSection } from "@/components/sections/PackagesSection"
import { ResultsSection } from "@/components/sections/ResultsSection"
import { CTASection } from "@/components/sections/CTASection"
import { ClientLogosSection } from "@/components/sections/ClientLogosSection";
import { AboutSection } from "@/components/sections/AboutSection"
import { TeamSection } from "@/components/sections/TeamSection"
import { ClientReviewMarquee } from "@/components/sections/ClientReviewMarquee"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { FAQSection } from "@/components/sections/FAQSection"

import { getHeroData } from "@/actions/hero"
import { getStatsBySection, getSectionContent, getShowreelVideos, getSuccessStoryVideos, getSelectedGraphics } from "@/actions/sections"
import { getPackages } from "@/actions/admin-modules"
import { getClientReviews } from "@/actions/client-reviews"
import { getServices } from "@/actions/services"
import { getTestimonials } from "@/actions/testimonials"
import { getTeamMembers } from "@/actions/team"
import { getFAQs } from "@/actions/faq"
import { getClientLogos } from "@/actions/client-logos"

// ====================================================================
// DATA ARCHITECTURE OVERVIEW (for future AI agents / developers)
//
// All section components below receive DB data as props via server actions.
// However, MOST components currently BYPASS the DB data and use hardcoded
// defaults or i18n translations instead, because the DB contains test/
// duplicate entries from the api/seed route.
//
// BYPASSED (using i18n/defaults, DB data ignored):
//   HeroSection, ShowreelSection,
//   CTASection, AboutSection, TeamSection, FAQSection,
//   TestimonialsSection, ResultsSection
//   → Each has a comment block explaining how to re-enable DB data.
//
// WORKING WITH DB (real seeded content, no test data issues):
//   ServicesSection, PackagesSection, GraphicDesignPreview, ClientReviewMarquee,
//   VideoGallery, GraphicDesignGallery
//
// FULLY HARDCODED (no DB props at all):
//   ClientLogosSection, CodeTransformation, CallToActionSection
//
// TO RE-ENABLE DB DATA FOR BYPASSED COMPONENTS:
//   1. Clean up test data in DB (delete test entries from api/seed route)
//   2. Add real content via admin panel
//   3. In each component, follow the "TO RE-ENABLE DB DATA" comment
// ====================================================================

export default async function Home() {
  // Parallel Data Fetching
  const [
    heroData,
    resultsStats,
    aboutStats,
    packages,
    aboutContent,
    showreelContent,
    showreelVideos,
    successStoryVideos,
    ctaContent,
    clientReviews,
    services,
    testimonials,
    team,
    faqs,
    selectedGraphics,
    clientLogos,
    clientLogosContent
  ] = await Promise.all([
    getHeroData(),
    getStatsBySection('results'),
    getStatsBySection('about'),
    getPackages(),
    getSectionContent('about'),
    getSectionContent('showreel'),
    getShowreelVideos(),
    getSuccessStoryVideos(),
    getSectionContent('cta_main'),
    getClientReviews(),
    getServices(),
    getTestimonials(),
    getTeamMembers(),
    getFAQs(),
    getSelectedGraphics(),
    getClientLogos(),
    getSectionContent('client-logos')
  ])

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <HeroSection data={heroData} />
      {((showreelContent?.settings as any)?.isVisible !== false) && (
        <ShowreelSection content={showreelContent} videos={showreelVideos} />
      )}
      <ClientLogosSection content={clientLogosContent} logos={clientLogos} />
      <ServicesSection services={services} />
      <GraphicDesignPreview items={selectedGraphics} />
      <CodeTransformation />
      <ResultsSection stats={resultsStats} />
      <PackagesSection packages={packages} />
      <TestimonialsSection videos={successStoryVideos} />
      <ClientReviewMarquee reviews={clientReviews} />
      <AboutSection content={aboutContent} stats={aboutStats} />
      <TeamSection team={team} />
      <FAQSection faqs={faqs} />
      <CTASection content={ctaContent} />
    </main>
  )
}
