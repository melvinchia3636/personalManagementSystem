import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { type IProjectsMStatus } from '@interfaces/projects_m_interfaces'
import { useProjectsMContext } from '@providers/ProjectsMProvider'

function StatusItem({ item }: { item: IProjectsMStatus }): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {
    miscellaneous: { setSidebarOpen },
    statuses: {
      setExistedData,
      setModifyDataModalOpenType,
      setDeleteDataConfirmationOpen
    }
  } = useProjectsMContext()

  return (
    <li
      className={`relative flex h-16 items-center gap-6 px-4 font-medium transition-all ${
        searchParams.get('status') === item.id
          ? "text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-100"
          : 'text-bg-500 dark:text-bg-500'
      }`}
    >
      <div
        tabIndex={0}
        role="button"
        onClick={() => {
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            status: item.id
          })
          setSidebarOpen(false)
        }}
        className="group flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 text-left hover:bg-bg-200/50 dark:hover:bg-bg-800"
      >
        <span
          className="block h-8 w-1 shrink-0 rounded-full"
          style={{
            backgroundColor: item.color
          }}
        />
        <Icon icon={item.icon} className="size-6 shrink-0" />
        <div className="w-full truncate">{item.name}</div>
        <span className={!isMenuOpen ? 'text-sm group-hover:hidden' : 'hidden'}>
          {Math.floor(Math.random() * 100)}
        </span>
        {searchParams.get('status') === item.id ? (
          <button
            onClick={e => {
              e.stopPropagation()
              setSearchParams(searchParams => {
                searchParams.delete('status')
                return searchParams
              })
              setSidebarOpen(false)
            }}
            className="hidden overscroll-contain group-hover:block"
          >
            <Icon icon="tabler:x" className="size-5" />
          </button>
        ) : (
          <HamburgerMenu
            smallerPadding
            onButtonClick={e => {
              e.stopPropagation()
              setIsMenuOpen(true)
            }}
            className={`relative overscroll-contain ${
              !isMenuOpen ? 'hidden group-hover:block' : ''
            }`}
            onClose={() => {
              setIsMenuOpen(false)
            }}
          >
            <MenuItem
              icon="tabler:edit"
              onClick={e => {
                e.stopPropagation()
                setExistedData(item)
                setModifyDataModalOpenType('update')
              }}
              text="Edit"
            />
            <MenuItem
              isRed
              icon="tabler:trash"
              onClick={e => {
                e.stopPropagation()
                setExistedData(item)
                setDeleteDataConfirmationOpen(true)
              }}
              text="Delete"
            />
          </HamburgerMenu>
        )}
      </div>
    </li>
  )
}

export default StatusItem
