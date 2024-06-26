import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function Header({
  data,
  selectedNOTAMData
}: {
  data: any
  selectedNOTAMData: any
}): React.ReactElement {
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="tabler:file-text" className="size-7" />
        {data.header?.id ?? selectedNOTAMData.title[1]}
      </h1>
      <span
        className={`rounded-full px-3 py-1 text-sm font-semibold ${
          {
            active: 'text-green-500 bg-green-500/20',
            expired: 'text-bg-500 bg-bg-500/20',
            scheduled: 'text-yellow-500 bg-yellow-500/20'
          }[
            selectedNOTAMData.status.toLowerCase() as
              | 'active'
              | 'expired'
              | 'scheduled'
          ] ?? 'bg-bg-500/20 text-bg-500'
        }`}
      >
        {selectedNOTAMData.status}
      </span>
    </div>
  )
}

export default Header
