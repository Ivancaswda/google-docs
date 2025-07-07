import React from 'react'

import {Id} from '../../../../convex/_generated/dataModel'
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ExternalLinkIcon, FilePenIcon, MoreVertical, TrashIcon} from "lucide-react";
import RemoveDialog from "@/app/(home)/_components/RemoveDialog";
import RenameDialog from "@/app/(home)/_components/RenameDialog";

interface DocumentMenuProps {
    documentId: Id<"documents">;
    title: string,
    onNewTab: (id: Id<"documents">) => void
}

const DocumentMenu = ({documentId, title, onNewTab}: DocumentMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='rounded-full'>
                        <MoreVertical className='size-4'/>
                    </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <RemoveDialog documentId={documentId}>
                    <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                        <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                            <TrashIcon className="size-4 mr-2" />
                            Удалить
                        </div>
                    </DropdownMenuItem>
                </RemoveDialog>
                <RenameDialog initialTitle={title} documentId={documentId}>
                    <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                        <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                            <FilePenIcon className="size-4 mr-2" />
                            Переименовать
                        </div>
                    </DropdownMenuItem>
                </RenameDialog>

                <DropdownMenuItem onClick={() => onNewTab(documentId)}>
                    <ExternalLinkIcon className='size-4 mr-2'/>
                    Открыть в новом окне
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default DocumentMenu














