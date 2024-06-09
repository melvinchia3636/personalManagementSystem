import moment from 'moment'
import React from 'react'
import { type ICalendarCategory, type ICalendarEvent } from '@typedec/Calendar'

interface MiniCalendarDateItemProps {
  index: number
  actualIndex: number
  firstDay: number
  lastDate: number
  date: Date
  events: ICalendarEvent[]
  categories: ICalendarCategory[] | 'loading' | 'error'
}

function MiniCalendarDateItem({
  index,
  actualIndex,
  firstDay,
  lastDate,
  date,
  events,
  categories
}: MiniCalendarDateItemProps): React.ReactElement {
  function getEventsOnTheDay(): ICalendarEvent[] {
    return !(firstDay > index || index - firstDay + 1 > lastDate)
      ? events.filter(event => {
          return moment(
            `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
            'YYYY-M-DD'
          ).isBetween(
            moment(event.start),
            moment(event.end).subtract(1, 'second'),
            'day',
            '[]'
          )
        })
      : []
  }

  return (
    <div
      key={index}
      className={`relative isolate flex flex-col items-center gap-1 text-sm ${
        firstDay > index || index - firstDay + 1 > lastDate
          ? 'text-bg-300 dark:text-bg-600'
          : ''
      } ${
        moment().isSame(
          moment(`${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`),
          'day'
        )
          ? "font-semibold after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:size-10 after:-translate-x-1/2 after:-translate-y-6 after:rounded-md after:border after:border-custom-500 after:bg-custom-500/10 after:content-['']"
          : ''
      }`}
    >
      <span>{actualIndex}</span>
      {(() => {
        const eventsOnTheDay = getEventsOnTheDay()

        return (
          eventsOnTheDay.length > 0 && (
            <div className="flex w-full items-center justify-center gap-px">
              {eventsOnTheDay.slice(0, 3).map(event => (
                <div
                  key={event.id}
                  style={{
                    backgroundColor:
                      typeof categories !== 'string'
                        ? categories.find(
                            category => category.id === event.category
                          )?.color
                        : ''
                  }}
                  className={'size-1 rounded-full'}
                />
              ))}
            </div>
          )
        )
      })()}
    </div>
  )
}

export default MiniCalendarDateItem
