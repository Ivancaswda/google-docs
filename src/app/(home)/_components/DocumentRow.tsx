import React from 'react'
import {Doc} from "../../../../convex/_generated/dataModel";
import {TableRow, TableCell} from "@/components/ui/table";
import {SiGoogledocs} from "react-icons/si";
import {BuildingIcon, CircleUserIcon, MoveVertical} from "lucide-react";
import {format} from 'date-fns'
import {ru} from "date-fns/locale/ru";
import {Button} from "@/components/ui/button";
import DocumentMenu from "@/app/(home)/_components/DocumentMenu";
import {useRouter} from "next/navigation";
interface DocumentRowProps {
    document: Doc<'documents'>
}

const DocumentRow = ({document}: DocumentRowProps) => {

    const router = useRouter()

    const onNewTabCreate = (docId: string) => {
        window.open(`/documents/${docId}`, '_blank')
    }


    return (
        <TableRow onClick={() => router.push(`/documents/${document._id}`)} className='cursor-pointer w-full '>
            <TableCell className='w-[50px]'>
                <SiGoogledocs className='size-6 fill-blue-500'/>
            </TableCell>
            <TableCell className='font-medium md:w-[45%]'>
                {document.title}
            </TableCell>
            <TableCell className='text-muted-foreground hidden md:flex items-center gap-2'>
                {document?.organizationId ? <BuildingIcon className='size-4 '/> : <CircleUserIcon className='size-4 '/>}
                {document.organizationId ? 'Organization' : 'Personal'}
            </TableCell>

            <TableCell className='text-muted-foreground'>
                {format(new Date(document._creationTime), 'MMM dd, yyy', {locale: ru})}
            </TableCell>

            <TableCell className='text-muted-foreground flex justify-end'>
                <Button variant='ghost' size='icon' className='rounded-full'>
                    <DocumentMenu onNewTab={onNewTabCreate} documentId={document._id} title={document.title}/>
                </Button>
            </TableCell>

        </TableRow>
    )
}
export default DocumentRow
