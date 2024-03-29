/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import HamburgerMenu from '../../../../../../../../components/general/HamburgerMenu'
import MenuItem from '../../../../../../../../components/general/HamburgerMenu/MenuItem'
import { type INotesEntry } from '../../../../..'

function EntryMenu({
  entry,
  setModifyFolderModalOpenType,
  setExistedData,
  setDeleteFolderConfirmationModalOpen
}: {
  entry: INotesEntry
  setModifyFolderModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: (data: any) => void
  setDeleteFolderConfirmationModalOpen: (state: boolean) => void
}): React.ReactElement {
  return (
    <HamburgerMenu position="relative">
      <MenuItem
        icon="tabler:edit"
        onClick={() => {
          setModifyFolderModalOpenType('update')
          setExistedData(entry)
        }}
        text="Rename"
      />
      <MenuItem
        icon="tabler:trash"
        onClick={() => {
          setDeleteFolderConfirmationModalOpen(true)
          setExistedData(entry)
        }}
        text="Delete"
        isRed
      />
    </HamburgerMenu>
  )
}

export default EntryMenu
