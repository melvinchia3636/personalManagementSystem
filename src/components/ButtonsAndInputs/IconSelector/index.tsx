/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable tailwindcss/migration-from-tailwind-2 */

/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import IconSet from './components/IconSet.tsx'
import IconSetList from './components/IconSetList.tsx'
import Search from './components/Search.tsx'

function IconSelector({
  isOpen,
  setOpen,
  setSelectedIcon
}: {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedIcon: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  const [currentIconSet, setCurrentIconSet] = useState(null)

  return (
    <div
      className={`absolute left-0 top-0 h-[100dvh] w-full bg-bg-900 transition-colors duration-500 ${
        isOpen ? 'z-[9999] bg-opacity-50' : 'z-[-1] bg-opacity-0 delay-500'
      }`}
    >
      <div
        className={`flex-center absolute left-0 top-0 flex h-[100dvh] w-full transition-all duration-500 ${
          isOpen ? 'translate-y-0' : 'translate-y-[110%]'
        }`}
      >
        <div className="510:mx-16 flex-center relative mx-4 flex max-h-[calc(100vh-8rem)] w-full flex-col rounded-lg bg-bg-900 shadow-2xl lg:w-3/4">
          <div className="mb-6 flex w-full items-center justify-between p-8 pb-0">
            {currentIconSet ? (
              <button
                onClick={() => {
                  setCurrentIconSet(null)
                }}
                type="button"
                className="flex items-center gap-2 text-lg"
              >
                <Icon icon="uil:arrow-left" className="h-7 w-7" />
                Go Back
              </button>
            ) : (
              <div className="flex items-end gap-2">
                <h1 className="flex items-center gap-3 text-2xl font-semibold">
                  <Icon icon="tabler:icons" className="h-7 w-7" />
                  Icon Selector
                </h1>
                <p className="shrink-0 text-right text-sm sm:text-base">
                  powered by&nbsp;
                  <a
                    target="_blank"
                    href="https://iconify.thecodeblog.net"
                    className="underline"
                    rel="noreferrer"
                  >
                    Iconify
                  </a>
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setOpen(false)
              }}
              className="rounded-md p-2 text-bg-100 transition-all hover:bg-bg-800"
            >
              <Icon icon="tabler:x" className="size-6" />
            </button>
          </div>
          {currentIconSet ? (
            currentIconSet.search ? (
              <Search
                searchTerm={currentIconSet.search}
                setCurrentIconSet={setCurrentIconSet}
                setSelectedIcon={setSelectedIcon}
                setOpen={setOpen}
              />
            ) : (
              <IconSet
                iconSet={currentIconSet.iconSet}
                setSelectedIcon={setSelectedIcon}
                setOpen={setOpen}
              />
            )
          ) : (
            <IconSetList setCurrentIconSet={setCurrentIconSet} />
          )}
        </div>
      </div>
    </div>
  )
}

export default IconSelector
