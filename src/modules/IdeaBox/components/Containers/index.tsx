/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react'
import React from 'react'
import { type IIdeaBoxContainer } from '@typedec/IdeaBox'
import ContainerItem from './components/ContainerItem'

function Container({
  filteredList,
  setCreateContainerModalOpen,
  setExistedData,
  setDeleteContainerConfirmationModalOpen
}: {
  filteredList: IIdeaBoxContainer[]
  setCreateContainerModalOpen: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<IIdeaBoxContainer | null>>
  setDeleteContainerConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  return (
    <div className="mt-6 grid w-full grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-6 px-3 pb-12">
      {filteredList.map(container => (
        <ContainerItem
          key={container.id}
          container={container}
          setCreateContainerModalOpen={setCreateContainerModalOpen}
          setExistedData={setExistedData}
          setDeleteContainerConfirmationModalOpen={
            setDeleteContainerConfirmationModalOpen
          }
        />
      ))}
      <button
        onClick={() => {
          setCreateContainerModalOpen('create')
        }}
        className="relative flex h-full flex-col flex-center gap-6 rounded-lg border-2 border-dashed border-bg-400 p-8 hover:bg-bg-200 dark:border-bg-700 dark:hover:bg-bg-800/20"
      >
        <Icon
          icon="tabler:cube-plus"
          className="h-8 w-8 text-bg-500 dark:text-bg-100"
        />
        <div className="text-xl font-semibold text-bg-500 dark:text-bg-100">
          Create container
        </div>
      </button>
    </div>
  )
}

export default Container
