import MainRecommendLiveCard from '@/components/card/MainRecommendLiveCard'
import CardSection from '@/components/layout/CardSection'
import MainListingCard from '@/components/card/MainListingCard'

export default function HomePage() {
  return (
    <section className="flex flex-col gap-10 p-4">
      <CardSection title="실시간 인기 방송">
        <div className="scrollbar-hide flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto scroll-smooth md:grid md:flex-none md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:gap-6 md:overflow-visible">
          <MainRecommendLiveCard />
          <MainRecommendLiveCard />
          <MainRecommendLiveCard />
          <MainRecommendLiveCard />
          <MainRecommendLiveCard />
          <MainRecommendLiveCard />
          <MainRecommendLiveCard />
          <MainRecommendLiveCard />
        </div>
      </CardSection>

      <CardSection title="추천 매물">
        <div className="scrollbar-hide flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto scroll-smooth md:grid md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:gap-6 md:overflow-visible">
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
        </div>
      </CardSection>

      <CardSection title="경매 임박 매물">
        <div className="scrollbar-hide flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto scroll-smooth md:grid md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:gap-6 md:overflow-visible">
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
          <MainListingCard />
        </div>
      </CardSection>
    </section>
  )
}
