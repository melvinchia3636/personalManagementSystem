/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Modal from './Modal'

function DeleteConfirmationModal({
  itemName,
  isOpen,
  onClose,
  data,
  updateDataList,
  apiEndpoint,
  customText,
  nameKey = 'name',
  customCallback
}: {
  itemName: string
  isOpen: boolean
  onClose: () => void
  data: any
  updateDataList: () => void
  apiEndpoint: string
  customText?: string
  nameKey?: string
  customCallback?: () => void
}): React.ReactElement {
  const [loading, setLoading] = useState(false)

  function deleteData(): void {
    if (data === null) return
    if (customCallback) {
      customCallback()
      return
    }

    setLoading(true)
    fetch(`${import.meta.env.VITE_API_HOST}/${apiEndpoint}/${data.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    })
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          toast.info(`Uhh, hopefully you truly didn't need that ${itemName}.`)
          onClose()
          updateDataList()
          return data
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error(`Oops! Couldn't delete the ${itemName}. Please try again.`)
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal isOpen={isOpen}>
      <h1 className="text-2xl font-semibold">
        Are you sure you want to delete {data?.[nameKey] || `the ${itemName}`}?
      </h1>
      <p className="mt-2 text-bg-500">
        {customText ?? (
          <>
            This will delete the {itemName} and everything related to it. This
            action is irreversible!
          </>
        )}
      </p>
      <div className="mt-6 flex w-full justify-around gap-2">
        <button
          onClick={onClose}
          className="flex w-full flex-center gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 transition-all hover:bg-bg-700 dark:text-bg-100"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          onClick={deleteData}
          className="flex w-full flex-center gap-2 rounded-lg bg-red-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 transition-all hover:bg-red-600"
        >
          {loading ? (
            <>
              <span className="small-loader-light"></span>
            </>
          ) : (
            <>
              <Icon icon="tabler:trash" className="h-5 w-5" />
              DELETE
            </>
          )}
        </button>
      </div>
    </Modal>
  )
}

export default DeleteConfirmationModal
