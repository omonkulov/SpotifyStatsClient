import React from 'react'
import { Redirect } from 'react-router'
import { useEffect } from 'react'
import Cookies from 'universal-cookie';

const code = new URLSearchParams(window.location.search).get('code')
const cookies = new Cookies()

export default function AuthRedirect() {

    useEffect(() => {
        if (code) cookies.set("code", code)
    }, [])

    return (
        <div>
            {(code) ? <Redirect to="/dashboard" /> : <h1>code</h1>}
        </div>
    )
}
