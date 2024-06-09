import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function WalletBalance(): React.ReactElement {
  const { t } = useTranslation()

  return (
    <section className="col-span-2 row-span-1 flex w-full flex-col gap-4 rounded-lg bg-bg-50 p-8 shadow-custom dark:bg-bg-900">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:wallet" className="text-2xl" />
        <span className="ml-2">
          {t('dashboard.modules.walletBalance.title')}
        </span>
      </h1>
      <ul className="flex flex-col gap-4">
        <li className="flex items-center justify-between gap-4 rounded-lg bg-bg-100 p-4 pl-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-bg-200 dark:bg-bg-800 dark:hover:bg-bg-700/50">
          <div className="flex items-center gap-4">
            <Icon icon="tabler:cash" className="size-6" />
            <div className="flex flex-col">
              <div className="font-semibold ">Cash</div>
              <div className="text-sm text-bg-500">RM 520.00</div>
            </div>
          </div>
          <button className="rounded-lg p-4 text-bg-500 transition-all">
            <Icon icon="tabler:chevron-right" className="text-2xl" />
          </button>
        </li>
        <li className="flex items-center justify-between gap-4 rounded-lg bg-bg-100 p-4 pl-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-bg-200 dark:bg-bg-800">
          <div className="flex items-center gap-4">
            <Icon icon="tabler:device-mobile" className="size-6" />
            <div className="flex flex-col">
              <div className="font-semibold ">Touch N&apos; Go e-Wallet</div>
              <div className="text-sm text-bg-500">RM 128.00</div>
            </div>
          </div>
          <button className="rounded-lg p-4 text-bg-500 transition-all">
            <Icon icon="tabler:chevron-right" className="text-2xl" />
          </button>
        </li>
        <li className="flex items-center justify-between gap-4 rounded-lg bg-bg-100 p-4 pl-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-bg-200 dark:bg-bg-800">
          <div className="flex items-center gap-4">
            <Icon icon="tabler:building-bank" className="size-6" />
            <div className="flex flex-col">
              <div className="font-semibold ">Bank Account</div>
              <div className="text-sm text-bg-500">RM 12,487.00</div>
            </div>
          </div>
          <button className="rounded-lg p-4 text-bg-500 transition-all">
            <Icon icon="tabler:chevron-right" className="text-2xl" />
          </button>
        </li>
      </ul>
    </section>
  )
}
