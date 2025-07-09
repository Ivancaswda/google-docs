'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,

    AlertDialogTrigger,
    AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter
} from '@/components/ui/alert-dialog'
import React, {useState} from 'react'
import {Id} from "../../../../convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {toast} from "sonner";
import {useRouter} from "next/navigation";





interface RemoveDialogProps {
    documentId: Id<"documents">,
    children: React.ReactNode
}

const RemoveDialog = ({documentId, children}: RemoveDialogProps) => {

    const removeDocument = useMutation(api.documents.removeById)

    const [isRemoving, setIsRemoving] = useState(false)
    const router =useRouter()

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Вы уверены что хотите удалить документ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Вы не сможете потом вернуть его!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                        Отменить
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsRemoving(true);
                            removeDocument({ id: documentId }).finally(() => {
                                setIsRemoving(false)
                                toast('Документ успешно удален')
                                router.push('/')
                            });
                        }}
                        disabled={isRemoving}
                    >
                        Удалить
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}
export default RemoveDialog















