import React from 'react'
import {auth} from '@clerk/nextjs/server'
import {Id} from "../../../../convex/_generated/dataModel";
import {preloadQuery} from "convex/nextjs";
import {api} from "../../../../convex/_generated/api";
import Document from "@/app/documents/_components/document";


interface DocumentIdPageProps {
    params: { documentId: Id<"documents"> }
}

const DocumentPage = async ({params}: DocumentIdPageProps) => {
    const {documentId}= await params


    const {getToken} = await auth()
    const token = await getToken({template: 'convex'}) ?? undefined




    const preloadedDocument =await preloadQuery(api.documents.getDocumentById, {id:documentId}, {token})

    if (!preloadedDocument) throw new Error('Document not found')


    return <Document preloadedDocument={preloadedDocument}/>
}
export default DocumentPage

