'use client'

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  highlightDates = [],
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
  highlightDates?: Date[]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'bg-background group/calendar w-full py-1 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: date => date.toLocaleString('ko-KR', { month: 'long' }),
        formatCaption: date => date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('flex gap-4 flex-col md:flex-row relative', defaultClassNames.months),
        month: cn('flex flex-col w-full gap-2', defaultClassNames.month),
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between px-27',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn('absolute bg-popover inset-0 opacity-0', defaultClassNames.dropdown),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-sm'
            : 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5',
          defaultClassNames.caption_label
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground pb-1 flex-1 font-normal text-[0.8rem] select-none border-b border-gray-300',
          defaultClassNames.weekday
        ),
        week: cn('flex w-full py-1 border-b border-gray-300', defaultClassNames.week),
        week_number_header: cn('select-none w-(--cell-size)', defaultClassNames.week_number_header),
        week_number: cn(
          'text-[0.8rem] select-none text-muted-foreground',
          defaultClassNames.week_number
        ),
        day: cn(
          'flex justify-center w-full h-full px-0.5 text-center [&:last-child[data-selected=true]_button]:rounded-md group/day select-none',
          defaultClassNames.day
        ),
        range_start: cn('rounded-l-md bg-accent', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('rounded-r-md bg-accent', defaultClassNames.range_end),
        // ✅ 오늘날짜 기본 스타일 (기본 배경만 설정)
        today: cn('bg-blue-50 text-blue-700 rounded-md', defaultClassNames.today),
        outside: cn(
          'text-muted-foreground aria-selected:text-muted-foreground',
          defaultClassNames.outside
        ),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left')
            return <ChevronLeftIcon className={cn('size-4', className)} {...props} />
          if (orientation === 'right')
            return <ChevronRightIcon className={cn('size-4', className)} {...props} />
          return <ChevronDownIcon className={cn('size-4', className)} {...props} />
        },
        DayButton: props => <CalendarDayButton {...props} highlightDates={highlightDates} />,
        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  )
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  highlightDates = [],
  ...props
}: React.ComponentProps<typeof DayButton> & { highlightDates?: Date[] }) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isHighlighted = highlightDates.some(d => d.toDateString() === day.date.toDateString())
  const isToday = modifiers.today
  const isSelected = modifiers.selected
  const isOutside = modifiers.outside // ✅ 현재 월 외 날짜 여부

  const dayOfWeek = day.date.getDay()

  // ✅ 요일별 색상 (일요일=빨강, 토요일=파랑, 나머지=기본)
  const textColor = isOutside
    ? 'text-gray-300' // ✅ 이번 달이 아닌 날짜
    : dayOfWeek === 0
      ? 'text-red-500'
      : dayOfWeek === 6
        ? 'text-blue-500'
        : 'text-foreground'

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toISOString().split('T')[0]} // ex) 2025-11-02
      data-selected={isSelected}
      className={cn(
        // ✅ 기본 정사각형 & 중앙 정렬
        'relative flex aspect-square w-full items-center justify-center rounded-md leading-none font-normal transition-colors duration-150',
        // ✅ 오늘 날짜 스타일
        isToday && 'bg-blue-200 p-0.5 text-blue-600',
        // ✅ 클릭(선택) 시 하이라이트
        isSelected && 'bg-gray-200 text-white',
        // ✅ hover 효과
        'hover:bg-accent hover:text-accent-foreground',
        // ✅ 요일/외부날짜 색상
        textColor,
        defaultClassNames.day,
        className
      )}
      {...props}
    >
      {/* 날짜 숫자 */}
      <span className="flex items-center justify-center text-[13px]">{day.date.getDate()}</span>

      {/* 하이라이트 dot */}
      {isHighlighted && (
        <span className="absolute bottom-[3px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-blue-500" />
      )}
    </Button>
  )
}

export { Calendar, CalendarDayButton }
