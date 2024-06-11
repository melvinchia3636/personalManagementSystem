import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from '@components/Sidebar/index'
import Header from './components/Header'

function MainApplication(): React.ReactElement {
  return (
    <>
      <Sidebar />
      <main className="flex size-full min-w-0 flex-col pb-0 sm:ml-20 lg:ml-0">
        <Header />
        <Outlet />
      </main>
    </>
  )
}

export default MainApplication
