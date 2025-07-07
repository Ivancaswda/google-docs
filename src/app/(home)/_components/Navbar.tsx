import React from 'react'
import Link from 'next/link'
import SearchInput from '../_components/SearchInput'
import {UserButton, OrganizationSwitcher} from "@clerk/clerk-react";

const Navbar = () => {
    return (
        <nav className='flex items-center justify-between h-full w-full'>
            <div className='flex gap-3 items-center shrink-0 pr-6'>
                <Link href='/'>
                    <img src='https://img.icons8.com/m_rounded/512/228BE6/google-logo.png' alt='logo.png' width={36} height={36} />
                </Link>
                <h3 className='text-xl text-blue-500 font-semibold'>Docs</h3>
            </div>
            <SearchInput/>
            <div className='flex gap-3 items-center'>
                <OrganizationSwitcher afterCreateOrganizationUrl='/'
                                      afterLeaveOrganizationUrl='/'
                                      afterSelectOrganizationUrl='/'
                                      afterSelectPersonalUrl='/'

                />
                <UserButton/>
            </div>


        </nav>
    )
}
export default Navbar
