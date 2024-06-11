import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'

function SearchBar({
  searchQuery,
  setSearchQuery,
  setView,
  view
}: {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  setView: React.Dispatch<React.SetStateAction<'table' | 'list'>>
  view: 'table' | 'list'
}): React.ReactElement {
  return (
    <div className="flex items-center gap-2">
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="transactions"
      />
      <div className="mt-2 flex items-center gap-2 rounded-md bg-bg-900 p-2 sm:mt-6">
        {['table', 'list'].map(viewType => (
          <button
            key={viewType}
            onClick={() => {
              setView(viewType as 'table' | 'list')
            }}
            className={`flex items-center gap-2 rounded-md p-2 transition-all ${
              viewType === view ? 'bg-bg-800' : 'text-bg-500 hover:text-bg-100'
            }`}
          >
            <Icon
              icon={
                viewType === 'table'
                  ? 'tabler:table'
                  : viewType === 'list'
                  ? 'uil:list-ul'
                  : ''
              }
              className="size-6"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
