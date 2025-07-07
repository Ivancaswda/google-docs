import React from 'react'
import {Doc} from "../../../../convex/_generated/dataModel";
import {PaginationStatus} from "convex/react";
import {Table, TableBody, TableCell, TableHeader, TableRow, TableHead} from "@/components/ui/table";
import {Loader2Icon} from "lucide-react";
import DocumentItem from "@/app/(home)/_components/DocumentItem";
import DocumentRow from "@/app/(home)/_components/DocumentRow";
import {Button} from "@/components/ui/button";


// INITIALAZATION...
interface DocumentsTableProps {
    documents: Doc<"documents">[] | undefined;
    loadMore: (numItems:number) => void;
    status: PaginationStatus
}

const DocumentsTable = ({documents, loadMore, status}: DocumentsTableProps) => {



    return (
        <div className='   py-6 flex flex-col gap-5'>
            {documents === undefined ? <div className='flex items-center justify-center'>
                <Loader2Icon className='animate-spin'/></div>  :
                <Table>
                    <TableHeader>
                        <TableRow className='hover:bg-transparemt border-none'>
                            <TableHead>Название</TableHead>
                            <TableHead>&nbsp;</TableHead>
                            <TableHead className='hidden md:table-cell'>Создано</TableHead>
                            <TableHead className='hidden md:table-cell'>Дата</TableHead>


                        </TableRow>
                    </TableHeader>
                    {documents.length === 0 ? (
                        <TableBody className='w-full'>
                            <TableRow className='hover:bg-transparent w-full'>
                                <TableCell colSpan={4} className='h-24 text-center text-muted-foreground'>
                                    Документы не найдены
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : <TableBody className=' w-[100%]'>{documents.map((doc) => (
                        <DocumentRow  key={doc._id} document={doc}/>
                    ))}</TableBody>}
                </Table>}
            <div className='flex items-center justify-center'>
                <Button variant='ghost'
                        size='sm'
                        onClick={() => loadMore(5)}
                        disabled={status !== 'CanLoadMore'}

                >
                    {status === 'CanLoadMore' ? 'Грузить более' : 'Конец результатов'}
                </Button>
            </div>

        </div>
    )
}
export default DocumentsTable
