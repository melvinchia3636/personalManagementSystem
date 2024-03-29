import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GoBackButton from '../../../components/general/GoBackButton'
import useFetch from '../../../hooks/useFetch'
import { type IFlashcardDeck } from '..'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'
import HamburgerMenu from '../../../components/general/HamburgerMenu'
import MenuItem from '../../../components/general/HamburgerMenu/MenuItem'
import EditCardModal from './EditCardModal'

// Generated by https://quicktype.io

export interface IFlashcardCard {
  id?: string
  answer: string
  question: string
}

function CardSet(): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [containerDetails, refreshContainerDetails] = useFetch<IFlashcardDeck>(
    `flashcards/deck/get/${id}`
  )
  const [cards, refreshCards] = useFetch<IFlashcardCard[]>(
    `flashcards/card/list/${id}`
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [editCardModalOpen, setEditCardModalOpen] = useState(false)
  const [isShowingAnswer, setIsShowingAnswer] = useState(false)
  const [notSelected, setNotSelected] = useState<number[]>([])

  const [valid] = useFetch<boolean>(`flashcards/deck/valid/${id}`)

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      navigate('/flashcards')
    }
  }, [valid])

  const gotoNextCard = (): void => {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const gotoLastCard = (): void => {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const pickRandomCard = (): void => {
    let innerNotSelected = [...notSelected]
    if (notSelected.length === 0) {
      const newArr = Array(cards?.length)
        .fill(0)
        .map((_, i) => i)
      innerNotSelected = newArr
      setNotSelected(newArr)
    }
    const randomIndex = Math.floor(Math.random() * innerNotSelected.length)
    setCurrentIndex(innerNotSelected[randomIndex])
    setNotSelected(innerNotSelected.filter((_, i) => i !== randomIndex))
  }

  useEffect(() => {
    setCurrentIndex(0)
    setNotSelected(
      Array(cards?.length)
        .fill(0)
        .map((_, i) => i)
    )
  }, [cards])

  useEffect(() => {
    setIsShowingAnswer(false)
  }, [currentIndex])

  return (
    <section className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto px-12">
      <div className="flex flex-col gap-1">
        <GoBackButton
          onClick={() => {
            navigate('/flashcards')
          }}
        />
        <div className="flex items-center justify-between">
          <h1
            className={`flex items-center gap-4 ${
              typeof containerDetails !== 'string'
                ? 'text-2xl sm:text-3xl'
                : 'text-2xl'
            } font-semibold `}
          >
            {(() => {
              switch (containerDetails) {
                case 'loading':
                  return (
                    <>
                      <span className="small-loader-light"></span>
                      Loading...
                    </>
                  )
                case 'error':
                  return (
                    <>
                      <Icon
                        icon="tabler:alert-triangle"
                        className="mt-0.5 h-7 w-7 text-red-500"
                      />
                      Failed to fetch data from server.
                    </>
                  )
                default:
                  return (
                    <>
                      {containerDetails.name}
                      <span className="ml-4 rounded-full bg-custom-500/20 px-4 py-1.5 text-sm font-semibold text-custom-500">
                        {containerDetails.card_amount} cards
                      </span>
                    </>
                  )
              }
            })()}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <button className="rounded-md p-4 text-bg-500 transition-all hover:bg-bg-800 hover:text-bg-100">
              <Icon icon="tabler:border-corners" className="text-xl" />
            </button>
            <HamburgerMenu largerPadding position="relative">
              <MenuItem
                icon="tabler:edit"
                text="Edit Cards"
                onClick={() => {
                  setEditCardModalOpen(true)
                }}
              />
            </HamburgerMenu>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <APIComponentWithFallback data={cards}>
          {typeof cards !== 'string' && (
            <>
              <div className="flex h-1/2 w-3/5 items-center justify-center gap-4">
                <button
                  onClick={gotoLastCard}
                  className="flex h-full shrink-0 items-center justify-center p-4"
                >
                  <Icon icon="tabler:chevron-left" className="text-3xl" />
                </button>
                <div className="stack h-full w-full">
                  <div className="card h-full bg-custom-500 text-bg-800 shadow-md">
                    <div className="card-body flex h-full flex-col">
                      <div className="card-title flex items-center justify-between">
                        <h2 className="text-custom-800">#{currentIndex + 1}</h2>
                        <button
                          onClick={() => {
                            setIsShowingAnswer(!isShowingAnswer)
                          }}
                          className="rounded-md bg-custom-500/20 p-2 text-custom-800"
                        >
                          <Icon
                            icon={`tabler:bulb${isShowingAnswer ? '-off' : ''}`}
                            className="h-7 w-7"
                          />
                        </button>
                      </div>
                      <div className="flex w-full flex-1 flex-col items-center justify-center text-center text-3xl">
                        {isShowingAnswer
                          ? cards[currentIndex]?.answer
                          : cards[currentIndex]?.question}
                      </div>
                    </div>
                  </div>
                  <div className="card h-full bg-custom-700 text-bg-800 !opacity-100 shadow"></div>
                  <div className="card h-full bg-custom-900 text-bg-800 !opacity-100 shadow-sm"></div>
                </div>
                <button
                  onClick={gotoNextCard}
                  className="flex h-full shrink-0 items-center justify-center p-4"
                >
                  <Icon icon="tabler:chevron-right" className="text-3xl" />
                </button>
              </div>
              <button
                onClick={pickRandomCard}
                className="mt-12 flex w-1/2 items-center justify-center gap-2 rounded-lg bg-bg-200 p-4 text-lg font-medium shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-800"
              >
                <Icon icon="tabler:dice" className="text-2xl" />
                Pick Random Card
              </button>
              <EditCardModal
                deck={id}
                isOpen={editCardModalOpen}
                cards={cards}
                onClose={() => {
                  setEditCardModalOpen(false)
                }}
                refreshCards={refreshCards}
                refreshContainerDetails={refreshContainerDetails}
              />
            </>
          )}
        </APIComponentWithFallback>
      </div>
    </section>
  )
}

export default CardSet
