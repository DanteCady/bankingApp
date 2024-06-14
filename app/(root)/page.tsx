import HeaderBox from '@/components/ui/headerBox'
import RightSidebar from '@/components/ui/rightSidebar'
import { TotalBalanceBox } from '@/components/ui/totalBalanceBox'
import Head from 'next/head'
import React from 'react'

const Home = () => {
    const loggedIn = {firstName: 'John', lastName: 'Doe', emai: 'contact.jdoe@bankCorp.com'}
  return (
    <section className='home'>
        <div className='hopme-content'>
            <header className='home-header'>
               <HeaderBox
               type="greeting"
               title="Welcome"
               user={loggedIn?.firstName || 'Guest'}
               subtext="Access and manage your account
                and transactions efficiently."
               />
             <TotalBalanceBox 
                accounts= {[]}
                totalCurrentBalance={1250.35}
             />
             </header>
             RECENT TRANSACTIONS
        </div>
        <RightSidebar 
        user={loggedIn}
        transactions={[]}
        banks={[]}
        />
    </section>
  )
}

export default Home