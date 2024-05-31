import { cookieParse } from 'pocketbase'
import React, {
  createContext,
  useState,
  type ReactNode,
  useEffect,
  useContext
} from 'react'
import { toast } from 'react-toastify'
import useFetch from '@hooks/useFetch'
import { type IMusicEntry } from '@typedec/Music'
import { useAuthContext } from './AuthProvider'

interface IMusicContext {
  // Audio related
  audio: HTMLAudioElement
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  currentMusic: IMusicEntry | null
  setCurrentMusic: React.Dispatch<React.SetStateAction<IMusicEntry | null>>
  currentDuration: number
  setCurrentDuration: React.Dispatch<React.SetStateAction<number>>
  volume: number
  setVolume: React.Dispatch<React.SetStateAction<number>>
  togglePlay: (music: IMusicEntry) => Promise<void>
  playMusic: (music: IMusicEntry) => Promise<void>
  stopMusic: () => void
  lastMusic: () => void
  nextMusic: () => void

  // Music list related
  musics: IMusicEntry[] | 'loading' | 'error'
  refreshMusics: () => void
  setMusics: React.Dispatch<
    React.SetStateAction<IMusicEntry[] | 'loading' | 'error'>
  >
  toggleFavourite: (music: IMusicEntry) => Promise<void>

  // Search related
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>

  // Loading state
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>

  // Modal states
  isYoutubeDownloaderOpen: boolean
  setIsYoutubeDownloaderOpen: React.Dispatch<React.SetStateAction<boolean>>
  isDeleteMusicConfirmationModalOpen: boolean
  setIsDeleteMusicConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  isModifyMusicModalOpen: boolean
  setIsModifyMusicModalOpen: React.Dispatch<React.SetStateAction<boolean>>

  // Music data
  existedData: IMusicEntry | null
  setExistedData: React.Dispatch<React.SetStateAction<IMusicEntry | null>>

  // Playback options
  isShuffle: boolean
  setIsShuffle: React.Dispatch<React.SetStateAction<boolean>>
  isRepeat: boolean
  setIsRepeat: React.Dispatch<React.SetStateAction<boolean>>
}

const MusicContext = createContext<IMusicContext | undefined>(undefined)

export function MusicProvider({
  children
}: {
  children: ReactNode
}): React.ReactElement {
  const { auth } = useAuthContext()
  const [audio] = useState(new Audio())
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [musics, refreshMusics, setMusics] = useFetch<IMusicEntry[]>(
    'music/entry/list',
    auth
  )
  const [isYoutubeDownloaderOpen, setIsYoutubeDownloaderOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMusic, setCurrentMusic] = useState<IMusicEntry | null>(null)
  const [currentDuration, setCurrentDuration] = useState(0)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [volume, setVolume] = useState(80)
  const [existedData, setExistedData] = useState<IMusicEntry | null>(null)
  const [
    isDeleteMusicConfirmationModalOpen,
    setIsDeleteMusicConfirmationModalOpen
  ] = useState(false)
  const [isModifyMusicModalOpen, setIsModifyMusicModalOpen] = useState(false)

  const playMusic = async (music: IMusicEntry): Promise<void> => {
    setCurrentMusic(music)
    audio.src = `${import.meta.env.VITE_API_HOST}/media/${music.collectionId}/${
      music.id
    }/${music.file}`
    setCurrentDuration(0)
    setIsPlaying(true)
    await audio.play()
  }

  async function toggleFavourite(targetMusic: IMusicEntry): Promise<void> {
    const toggleFavouriteInMusics = (
      prevMusics: IMusicEntry[] | 'loading' | 'error'
    ): IMusicEntry[] | 'loading' | 'error' => {
      if (typeof prevMusics !== 'string') {
        return prevMusics.map(music =>
          music.id === targetMusic.id
            ? { ...music, is_favourite: !music.is_favourite }
            : music
        )
      }
      return prevMusics
    }

    setMusics(toggleFavouriteInMusics(musics))

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/music/entry/favourite/${
          targetMusic.id
        }`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          }
        }
      )

      if (response.status !== 200) {
        throw new Error('Failed to add music to favourites!')
      }

      if (targetMusic.is_favourite) {
        toast.info('Music removed from favourites!')
      } else {
        toast.success('Music added to favourites!')
      }

      setCurrentMusic(prevMusic =>
        prevMusic !== null && prevMusic.id === targetMusic.id
          ? { ...prevMusic, is_favourite: !prevMusic.is_favourite }
          : prevMusic
      )
    } catch (err) {
      setMusics(toggleFavouriteInMusics(musics))
      toast.error(`Oops! Couldn't add music to favourites! ${err as string}`)
    }
  }

  async function togglePlay(music: IMusicEntry): Promise<void> {
    if (currentMusic?.id === music.id) {
      if (isPlaying) {
        audio.pause()
      } else {
        await audio.play()
      }
      setIsPlaying(!isPlaying)
    } else {
      await playMusic(music)
    }
  }

  const stopMusic = (): void => {
    audio.pause()
    setCurrentDuration(0)
    setCurrentMusic(null)
    setIsPlaying(false)
  }

  const lastMusic = (): void => {
    if (typeof musics !== 'string') {
      const currentIndex = musics.findIndex(
        music => music.id === currentMusic?.id
      )
      if (currentIndex - 1 >= 0) {
        playMusic(musics[currentIndex - 1]).catch(err => {
          toast.error(`Failed to play music. Error: ${err}`)
        })
      }
    }
  }

  const nextMusic = (): void => {
    if (typeof musics !== 'string') {
      const currentIndex = musics.findIndex(
        music => music.id === currentMusic?.id
      )
      if (currentIndex + 1 < musics.length) {
        playMusic(musics[currentIndex + 1]).catch(err => {
          toast.error(`Failed to play music. Error: ${err}`)
        })
      } else {
        stopMusic()
      }
    }
  }

  const shuffleMusic = (): void => {
    if (typeof musics !== 'string') {
      const randomIndex = Math.floor(Math.random() * musics.length)
      playMusic(musics[randomIndex]).catch(err => {
        toast.error(`Failed to play music. Error: ${err}`)
      })
    }
  }

  useEffect(() => {
    const onEnd = (): void => {
      if (isShuffle) {
        shuffleMusic()
      } else if (isRepeat) {
        if (currentMusic !== null) {
          playMusic(currentMusic).catch(err => {
            toast.error(`Failed to play music. Error: ${err}`)
          })
        }
      } else {
        nextMusic()
      }
    }

    const updateDuration = (): void => {
      setCurrentDuration(audio.currentTime)
    }

    audio.addEventListener('ended', onEnd)

    const interval = setInterval(updateDuration, 1000)

    return () => {
      audio.removeEventListener('ended', onEnd)
      clearInterval(interval)
    }
  }, [audio, musics, currentMusic, isShuffle, isRepeat])

  return (
    <MusicContext
      value={{
        // Audio related
        audio,
        isPlaying,
        setIsPlaying,
        currentMusic,
        setCurrentMusic,
        currentDuration,
        setCurrentDuration,
        volume,
        setVolume,
        togglePlay,
        playMusic,
        stopMusic,
        lastMusic,
        nextMusic,

        // Music list related
        musics,
        refreshMusics,
        setMusics,
        toggleFavourite,

        // Search related
        searchQuery,
        setSearchQuery,

        // Loading state
        loading,
        setLoading,

        // Modal states
        isYoutubeDownloaderOpen,
        setIsYoutubeDownloaderOpen,
        isDeleteMusicConfirmationModalOpen,
        setIsDeleteMusicConfirmationModalOpen,
        isModifyMusicModalOpen,
        setIsModifyMusicModalOpen,

        // Music data
        existedData,
        setExistedData,

        // Playback options
        isShuffle,
        setIsShuffle,
        isRepeat,
        setIsRepeat
      }}
    >
      {children}
    </MusicContext>
  )
}

export function useMusicContext(): IMusicContext {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider')
  }
  return context
}
