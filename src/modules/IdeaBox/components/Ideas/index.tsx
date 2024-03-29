/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
// @ts-expect-error - no types available
import Column from 'react-columns'
import EmptyStateScreen from '../../../../components/general/EmptyStateScreen'
import ModifyIdeaModal from './components/ModifyIdeaModal'
import EntryImage from './components/IdeaEntry/EntryImage'
import EntryText from './components/IdeaEntry/EntryText'
import EntryLink from './components/IdeaEntry/EntryLink'
import ContainerHeader from './components/ContainerHeader'
import FAB from './components/FAB'
import DeleteConfirmationModal from '../../../../components/general/DeleteConfirmationModal'
import useFetch from '../../../../hooks/useFetch'
import APIComponentWithFallback from '../../../../components/general/APIComponentWithFallback'

export interface IIdeaBoxEntry {
  collectionId: string
  collectionName: string
  container: string
  content: string
  created: string
  id: string
  image: string
  title: string
  type: 'text' | 'image' | 'link'
  updated: string
  pinned: boolean
  archived: boolean
}

function Ideas(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [viewArchived, setViewArchived] = useState(
    searchParams.get('archived') === 'true'
  )

  const [data, refreshData] = useFetch<IIdeaBoxEntry[]>(
    `idea-box/idea/list/${id}?archived=${viewArchived}`
  )
  const [valid] = useFetch<boolean>(`idea-box/container/valid/${id}`)

  const [modifyIdeaModalOpenType, setModifyIdeaModalOpenType] = useState<
    null | 'create' | 'update'
  >(null)
  const [typeOfModifyIdea, setTypeOfModifyIdea] = useState<
    'text' | 'image' | 'link'
  >('text')
  const [existedData, setExistedData] = useState<IIdeaBoxEntry | null>(null)
  const [deleteIdeaModalOpen, setDeleteIdeaModalOpen] = useState(false)

  useEffect(() => {
    setSearchParams({ archived: viewArchived.toString() })
  }, [viewArchived])

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      navigate('/idea-box')
    }
  }, [valid])

  return (
    <APIComponentWithFallback data={valid}>
      <section className="relative min-h-0 w-full min-w-0 flex-1 overflow-y-auto">
        <ContainerHeader
          id={id!}
          viewArchived={viewArchived}
          setViewArchived={setViewArchived}
        />
        <APIComponentWithFallback data={data}>
          {typeof data !== 'string' &&
            (data.length > 0 ? (
              <Column
                queries={[
                  {
                    columns: 1,
                    query: 'min-width: 0px'
                  },
                  {
                    columns: 2,
                    query: 'min-width: 768px'
                  },
                  {
                    columns: 3,
                    query: 'min-width: 1024px'
                  },
                  {
                    columns: 4,
                    query: 'min-width: 1280px'
                  },
                  {
                    columns: 5,
                    query: 'min-width: 1536px'
                  }
                ]}
                gap="0.5rem"
                className="mt-6 min-h-full flex-1 px-8 sm:px-12"
              >
                {data.map(entry => {
                  const Component = {
                    image: EntryImage,
                    text: EntryText,
                    link: EntryLink
                  }[entry.type]

                  return (
                    <Component
                      key={entry.id}
                      entry={entry}
                      setTypeOfModifyIdea={setTypeOfModifyIdea}
                      setModifyIdeaModalOpenType={setModifyIdeaModalOpenType}
                      setExistedData={setExistedData}
                      setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
                      updateIdeaList={refreshData}
                    />
                  )
                })}
              </Column>
            ) : (
              <EmptyStateScreen
                setModifyModalOpenType={setModifyIdeaModalOpenType}
                title="No ideas yet"
                description="Hmm... Seems a bit empty here. Consider adding some innovative ideas."
                icon="tabler:bulb-off"
                ctaContent="new idea"
              />
            ))}
        </APIComponentWithFallback>
        <FAB
          setModifyIdeaModalOpenType={setModifyIdeaModalOpenType}
          setTypeOfModifyIdea={setTypeOfModifyIdea}
        />
      </section>
      <ModifyIdeaModal
        openType={modifyIdeaModalOpenType}
        typeOfModifyIdea={typeOfModifyIdea}
        setOpenType={setModifyIdeaModalOpenType}
        containerId={id as string}
        updateIdeaList={refreshData}
        existedData={existedData}
      />
      <DeleteConfirmationModal
        isOpen={deleteIdeaModalOpen}
        closeModal={() => {
          setDeleteIdeaModalOpen(false)
        }}
        apiEndpoint="idea-box/idea/delete"
        itemName="idea"
        data={existedData}
        updateDataList={refreshData}
      />
    </APIComponentWithFallback>
  )
}

export default Ideas
