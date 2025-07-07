import "@liveblocks/react-ui/styles.css";
interface DocumentsLayoutProps {
    children: React.ReactNode
}

import React from 'react'

const DocumentsLayout = ({children}: DocumentsLayoutProps) => {

    return (
            <div className='flex flex-col gap-y-4'>
                <nav className='w-full bg-gray-100'>Navbar</nav>
                {children}
            </div>
    )
}
export default DocumentsLayout
