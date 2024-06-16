import React, { useCallback, useEffect, useState } from 'react'
import {Button} from '@/components/ui/button'
import { StyledString } from 'next/dist/build/swc'
import { useRouter } from 'next/navigation'
import {PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink} from 'react-plaid-link'
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions'

const PlaidLink = ({user, variant}: PlaidLinkProps) => {
 const [token, setToken] = useState ('' ) 
 const router = useRouter() 

    useEffect(() => {
        const fetchToken = async () => {
            const data = await createLinkToken(user)
            setToken(data.link_token)
        }
        fetchToken()
    }, [user])
    
    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token:String) =>{
        await exchangePublicToken({
            publicToken: public_token,
            user
        })
        router.push('/')
    }, [user])
    
    const config: PlaidLinkOptions = {
        token,
        onSuccess
    }

    const {open, ready} = usePlaidLink(config)

  return (
    <>
    {variant === "primary" ? (
        <Button
        className='plaidlink-primary'
        onClick={() => open()}
        disabled={!ready}
        >
            Connect Bank
        </Button>
    ): variant === "ghost" ? (
        <Button variant="ghost">
            Connect Bank
        </Button>
    ): (
        <Button variant="text">
            Connect Bank
        </Button>
    )}
    </>
  )
}

export default PlaidLink