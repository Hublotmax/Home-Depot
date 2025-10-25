import TopBanner from "@/components/top-banner"
import Header from "@/components/header"
import HeroBanner from "@/components/hero-banner"
import PromoBanner from "@/components/promo-banner"
import CategoryNav from "@/components/category-nav"
import RecentlyViewed from "@/components/recently-viewed"
import SpecialBuy from "@/components/special-buy"
import Footer from "@/components/footer"
import RewardModal from "@/components/reward-modal"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <TopBanner />
      <Header />
      <div className="container mx-auto px-4 space-y-4 pb-8">
        <HeroBanner />
        <PromoBanner />
        <CategoryNav />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <RecentlyViewed />
          </div>
          <div>
            <SpecialBuy />
          </div>
        </div>
      </div>
      <Footer />
      <RewardModal />
    </main>
  )
}
