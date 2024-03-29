import React from 'react'

export default function Loading({
  customMessage
}: {
  customMessage?: string
}): React.ReactElement {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <span className="loader"></span>
      <p className="text-lg font-medium text-bg-500">
        {customMessage ?? 'Loading data'}
      </p>
    </div>
  )
}
