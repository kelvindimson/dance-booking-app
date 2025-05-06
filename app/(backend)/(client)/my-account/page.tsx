import React from 'react'
import { auth } from '@/auth'

const AccountPage = async () => {
    const session = await auth()
    return (
        <div>Customer Account Page.
        <p>This is where you can manage your account.</p>
        {JSON.stringify(session)}
        <p>Here you can find various tools and settings to manage your account.</p>

        </div>
    )
}

export default AccountPage