import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import APIRequest from '@utils/fetchData'

function RawCodeAndSummary({
  id,
  raw,
  isOpen
}: {
  id: string
  raw: string
  isOpen: boolean
}): React.ReactElement {
  const [summary, setSummary] = useState<string | null>(null)
  const [summarizeButtonLoading, setSummarizeButtonLoading] = useState(false)

  async function summarizeWithAI(): Promise<void> {
    setSummarizeButtonLoading(true)
    await APIRequest({
      endpoint: `airports/NOTAM/${id}/summarize`,
      method: 'GET',
      callback(data) {
        setSummary(data.data)
        toast.success('NOTAM summarized successfully')
      },
      onFailure() {
        toast.error('Failed to summarize NOTAM')
      },
      finalCallback() {
        setSummarizeButtonLoading(false)
      }
    })
  }

  useEffect(() => {
    if (isOpen) {
      setSummary(null)
    }
  }, [isOpen])

  return (
    <div className="mt-6 w-full min-w-0 rounded-md bg-bg-800 p-4 text-bg-500">
      <code className="w-full min-w-0 whitespace-pre-wrap">{raw}</code>
      {summary === null ? (
        <Button
          className="mt-4 w-full"
          onClick={() => {
            summarizeWithAI().catch(console.error)
          }}
          loading={summarizeButtonLoading}
          icon="mage:stars-c"
        >
          Summarize with AI
        </Button>
      ) : (
        <div className="mt-4 rounded-md bg-bg-700/50 p-4 text-bg-100">
          <Markdown className="prose">{summary}</Markdown>
          <div className="mt-4 rounded-md border-l-4 border-yellow-500 bg-yellow-500/20 p-4 text-yellow-500">
            <h2 className="flex items-center gap-2 text-xl font-medium">
              <Icon icon="tabler:alert-triangle" className="size-5" />
              Warning
            </h2>
            <p className="mt-2">
              The summarized content may not be accurate. Please verify the
              information before using it.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RawCodeAndSummary
