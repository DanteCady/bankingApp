import React from 'react'
import AuthForm from '@/components/ui/authForm'

const SignIn = () => {
  return (
    <section className='flex-center
     size-full
      max-sm:px-6'
      >
        <AuthForm
        type='Sign-in'
        /> 
      </section>
  )
}

export default SignIn