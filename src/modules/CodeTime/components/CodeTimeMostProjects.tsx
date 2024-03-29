/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import HoursAndMinutesFromSeconds from './HoursAndMinutesFromSeconds'
import useFetch from '../../../hooks/useFetch'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'

function CodeTimeMostProjects(): React.ReactElement {
  const [lastForProjects, setLastForProjects] = useState<
    '24 hours' | '7 days' | '30 days'
  >('24 hours')
  const [topProjects] = useFetch<Record<string, number>>(
    `code-time/projects?last=${lastForProjects}`
  )

  return (
    <div className="mt-16 flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="tabler:clipboard" className="text-3xl" />
          <span className="ml-2">
            Projects You&apos;ve Spent Most Time Doing
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <p className="font-medium tracking-wider">in the last</p>
          <div className="flex gap-2 rounded-lg p-2">
            {['24 hours', '7 days', '30 days'].map((last, index) => (
              <button
                key={index}
                onClick={() => {
                  setLastForProjects(last as '24 hours' | '7 days' | '30 days')
                }}
                className={`rounded-md p-4 px-6 tracking-wide ${
                  lastForProjects === last
                    ? 'bg-bg-200 font-semibold text-bg-800 dark:bg-bg-700/50 dark:text-bg-100'
                    : 'text-bg-500 hover:bg-bg-200/50 dark:hover:bg-bg-700/50'
                }`}
              >
                {last}
              </button>
            ))}
          </div>
        </div>
      </div>

      <APIComponentWithFallback data={topProjects}>
        <div className="flex w-full">
          {typeof topProjects !== 'string' &&
            Object.keys(topProjects).length > 0 &&
            Object.entries(topProjects)
              .slice(0, 5)
              .map(([key, value], index) => (
                <div
                  className={`h-6 border ${index === 0 && 'rounded-l-lg'} ${
                    index === 4 && 'rounded-r-lg'
                  } ${
                    [
                      'bg-red-500/20 border-red-500',
                      'bg-orange-500/20 border-orange-500',
                      'bg-yellow-500/20 border-yellow-500',
                      'bg-blue-500/20 border-blue-500',
                      'bg-emerald-500/20 border-emerald-500'
                    ][index]
                  }`}
                  key={key}
                  style={{
                    width: `${Math.round(
                      (value /
                        Object.entries(topProjects)
                          .slice(0, 5)
                          .reduce((a, b) => a + b[1], 0)) *
                        100
                    )}%`
                  }}
                ></div>
              ))}
        </div>
        <ul className="flex flex-col gap-4">
          {topProjects !== null &&
            Object.keys(topProjects).length > 0 &&
            Object.entries(topProjects)
              .slice(0, 5)
              .map(([key, value], index) => (
                <li
                  key={key}
                  className="relative flex items-center justify-between gap-4 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
                >
                  <div className="flex items-center gap-4 text-lg font-medium">
                    <div
                      className={`h-4 w-4 rounded-md border ${
                        [
                          'bg-red-500/20 border-red-500',
                          'bg-orange-500/20 border-orange-500',
                          'bg-yellow-500/20 border-yellow-500',
                          'bg-blue-500/20 border-blue-500',
                          'bg-emerald-500/20 border-emerald-500'
                        ][index]
                      } rounded-full`}
                    ></div>
                    {key}
                  </div>
                  <div className="text-3xl font-semibold">
                    <HoursAndMinutesFromSeconds seconds={value} />
                  </div>
                </li>
              ))}
        </ul>
      </APIComponentWithFallback>
    </div>
  )
}

export default CodeTimeMostProjects
