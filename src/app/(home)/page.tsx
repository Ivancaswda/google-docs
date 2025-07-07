'use client'
import React from 'react'
import Navbar from './_components/Navbar'
import TemplateGallery from './_components/TemplateGallery'
import {api} from '../../../convex/_generated/api'
import {usePaginatedQuery} from "convex/react";
import FullscreenLoader from "@/app/(home)/_components/FullscreenLoader";
import DocumentsTable from "@/app/(home)/_components/DocumentsTable";
import {useSearchParam} from "@/hooks/useSearchParam";

const HomePage = () => {

    const [search] = useSearchParam()

    const {results, status, loadMore} = usePaginatedQuery(api.documents.getDocuments, {search}, {initialNumItems: 5}) ?? []

    if (!results) {
      return  <FullscreenLoader label='Находим документы...'/>
    }
    return (
        <div className='flex w-full flex-col  items-center min-h-screen justify-center'>
            <div className='fixed w-full top-0 p-4 left-0 right-0 z-10 h-16 bg-white'>
                <Navbar/>
            </div>
            <div className='mt-16 '>
                <TemplateGallery/>
                <DocumentsTable documents={results} loadMore={loadMore} status={status}/>
            </div>


        </div>
    )
}
export default HomePage
