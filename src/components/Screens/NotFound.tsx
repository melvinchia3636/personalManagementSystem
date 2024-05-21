import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ButtonsAndInputs/Button'

function NotFound(): React.ReactElement {
  const navigate = useNavigate()

  return (
    <div className="flex-center flex h-full w-full flex-col gap-6">
      <h1 className="text-[10rem] text-custom-500">;-;</h1>
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <h2 className="-mt-2 text-xl text-bg-500">
        The page you are looking for does not exist.
      </h2>
      <div className="mt-6 flex items-center gap-4">
        <Button
          icon="tabler:arrow-left"
          onClick={() => {
            navigate('/')
          }}
        >
          Return home
        </Button>
        <Button
          icon="tabler:bug"
          onClick={() => {
            const a = document.createElement('a')
            a.href =
              'https://github.com/melvinchia3636/personalManagementSystem/issues'
            a.target = '_blank'
            a.rel = 'noopener noreferrer'
            a.click()
          }}
          type="secondary"
        >
          Report a bug
        </Button>
      </div>
    </div>
  )
}

export default NotFound