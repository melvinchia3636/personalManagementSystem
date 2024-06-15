import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

function ChangeViewButton({
  view,
  currentView,
  onView
}: {
  view: string
  currentView: string
  onView: (view: 'month' | 'week' | 'day' | 'agenda' | 'work_week') => void
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <button
      key={view}
      onClick={() => {
        onView(view.toLowerCase() as 'month' | 'week' | 'day' | 'agenda')
      }}
      className={`w-full whitespace-nowrap rounded-md p-2 px-4 transition-all hover:bg-bg-200/50 dark:hover:bg-bg-800 ${
        view.toLowerCase() === currentView
          ? 'bg-bg-200/50 font-medium text-bg-800 shadow-sm dark:bg-bg-800 dark:text-bg-200'
          : 'text-bg-500'
      }`}
    >
      {t(`calendar.view.${toCamelCase(view)}`)}
    </button>
  )
}

export default ChangeViewButton
