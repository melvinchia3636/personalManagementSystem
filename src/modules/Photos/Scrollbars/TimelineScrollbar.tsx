/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { type IPhotosEntry } from '..'

function TimelineScrollbar({
  photos,
  galleryWrapperRef,
  timelineDateDisplayRef,
  isDragging,
  setIsDragging
}: {
  photos: IPhotosEntry | 'loading' | 'error'
  timelineDateDisplayRef: React.RefObject<HTMLDivElement>
  galleryWrapperRef: React.RefObject<HTMLDivElement>
  isDragging: boolean
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const [eachDayDimensions, setEachDayDimensions] = useState<
    Record<
      string,
      {
        inTimeline: number
        inGallery: number
      }
    >
  >({})
  const [currentDateInViewPort, setCurrentDateInViewPort] = useState<string>('')

  const movingTimelineDateDisplayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (typeof photos !== 'string' && galleryWrapperRef.current !== null) {
        const galleryContainerHeight = galleryWrapperRef.current.scrollHeight
        const wrapperHeight = galleryWrapperRef.current.offsetHeight

        setCurrentDateInViewPort(Object.keys(photos.items)[0])

        const eachDayHeight: Record<
          string,
          {
            inTimeline: number
            inGallery: number
          }
        > = {}

        for (const day of Object.keys(photos.items)) {
          const element = document.getElementById(day)!
          const { y, height } = element.getBoundingClientRect()
          eachDayHeight[day] = {
            inTimeline:
              Number(((y + height) / galleryContainerHeight).toPrecision(2)) *
              wrapperHeight,
            inGallery: y
          }
        }

        console.log(eachDayDimensions)
        setEachDayDimensions(eachDayHeight)
      }
    }, 1000)
  }, [photos, galleryWrapperRef])

  return (
    <>
      {typeof photos !== 'string' && (
        <>
          <div
            onMouseMove={e => {
              if (galleryWrapperRef.current !== null) {
                const rect = (
                  e.target as HTMLDivElement
                ).getBoundingClientRect()
                const mousePosition = Math.round(e.clientY - rect.top)

                const galleryContainerHeight =
                  galleryWrapperRef.current.scrollHeight
                const mousePositionInGalleryContainer =
                  (mousePosition / rect.height) * galleryContainerHeight

                let targetDate = ''

                for (const day of Object.keys(eachDayDimensions)) {
                  if (
                    eachDayDimensions[day].inGallery <
                    mousePositionInGalleryContainer
                  ) {
                    targetDate = day
                  } else {
                    break
                  }
                }

                if (movingTimelineDateDisplayRef.current !== null) {
                  movingTimelineDateDisplayRef.current.style.top = `${
                    mousePosition - 36
                  }px`

                  movingTimelineDateDisplayRef.current.innerHTML =
                    moment(targetDate).format('MMM D, YYYY')
                }

                if (isDragging && galleryWrapperRef.current !== null) {
                  galleryWrapperRef.current.scrollTop =
                    mousePositionInGalleryContainer
                }
              }
            }}
            onMouseLeave={() => {
              setIsDragging(false)
            }}
            onMouseDown={() => {
              setIsDragging(true)
            }}
            onMouseUp={() => {
              setIsDragging(false)
            }}
            onMouseUpCapture={() => {
              setIsDragging(false)
            }}
            onMouseOut={() => {
              if (
                galleryWrapperRef.current !== null &&
                timelineDateDisplayRef.current !== null
              ) {
                const { scrollTop, scrollHeight, clientHeight } =
                  galleryWrapperRef.current

                timelineDateDisplayRef.current.style.top = `${Math.round(
                  (scrollTop / scrollHeight) * clientHeight - 36
                )}px`
              }
            }}
            onClick={e => {
              if (galleryWrapperRef.current !== null) {
                const galleryContainerHeight =
                  galleryWrapperRef.current.scrollHeight
                const rect = (
                  e.target as HTMLDivElement
                ).getBoundingClientRect()
                const mousePosition = Math.round(e.clientY - rect.top)
                const mousePositionInGalleryContainer =
                  (mousePosition / rect.height) * galleryContainerHeight

                galleryWrapperRef.current.scrollTop = Math.round(
                  mousePositionInGalleryContainer
                )
              }
            }}
            className="group peer absolute right-0 top-0 h-full w-0 sm:w-16"
          >
            {JSON.stringify(eachDayDimensions) !== '{}' && (
              <>
                {Object.entries(photos.firstDayOfYear)
                  .filter(e => e[0] !== 'NaN')
                  .map(([year, date]) => (
                    <span
                      key={year}
                      className="pointer-events-none absolute z-[5] hidden h-8 w-full -translate-y-8 items-center justify-center bg-bg-100 text-sm text-bg-500 dark:bg-bg-950 sm:flex"
                      style={{
                        top: `${eachDayDimensions[date].inTimeline}px`
                      }}
                    >
                      {year}
                    </span>
                  ))}
                {Object.entries(photos.firstDayOfMonth)
                  .filter(e => e[0] !== 'NaN')
                  .map(([month, date]) => (
                    <span
                      key={month}
                      className="pointer-events-none absolute right-1/2 hidden h-1 w-1 -translate-y-1 translate-x-1/2 rounded-full bg-bg-400 dark:bg-bg-700 sm:flex"
                      style={{
                        top: `${eachDayDimensions[date].inTimeline}px`
                      }}
                    ></span>
                  ))}
              </>
            )}
          </div>
          <div
            ref={movingTimelineDateDisplayRef}
            className={
              'pointer-events-none absolute right-14 z-[10] hidden rounded-t-md border-b-2 border-custom-500 bg-bg-200 p-2 text-sm shadow-md dark:bg-bg-800 sm:right-3 sm:peer-hover:block'
            }
          ></div>
          {currentDateInViewPort !== '' && (
            <div
              ref={timelineDateDisplayRef}
              className={`pointer-events-none absolute right-14 z-[10] hidden rounded-t-md border-b-2 border-custom-500 bg-bg-200 p-2 text-sm shadow-md dark:bg-bg-800 sm:right-3 sm:block ${
                isDragging && '!hidden'
              }`}
            >
              {moment(currentDateInViewPort).format('MMM D, YYYY')}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default TimelineScrollbar
