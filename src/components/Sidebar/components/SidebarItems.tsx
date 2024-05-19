/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useEffect, useState } from 'react'
import useFetch from '@hooks/useFetch'
import { useAuthContext } from '@providers/AuthProvider'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { type INotesWorkspace } from '@typedec/Notes'
import SidebarDivider from './SidebarDivider'
import SidebarItem from './SidebarItem'
import SidebarTitle from './SidebarTitle'
import { ROUTES } from '../../../Router'
import { titleToPath } from '../../../utils/strings'

function SidebarItems(): React.ReactElement {
  const { userData } = useAuthContext()
  const { sidebarExpanded } = useGlobalStateContext()
  const [sidebarItems, setSidebarItems] = useState(ROUTES)

  const [notesCategories] = useFetch<INotesWorkspace[]>('notes/workspace/list')

  useEffect(() => {
    if (notesCategories !== 'loading' && notesCategories !== 'error') {
      setSidebarItems(
        sidebarItems.map(item => {
          if (item.title === 'Study') {
            return {
              ...item,
              items: item.items.map(subItem => {
                if (subItem.name === 'Notes') {
                  return {
                    ...subItem,
                    subsection: notesCategories.map(({ name, icon, id }) => [
                      name,
                      icon,
                      id
                    ])
                  }
                } else {
                  return subItem
                }
              })
            }
          } else {
            return item
          }
        })
      )
    }
  }, [notesCategories])

  return (
    <ul className="flex flex-col gap-1 overflow-y-scroll overscroll-none pb-6">
      {sidebarItems.map((item, index) => {
        const enabledModules = item.items.filter(
          subItem =>
            !subItem.togglable ||
            userData?.enabledModules.includes(titleToPath(subItem.name))
        )
        return (
          <>
            {item.title && enabledModules.length > 0 && sidebarExpanded && (
              <SidebarTitle name={item.title} key={item.title} />
            )}
            {enabledModules.map(subItem => (
              <SidebarItem
                key={titleToPath(subItem.name)}
                name={subItem.name}
                icon={subItem.icon ?? ''}
                subsection={subItem.subsection}
                isMainSidebarItem
              />
            ))}
            {index !== sidebarItems.length - 1 && enabledModules.length > 0 && (
              <SidebarDivider />
            )}
          </>
        )
      })}
    </ul>
  )
}

export default SidebarItems
