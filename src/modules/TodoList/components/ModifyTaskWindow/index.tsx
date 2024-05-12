/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useContext, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-date-picker'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/CreateOrModifyButton'
import HamburgerMenu from '@components/HamburgerMenu'
import MenuItem from '@components/HamburgerMenu/MenuItem'
import Input from '@components/Input'
import { PersonalizationContext } from '@providers/PersonalizationProvider'
import { TodoListContext } from '@providers/TodoListProvider'
import DueDateInput from './components/DueDateInput'
import ListSelector from './components/ListSelector'
import NotesInput from './components/NotesInput'
import PrioritySelector from './components/PrioritySelector'
import TagsSelector from './components/TagsSelector'

function ModifyTaskWindow(): React.ReactElement {
  const {
    modifyTaskWindowOpenType: openType,
    setModifyTaskWindowOpenType: setOpenType,
    selectedTask,
    setSelectedTask,
    refreshEntries,
    refreshTagsList,
    refreshLists,
    refreshStatusCounter,
    setDeleteTaskConfirmationModalOpen
  } = useContext(TodoListContext)

  const [summary, setSummary] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('low')
  const [list, setList] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [innerOpenType, setInnerOpenType] = useState<
    'create' | 'update' | null
  >(openType)
  const [loading, setLoading] = useState(false)
  const summaryInputRef = useRef<HTMLInputElement>(null)

  function onSubmitButtonClick(): void {
    if (openType === null) return

    if (summary.trim().length === 0) {
      toast.error('Task summary cannot be empty.')
      return
    }

    setLoading(true)

    const task = {
      summary: summary.trim(),
      notes: notes.trim(),
      due_date: moment(dueDate).format('yyyy-MM-DD 23:59:59Z'),
      priority,
      list,
      tags
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/todo-list/entry/${openType}${
        openType === 'update' ? `/${selectedTask?.id}` : ''
      }`,
      {
        method: openType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify(task)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Task created. Time to start working on it.',
            update: 'Yay! Task updated.'
          }[openType]
        )
        setOpenType(null)
        refreshEntries()
        refreshTagsList()
        refreshLists()
        refreshStatusCounter()
      })
      .catch(err => {
        toast.error(`Oops! Couldn't ${openType} the task. Please try again.`)
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function updateSummary(event: React.ChangeEvent<HTMLInputElement>): void {
    setSummary(event.target.value)
  }

  function updateNotes(event: React.FormEvent<HTMLTextAreaElement>): void {
    setNotes(event.currentTarget.value)
  }

  function closeWindow(): void {
    setInnerOpenType(null)
    setTimeout(() => {
      setOpenType(null)
      setSelectedTask(null)
    }, 300)
  }

  useEffect(() => {
    setTimeout(() => {
      setInnerOpenType(openType)
    }, 5)
  }, [openType])

  useEffect(() => {
    if (selectedTask !== null) {
      setSummary(selectedTask.summary)
      setNotes(selectedTask.notes)
      setDueDate(selectedTask.due_date)
      setPriority(selectedTask.priority)
      setList(selectedTask.list)
      setTags(selectedTask.tags)
    } else {
      setSummary('')
      setNotes('')
      setDueDate('')
      setPriority('low')
      setList(null)
      setTags([])
    }
  }, [selectedTask, openType])

  return (
    <div
      className={`fixed left-0 top-0 h-[100dvh] w-full bg-bg-900/20 backdrop-blur-sm transition-all ${
        innerOpenType !== null
          ? 'z-[9999] opacity-100'
          : ' z-[-9999]  opacity-0 [transition:z-index_0.1s_linear_0.5s,opacity_0.1s_linear_0.1s]'
      }`}
    >
      <button
        onClick={closeWindow}
        className="absolute left-0 top-0 h-full w-full"
      />
      <div
        className={`absolute right-0 flex flex-col overflow-y-scroll transition-all duration-300 ${
          innerOpenType !== null ? 'translate-x-0' : 'translate-x-full'
        } top-0 h-full w-full bg-bg-100 p-8 dark:bg-bg-900 sm:w-4/5 md:w-3/5 lg:w-2/5`}
      >
        <div className="mb-8 flex items-center justify-between ">
          <h1 className="flex items-center gap-3 text-2xl font-semibold">
            <Icon
              icon={
                {
                  create: 'tabler:plus',
                  update: 'tabler:pencil'
                }[innerOpenType ?? 'create']
              }
              className="h-7 w-7"
            />
            {
              {
                create: 'Create ',
                update: 'Modify '
              }[innerOpenType ?? 'create']
            }{' '}
            task
          </h1>
          <HamburgerMenu largerPadding position="relative">
            <MenuItem
              isRed
              icon="tabler:trash"
              onClick={() => {
                setDeleteTaskConfirmationModalOpen(true)
                setOpenType(null)
              }}
              text="Delete"
            />
          </HamburgerMenu>
        </div>
        <Input
          name="Summary"
          value={summary}
          placeholder="An urgent task"
          icon="tabler:abc"
          darker
          updateValue={updateSummary}
          additionalClassName="w-full"
          reference={summaryInputRef}
          autoFocus
        />
        <NotesInput notes={notes} updateNotes={updateNotes} />
        <DueDateInput dueDate={dueDate} setDueDate={setDueDate} />

        <PrioritySelector priority={priority} setPriority={setPriority} />
        <ListSelector list={list} setList={setList} />
        <TagsSelector tags={tags} setTags={setTags} />
        <div className="mt-12 flex flex-1 flex-col-reverse items-end gap-2 sm:flex-row">
          <button
            disabled={loading}
            onClick={closeWindow}
            className="flex-center flex h-16 w-full gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-bg-200 dark:hover:bg-bg-700/50"
          >
            cancel
          </button>
          <CreateOrModifyButton
            loading={loading}
            onClick={onSubmitButtonClick}
            type={innerOpenType}
          />
        </div>
      </div>
    </div>
  )
}

export default ModifyTaskWindow
