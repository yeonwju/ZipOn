import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  AreaFilter,
  DirectionFilter,
  FloorFilter,
  PriceFilter,
  RoomCountFilter,
} from '@/types/filter'
import type { AuctionType, BuildingType } from '@/types/models/listing'

/**
 * 지도 필터 상태 타입
 */
interface MapFilterState {
  // 필터 상태
  priceFilter: PriceFilter
  roomCountFilter?: RoomCountFilter
  areaFilter?: AreaFilter
  floorFilter?: FloorFilter
  directionFilter?: DirectionFilter
  buildingType: BuildingType | 'all'
  auctionFilter: AuctionType

  // 필터 변경 액션
  setPriceFilter: (filter: PriceFilter) => void
  setRoomCountFilter: (filter?: RoomCountFilter) => void
  setAreaFilter: (filter?: AreaFilter) => void
  setFloorFilter: (filter?: FloorFilter) => void
  setDirectionFilter: (filter?: DirectionFilter) => void
  setBuildingType: (type: BuildingType | 'all') => void
  setAuctionFilter: (type: AuctionType) => void

  // 유틸리티 액션
  resetAllFilters: () => void
  hasActiveFilters: () => boolean
}

/**
 * 초기 필터 상태
 */
const initialFilterState = {
  priceFilter: {
    deposit: { min: 0, max: null },
    rent: { min: 0, max: null },
    maintenance: { min: 0, max: null },
  },
  roomCountFilter: undefined,
  areaFilter: undefined,
  floorFilter: undefined,
  directionFilter: undefined,
  buildingType: 'all' as const,
  auctionFilter: 'all' as AuctionType,
}

/**
 * 지도 필터 관리 Store
 *
 * 지도 페이지의 모든 필터 상태를 중앙에서 관리합니다.
 * persist 미들웨어를 통해 브라우저 새로고침 후에도 필터가 유지됩니다.
 *
 * @example
 * ```tsx
 * // 필터 가져오기
 * const priceFilter = useMapFilterStore(state => state.priceFilter)
 *
 * // 필터 변경하기
 * const setPriceFilter = useMapFilterStore(state => state.setPriceFilter)
 * setPriceFilter({ deposit: { min: 1000, max: 5000 }, ... })
 *
 * // 모든 필터 초기화
 * const resetAllFilters = useMapFilterStore(state => state.resetAllFilters)
 * resetAllFilters()
 * ```
 */
export const useMapFilterStore = create<MapFilterState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      ...initialFilterState,

      // 필터 변경 액션
      setPriceFilter: (filter: PriceFilter) => set({ priceFilter: filter }),
      setRoomCountFilter: (filter?: RoomCountFilter) => set({ roomCountFilter: filter }),
      setAreaFilter: (filter?: AreaFilter) => set({ areaFilter: filter }),
      setFloorFilter: (filter?: FloorFilter) => set({ floorFilter: filter }),
      setDirectionFilter: (filter?: DirectionFilter) => set({ directionFilter: filter }),
      setBuildingType: (type: BuildingType | 'all') => set({ buildingType: type }),
      setAuctionFilter: (type: AuctionType) => set({ auctionFilter: type }),

      // 모든 필터 초기화
      resetAllFilters: () => set(initialFilterState),

      // 활성 필터 존재 여부 확인
      hasActiveFilters: () => {
        const state = get()
        return (
          state.buildingType !== 'all' ||
          state.auctionFilter !== 'all' ||
          state.roomCountFilter !== undefined ||
          state.areaFilter !== undefined ||
          state.floorFilter !== undefined ||
          state.directionFilter !== undefined ||
          state.priceFilter.deposit.min > 0 ||
          state.priceFilter.deposit.max !== null ||
          state.priceFilter.rent.min > 0 ||
          state.priceFilter.rent.max !== null ||
          state.priceFilter.maintenance.min > 0 ||
          state.priceFilter.maintenance.max !== null
        )
      },
    }),
    {
      name: 'map-filter-storage',
      partialize: (state: MapFilterState) => ({
        priceFilter: state.priceFilter,
        roomCountFilter: state.roomCountFilter,
        areaFilter: state.areaFilter,
        floorFilter: state.floorFilter,
        directionFilter: state.directionFilter,
        buildingType: state.buildingType,
        auctionFilter: state.auctionFilter,
      }),
    }
  )
)

