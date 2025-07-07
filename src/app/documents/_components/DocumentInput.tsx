'use client'
import React, {useRef, useState} from 'react'
import {BsCloudCheck, BsCloudSlash} from 'react-icons/bs'
import {Id} from "../../../../convex/_generated/dataModel";
import {mutation} from "../../../../convex/_generated/server";
import {api} from "../../../../convex/_generated/api";
import {useMutation} from "convex/react";
import {useDebounce} from "@/hooks/use-debounce";
import {toast} from "sonner";
import {useStatus} from "@liveblocks/react";
import {Loader2Icon} from "lucide-react";

interface DocumentInputProps {
    title: string,
    id: Id<"documents">
}
const DocumentInput = ({title, id}: DocumentInputProps) => {

    const status = useStatus()

    const [value, setValue] = useState(title)

    const [isPending, setIsPending] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const updateDocument = useMutation(api.documents.updateById)

    const debouncedUpdate = useDebounce((newValue: string) => {
        if (newValue === title) return

            setIsPending(true)
            updateDocument({id, title: newValue})
                .then(() => toast('Document updated!'))
                .catch(() => toast.error('Something went wrong'))
                .finally(() => setIsPending(false))


    })

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setValue(newValue)
        debouncedUpdate(newValue)
    }

    const handleSubmit =  (e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault()

        setIsPending(true)
        updateDocument({id, title: value})
            .then(() => {
                toast('Document updated!')
                setIsEditing(false)
            })
            .catch(() => toast.error('Something went wrong'))
            .finally(() => setIsPending(false))


    }

    const showLoader = isPending || status === 'connecting' || status === 'reconnecting'
    const showError = status === 'disconnected'
    return (
        <div className='flex items-center gap-2 '>
            {isEditing ? <form onSubmit={handleSubmit} className='relative w-fit max-w-[50ch]' action="">
                <span className='invisible whitespace-pre px-1.5 text-lg'>
                    {value || ""}
                </span>
                <input type="text"
                       value={value}
                       ref={inputRef}
                       onBlur={() => setIsEditing(false)}
                       onChange={onChange}
                       className='absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate'
                />
            </form> : <span onClick={() => {
                setIsEditing(true)
                setTimeout(() => {
                    inputRef.current?.focus()
                }, 0)
            }} className='text-lg cursor-pointer px-1.5 truncate'>{title}</span>}

            {showError && <BsCloudSlash className='size-4'/>}
            {!showError && !showLoader && <BsCloudCheck/>}
            {showLoader && <Loader2Icon className='size-4 animate-spin text-muted-foreground'/>}
        </div>
    )
}
export default DocumentInput
