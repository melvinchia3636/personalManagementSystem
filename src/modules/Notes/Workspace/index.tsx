/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import React, { useState } from 'react'
import ModuleHeader from '../../../components/general/ModuleHeader'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useNavigate, useParams } from 'react-router'
import { type INotesWorkspace } from '..'
import Error from '../../../components/general/Error'
import Loading from '../../../components/general/Loading'
import EmptyStateScreen from '../../../components/general/EmptyStateScreen'
import ModifySubjectModal from './components/ModifySubjectModal'
import GoBackButton from '../../../components/general/GoBackButton'
import SubjectItem, { type INotesSubject } from './components/SubjectItem'
import CreateSubjectButton from './components/CreateSubjectButton'
import DeleteConfirmationModal from '../../../components/general/DeleteConfirmationModal'
import useFetch from '../../../hooks/useFetch'

function NotesCategory(): React.ReactElement {
  const { workspace } = useParams<{ workspace: string }>()
  const [titleData] = useFetch<INotesWorkspace>(
    `notes/workspace/get/${workspace}`
  )
  const [subjectsData, refreshSubjectData] = useFetch<INotesSubject[]>(
    `notes/subject/list/${workspace}`
  )
  const [modifySubjectModalOpenType, setModifySubjectModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteSubjectConfirmationModalOpen,
    setDeleteSubjectConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<INotesSubject | null>(null)
  const navigate = useNavigate()

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll px-8 md:px-12">
      <GoBackButton
        onClick={() => {
          navigate('/notes')
        }}
      />
      <ModuleHeader
        title={
          <>
            Notes -{' '}
            {titleData === 'loading' ? (
              <Icon icon="svg-spinners:180-ring" className="h-8 w-8" />
            ) : titleData === 'error' ? (
              <span className="flex items-center gap-2 text-red-500">
                <Icon
                  icon="tabler:alert-triangle"
                  className="mt-1 h-8 w-8 stroke-red-500 stroke-[2px]"
                />
                Failed to fetch data
              </span>
            ) : (
              titleData.name
            )}
          </>
        }
        desc="A place to store all your involuntarily generated thoughts."
      />
      <>
        {(() => {
          switch (subjectsData) {
            case 'loading':
              return <Loading />
            case 'error':
              return <Error message="Failed to fetch data from server." />
            default:
              return subjectsData.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] items-center justify-center gap-4 py-8">
                  {subjectsData.map(subject => (
                    <SubjectItem
                      key={subject.id}
                      subject={subject}
                      setModifySubjectModalOpenType={
                        setModifySubjectModalOpenType
                      }
                      setDeleteSubjectConfirmationModalOpen={
                        setDeleteSubjectConfirmationModalOpen
                      }
                      setExistedData={setExistedData}
                    />
                  ))}
                  <CreateSubjectButton
                    setModifySubjectModalOpenType={
                      setModifySubjectModalOpenType
                    }
                    setExistedData={setExistedData}
                  />
                </div>
              ) : (
                <EmptyStateScreen
                  title="A bit empty here. "
                  description="Create a new subject to start storing your notes."
                  icon="tabler:folder-off"
                  ctaContent="Create subject"
                  setModifyModalOpenType={setModifySubjectModalOpenType}
                />
              )
          }
        })()}
      </>
      <DeleteConfirmationModal
        isOpen={deleteSubjectConfirmationModalOpen}
        closeModal={() => {
          setDeleteSubjectConfirmationModalOpen(false)
        }}
        apiEndpoint="notes/subject/delete"
        itemName="subject"
        data={existedData}
        updateDataList={refreshSubjectData}
        nameKey="title"
      />
      <ModifySubjectModal
        openType={modifySubjectModalOpenType}
        setOpenType={setModifySubjectModalOpenType}
        existedData={existedData}
        updateSubjectList={refreshSubjectData}
      />
    </section>
  )
}

export default NotesCategory
