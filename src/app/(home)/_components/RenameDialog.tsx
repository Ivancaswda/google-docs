import React, {useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Id} from "../../../../convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {toast} from "sonner";

interface RenameDialogProps {
    documentId: Id<'documents'>;
    initialTitle: string,
    children: React.ReactNode
}

const RenameDialog = ({documentId, initialTitle, children}: RenameDialogProps) => {

    const updateDocument = useMutation(api.documents.updateById)
    const [isUpdating, setIsUpdating] = useState(false)

    const [title, setTitle] = useState(initialTitle)
    const [open, setOpen] = useState(false)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {


            setIsUpdating(true)

            await updateDocument({id: documentId, title: title.trim() || 'Untitled'})
        }
            catch (error) {
                console.log(error)
                toast('Не удалось обновить документ!')
        } finally {
                setOpen(false)
                setIsUpdating(false)
                toast('Документ успешно обновлён!')

        }

    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()}>
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Название документа</DialogTitle>
                        <DialogDescription>
                            Введите название для этого документа
                        </DialogDescription>
                    </DialogHeader>
                    <div className='my-4'>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)}
                               placeholder='Название документа' onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <DialogFooter>
                        <Button type='button' disabled={isUpdating} variant='ghost'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setOpen(false)
                                }}>
                            Отменить
                        </Button>
                        <Button  type='submit'>
                            Сохранить
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default RenameDialog








