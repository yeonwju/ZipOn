import ListingItem from '@/components/item/main/ListingItem'
import RecommendLiveItem from '@/components/item/main/RecommendLiveItem'
import SideScrollCardSection from '@/components/layout/SideScrollCardSection'

export default function HomePage() {
  return (
    <section className="flex flex-col gap-10 p-2">
      <SideScrollCardSection title="실시간 인기 방송" cardMinWidth="220px">
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
        <RecommendLiveItem />
      </SideScrollCardSection>

      <SideScrollCardSection title="추천 매물">
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
      </SideScrollCardSection>

      <SideScrollCardSection title="경매 임박 매물">
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
        <ListingItem />
      </SideScrollCardSection>
    </section>
  )
}
