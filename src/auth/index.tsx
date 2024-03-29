/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import AuthSideImage from './components/AuthSideImage'
import AuthHeader from './components/AuthHeader'
import AuthForm from './components/AuthForm'

function Auth(): React.ReactElement {
  return (
    <>
      <section className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-8 py-12 sm:px-12 lg:w-1/2">
        <AuthHeader />
        <AuthForm />
      </section>
      <AuthSideImage />
    </>
  )
}

export default Auth
