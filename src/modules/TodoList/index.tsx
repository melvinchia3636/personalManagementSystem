/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/naming-convention */
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Sidebar, {
  type ITodoListTag,
  type ITodoListList
} from './components/Sidebar'
import ModuleHeader from '../../components/general/ModuleHeader'
import useFetch from '../../hooks/useFetch'
import APIComponentWithFallback from '../../components/general/APIComponentWithFallback'
import TaskItem from './components/TaskItem'
import ModifyTaskWindow from './components/ModifyTaskWindow'
import ModuleWrapper from '../../components/general/ModuleWrapper'
import SearchInput from '../../components/general/SearchInput'

export interface ITodoListEntry {
  collectionId: string
  collectionName: string
  created: string
  due_date: string
  id: string
  list: string
  notes: string
  priority: string
  summary: string
  tags: string[]
  updated: string
  done: boolean
}

function TodoList(): React.JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lists, refreshLists] = useFetch<ITodoListList[]>('todo-list/list/list')
  const [tagsList, refreshTagsList] =
    useFetch<ITodoListTag[]>('todo-list/tag/list')
  const [entries, refreshEntries, setEntries] = useFetch<ITodoListEntry[]>(
    'todo-list/entry/list'
  )
  const [modifyTaskWindowOpenType, setModifyTaskWindowOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<ITodoListEntry | null>(null)

  return (
    <>
      <ModuleWrapper>
        <ModuleHeader
          title="Todo List"
          desc="Human brain is not designed to remember everything."
        />
        <div className="mb-12 mt-6 flex min-h-0 w-full flex-1">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            lists={lists}
            refreshLists={refreshLists}
            tags={tagsList}
            refreshTagsList={refreshTagsList}
          />
          <div className="h-full flex-1 lg:ml-12">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold text-bg-800 dark:text-bg-100 md:text-4xl">
                All Tasks <span className="text-base text-bg-500">(10)</span>
              </h1>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    setSelectedTask(null)
                    setModifyTaskWindowOpenType('create')
                  }}
                  className="hidden items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-custom-600 dark:text-bg-800 sm:flex"
                >
                  <Icon icon="tabler:plus" className="text-xl" />
                  new task
                </button>
                <button
                  onClick={() => {
                    setSidebarOpen(true)
                  }}
                  className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-100 lg:hidden"
                >
                  <Icon icon="tabler:menu" className="text-2xl" />
                </button>
              </div>
            </div>
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="tasks"
            />
            <ul className="mt-6 flex flex-col gap-4 pb-24">
              <APIComponentWithFallback data={entries}>
                {typeof entries !== 'string' &&
                  entries.map(entry => (
                    <TaskItem
                      entry={entry}
                      entries={entries}
                      setEntries={setEntries}
                      refreshEntries={refreshEntries}
                      lists={lists}
                      tagsList={tagsList}
                      setIsModifyTaskWindowOpen={setModifyTaskWindowOpenType}
                      setSelectedTask={setSelectedTask}
                      key={entry.id}
                    />
                  ))}
              </APIComponentWithFallback>
            </ul>
          </div>
        </div>
      </ModuleWrapper>
      <ModifyTaskWindow
        openType={modifyTaskWindowOpenType}
        setOpenType={setModifyTaskWindowOpenType}
        lists={lists as unknown as ITodoListList[]}
        tagsList={tagsList as unknown as ITodoListTag[]}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        refreshEntries={refreshEntries}
        refreshTagsList={refreshTagsList}
        refreshLists={refreshLists}
      />
      <button
        onClick={() => {
          setSelectedTask(null)
          setModifyTaskWindowOpenType('create')
        }}
        className="absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-lg bg-custom-500 p-4 font-semibold uppercase tracking-wider text-bg-100 shadow-lg hover:bg-custom-600 dark:text-bg-800 sm:hidden"
      >
        <Icon icon="tabler:plus" className="h-6 w-6 shrink-0 transition-all" />
      </button>
    </>
  )
}

export default TodoList
