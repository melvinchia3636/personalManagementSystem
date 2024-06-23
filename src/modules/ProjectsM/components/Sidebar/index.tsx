import React from 'react'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import Scrollbar from '@components/Scrollbar'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import SidebarSection from './components/SidebarSection'
import StatusSection from './components/StatusSection'

function Sidebar(): React.ReactElement {
  const { sidebarOpen, setSidebarOpen } = useProjectsMContext().miscellaneous
  return (
    <aside
      className={`absolute ${
        sidebarOpen ? 'left-0' : 'left-full'
      } top-0 z-[9999] size-full rounded-lg bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-2rem)] lg:w-1/4`}
    >
      <Scrollbar>
        <div className="flex items-center justify-between px-8 py-4 lg:hidden">
          <GoBackButton
            onClick={() => {
              setSidebarOpen(false)
            }}
          />
        </div>
        <ul className="flex flex-col">
          <SidebarItem icon="tabler:list" name="All Projects" />
          <SidebarItem icon="tabler:star-filled" name="Starred" />
          <SidebarDivider />
          <SidebarSection stuff="categories" />
          <SidebarDivider />
          <StatusSection />
          <SidebarDivider />
          <SidebarSection stuff="visibilities" />
          <SidebarDivider />
          <SidebarSection stuff="technologies" />
        </ul>
      </Scrollbar>
    </aside>
  )
}

export default Sidebar
