import React, { useContext } from 'react'
import { GlobalStateContext } from '@providers/GlobalStateProvider'
import { Icon } from '@iconify/react'

function SidebarHeader(): React.ReactElement {
  const { sidebarExpanded, toggleSidebar } = useContext(GlobalStateContext)

  return (
    <div
      className={`flex h-24 w-full items-center justify-between pl-6 transition-none ${
        !sidebarExpanded ? 'my-6 overflow-hidden sm:my-5' : 'my-4'
      }`}
    >
      <h1 className="ml-1 flex shrink-0 items-center gap-2 whitespace-nowrap text-xl font-semibold text-bg-800 dark:text-bg-100">
        <Icon icon="tabler:hammer" className="text-3xl text-custom-500" />
        {sidebarExpanded && (
          <div>
            LifeForge<span className="text-3xl text-custom-500"> .</span>
          </div>
        )}
      </h1>
      {sidebarExpanded && (
        <button
          onClick={toggleSidebar}
          className="p-6 text-bg-500 transition-all hover:text-bg-800 dark:hover:text-bg-100"
        >
          <Icon icon="tabler:menu" className="text-2xl" />
        </button>
      )}
    </div>
  )
}

export default SidebarHeader
