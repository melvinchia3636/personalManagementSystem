/* eslint-disable tailwindcss/no-custom-classname */
import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { Fragment, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { PersonalizationContext } from '@providers/PersonalizationProvider'

const LANGUAGES: Array<{
  name: string
  code: string
  icon: string
}> = [
  {
    name: 'English',
    code: 'en',
    icon: 'circle-flags:us'
  },
  {
    name: '简体中文',
    code: 'zh-CN',
    icon: 'circle-flags:zh'
  }
]

function LanguageSelector(): React.ReactElement {
  const { language, setLanguage } = useContext(PersonalizationContext)
  const { t } = useTranslation()

  return (
    <div className="mt-4 flex w-full flex-col items-center justify-between gap-6 md:flex-row">
      <div className="mt-6 w-full md:w-auto">
        <h3 className="block text-xl font-medium leading-normal">
          {t('personalization.languageSelector.title')}
        </h3>
        <p className="text-bg-500">
          {t('personalization.languageSelector.desc')}
        </p>
      </div>
      <Listbox
        value={language}
        onChange={language => {
          setLanguage(language)
        }}
      >
        <div className="relative mt-1 w-full md:w-48">
          <Listbox.Button className="relative flex w-full items-center gap-2 rounded-lg border-[1.5px] border-bg-300/50 py-4 pl-4 pr-10 text-left focus:outline-none dark:border-bg-700 dark:bg-bg-900 sm:text-sm">
            <Icon
              icon={LANGUAGES.find(({ code }) => code === language)?.icon}
              className="h-5 w-5"
            />
            <span className="mt-[-1px] block truncate">
              {LANGUAGES.find(({ code }) => code === language)?.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon
                icon="tabler:chevron-down"
                className="h-5 w-5 text-bg-500"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-in duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-900 sm:text-sm">
              {LANGUAGES.map(({ name, code, icon }) => (
                <Listbox.Option
                  key={code}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                      active ? 'bg-bg-200/50 dark:bg-bg-800' : '!bg-transparent'
                    }`
                  }
                  value={code}
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <span className="flex items-center gap-2">
                          <Icon icon={icon} className="h-5 w-5" />
                          {name}
                        </span>
                      </div>
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="block text-lg text-custom-500"
                        />
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default LanguageSelector