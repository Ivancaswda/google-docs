'use client'
import {api} from "../../../../convex/_generated/api";
import React, {useState} from 'react'
import Navbar from '../_components/Navbar'
import {Room} from "@/app/documents/[documentId]/Room";
import Editor from "@/app/documents/[documentId]/editor";
import Toolbar from "@/app/documents/_components/Toolbar";
import {Avatars} from "@/app/documents/_components/Avatars";
import {Preloaded, usePreloadedQuery} from "convex/react";
import {Threads} from "@/app/documents/_components/Threads";
interface DocumentProps {
    preloadedDocument: Preloaded<typeof  api.documents.getDocumentById>
}

const Document =  ({preloadedDocument}: DocumentProps) => {

    console.log(preloadedDocument)

    const document = usePreloadedQuery(preloadedDocument)
    console.log(document)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (

        <div className='min-h-screen bg-[#FAFBFD]'>
            <Room>
                <div
                    className='fixed top-0   z-10 bg-[#FAFBFD] print:hidden w-full max-w-[816px] px-4 flex flex-col gap-y-2'>
                    <Navbar data={document}/>
                    <Toolbar setIsOpen={setIsOpen} isOpen={isOpen}/>
                </div>

                <div className='pt-[114px] pb-[114px] print:pt-0 flex justify-center relative'>


                        <Editor initialContent={document.initialContent}/>
                    {isOpen &&     <Threads/>}

                        <Avatars/>


                </div>
            </Room>
        </div>


    )
}
export default Document
