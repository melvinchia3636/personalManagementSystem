/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EmptyStateScreen from '../../../components/general/EmptyStateScreen'
import ModifyFolderModal from './components/ModifyFolderModal'
import DirectoryHeader from './components/Directory/components/DirectoryHeader'
import Directory from './components/Directory'
import DeleteConfirmationModal from '../../../components/general/DeleteConfirmationModal'
import useFetch from '../../../hooks/useFetch'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'

// Generated by https://quicktype.io

export interface INotesEntry {
  collectionId: string
  collectionName: string
  created: string
  id: string
  name: string
  path: string
  subject: string
  type: 'file' | 'folder'
  updated: string
  file: string
}

export interface INotesPath {
  id: string
  name: string
}

function NotesSubject(): React.ReactElement {
  const {
    subject,
    '*': path,
    workspace
  } = useParams<{ subject: string; '*': string; workspace: string }>()
  const navigate = useNavigate()

  const [valid] = useFetch<boolean>(
    `notes/entry/valid/${workspace}/${subject}/${path}`
  )
  const [notesEntries, refreshNotesEntries] = useFetch<INotesEntry[]>(
    `notes/entry/list/${subject}/${path}`
  )
  const [modifyFolderModalOpenType, setModifyFolderModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteFolderConfirmationModalOpen,
    setDeleteFolderConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<INotesEntry | null>(null)

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      navigate('/notes')
    }
  }, [valid])

  return (
    <APIComponentWithFallback data={valid}>
      <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll px-8 md:px-12">
        <DirectoryHeader
          updateNotesEntries={refreshNotesEntries}
          setModifyFolderModalOpenType={setModifyFolderModalOpenType}
          setExistedData={setExistedData}
        />
        <APIComponentWithFallback data={notesEntries}>
          {typeof notesEntries !== 'string' &&
            (notesEntries.length > 0 ? (
              <Directory
                notesEntries={notesEntries}
                setDeleteFolderConfirmationModalOpen={
                  setDeleteFolderConfirmationModalOpen
                }
                setModifyFolderModalOpenType={setModifyFolderModalOpenType}
                setExistedData={setExistedData}
              />
            ) : (
              <EmptyStateScreen
                ctaContent="New Note"
                icon="tabler:file-off"
                title="Hmm... it seems a bit empty here."
                description="Time to upload some notes!"
                setModifyModalOpenType={() => {}}
              />
            ))}
        </APIComponentWithFallback>
        <ModifyFolderModal
          openType={modifyFolderModalOpenType}
          setOpenType={setModifyFolderModalOpenType}
          existedData={existedData}
          updateNotesEntries={refreshNotesEntries}
        />
        <DeleteConfirmationModal
          isOpen={deleteFolderConfirmationModalOpen}
          closeModal={() => {
            setExistedData(null)
            setDeleteFolderConfirmationModalOpen(false)
          }}
          apiEndpoint="notes/entry/delete"
          itemName="folder"
          data={existedData}
          updateDataList={refreshNotesEntries}
        />
      </section>
    </APIComponentWithFallback>
  )
}

export default NotesSubject
