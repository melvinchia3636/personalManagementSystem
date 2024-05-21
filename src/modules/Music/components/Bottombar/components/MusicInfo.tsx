import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useMusicContext } from '@providers/MusicProvider'

export default function MusicInfo(): React.ReactElement {
  const { currentMusic, isPlaying } = useMusicContext()

  if (currentMusic === null) {
    return <></>
  }

  return (
    <div className="flex w-1/3 min-w-0 items-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-custom-500/20">
        <Icon
          icon="tabler:disc"
          className={`${
            isPlaying ? 'animate-spin' : ''
          } text-3xl text-custom-500`}
        />
      </div>
      <div className="ml-4 min-w-0">
        <p className="min-w-0 truncate font-semibold">{currentMusic.name}</p>
        <p className="text-sm text-bg-500">{currentMusic.author}</p>
      </div>
    </div>
  )
}