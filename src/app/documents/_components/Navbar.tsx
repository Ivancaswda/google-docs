'use client'
import React from 'react'
import {useEditorStore} from "@/store/use-editor-store";
import {FileIcon, BoldIcon, StrikethroughIcon, ItalicIcon, RemoveFormattingIcon, UnderlineIcon, Undo2Icon, TextIcon,FileJsonIcon, GlobeIcon, FileTextIcon, FilePlusIcon, FilePenIcon, TrashIcon, PrinterIcon} from 'lucide-react'
import {
    Menubar,
    MenubarContent,
    MenubarMenu,
    MenubarItem,
    MenubarTrigger,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent,
    MenubarSeparator,
    MenubarShortcut
} from '@/components/ui/menubar'
import RemoveDialog from "@/app/(home)/_components/RemoveDialog";
import RenameDialog from "@/app/(home)/_components/RenameDialog";
import DocumentInput from "@/app/documents/_components/DocumentInput";
import Link from 'next/link'
import {BsFilePdf} from "react-icons/bs";
import {OrganizationSwitcher, UserButton} from "@clerk/clerk-react";
import {api} from "../../../../convex/_generated/api";
import {Doc} from '../../../../convex/_generated/dataModel'
import {useMutation} from "convex/react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";


interface NavbarProps {
    data: Doc<'documents'>
}

const Navbar = ({data}: NavbarProps) => {
    console.log(data)
    const {editor} = useEditorStore()
    const createDocument = useMutation(api.documents.createDocument)
    const router = useRouter()

    const onNewDocument = () => {
        createDocument({
            title: 'Untitled document',
            initialContent: ""
        }).then((id) => {
            toast('Document created!')
            router.push(`/documents/${id}`)
        }).catch((error) => {
            toast('Failed to create new doc')
            console.log(error)
        })
    }

    const insertTable = ({rows, cols}: {rows: number, cols:number}) => {
        editor?.chain().focus().insertTable({rows, cols, withHeaderRow: false}).run()
    }

    const onDownload =(blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url;
        a.download = filename;
        a.click()
    }
    const onSaveJSON = () => {
        if (!editor) return
        const content = editor.getJSON()
        const blob = new Blob([JSON.stringify(content)], {
            type: 'application/json'
        })
        onDownload(blob, `${data.title}.json`) // document name
    }

    const onSaveHTML = () => {
        if (!editor) return
        const content = editor.getHTML()
        const blob = new Blob([content], {
            type: 'text/html'
        })
        onDownload(blob, `${data.title}.html`) // document name
    }

    const onSaveText = () => {
        if (!editor) return
        const content = editor.getText()
        const blob = new Blob([content], {
            type: 'text/plain'
        })
        onDownload(blob, `${data.title}.txt`) // document name
    }


    return (
        <nav className='flex items-center justify-between w-[96vw]'>
            <div className='flex gap-2 items-center '>

                <Link href='/'>
                    <img alt='logo' width={30} height={30} src='https://img.icons8.com/m_rounded/512/228BE6/google-logo.png'/>
                </Link>
                <div className='flex flex-col'>
                    <DocumentInput title={data.title} id={data._id} />
                    <div className={'flex'}>
                        <Menubar className='bg-transparent border-none shadow-none h-auto p-0'>
                            <MenubarMenu>
                                <MenubarTrigger>
                                    Файл
                                </MenubarTrigger>
                                <MenubarContent className='print:hidden'>
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                            <FileIcon className='size-4 mr-2'/>
                                            Сохранить
                                        </MenubarSubTrigger>

                                        <MenubarSubContent>
                                            <MenubarItem onClick={onSaveJSON}>
                                                <FileJsonIcon className='size-4 mr-2'/>
                                                JSON
                                            </MenubarItem>
                                            <MenubarItem onClick={onSaveHTML}>
                                                <GlobeIcon className='size-4 mr-2'/>
                                                HTML
                                            </MenubarItem>
                                            <MenubarItem onClick={() => window.print()}>
                                                <BsFilePdf className='size-4 mr-2'/>
                                                PDF
                                            </MenubarItem>
                                            <MenubarItem onClick={onSaveText}>
                                                <FileTextIcon className='size-4 mr-2'/>
                                                Text
                                            </MenubarItem>
                                        </MenubarSubContent>

                                    </MenubarSub>
                                    <MenubarItem onClick={onNewDocument}>
                                        <FilePlusIcon className='size-4 mr-2'/>
                                        Новый документ
                                    </MenubarItem>
                                    <MenubarSeparator/>
                                    <RenameDialog documentId={data._id} initialTitle={data.title}>
                                        <MenubarItem>
                                            <FilePenIcon className='size-4 mr-2'/>
                                            Переименовать
                                        </MenubarItem>
                                    </RenameDialog>
                                    <RemoveDialog documentId={data._id}>
                                        <MenubarItem onSelect={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
                                            <TrashIcon className='size-4 mr-2'/>
                                            Удалить
                                        </MenubarItem>
                                    </RemoveDialog>

                                    <MenubarSeparator/>
                                    <MenubarItem onClick={() => window.print()}>
                                        <PrinterIcon className={'size-4 mr-2'}/>
                                        Распечатать <MenubarShortcut>*P</MenubarShortcut>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger
                                    className='text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted/50'>
                                    Редактировать
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                                        <Undo2Icon className='size-4 mr-2'/>
                                        Undo <MenubarShortcut>*Z</MenubarShortcut>
                                    </MenubarItem>
                                    <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                                        <Undo2Icon className='size-4 mr-2'/>
                                        Redo <MenubarShortcut>*Y</MenubarShortcut>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger
                                    className='text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted/50  '>
                                    Вставить
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger>Таблица</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => insertTable({rows: 1, cols: 1})}>
                                                1 * 1
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({rows: 2, cols: 2})}>
                                                2 * 2
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({rows: 3, cols: 3})}>
                                                3 * 3
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({rows: 4, cols: 4})}>
                                                4 * 4
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger
                                    className='text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted/50  '>
                                    Отформатировать
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                            <TextIcon className='size-4 mr-2'/>
                                            Text
                                        </MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                                                <BoldIcon className='size-4 mr-2'/>
                                                Bold
                                                <MenubarShortcut>*B</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                                                <ItalicIcon className='size-4 mr-2'/>
                                                Italic
                                                <MenubarShortcut>*I</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem
                                                onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                                                <UnderlineIcon className='size-4 mr-2'/>
                                                Underline
                                                <MenubarShortcut>*U</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                                                <StrikethroughIcon className='size-4 mr-2'/>
                                                Strike &nbsp;
                                                <MenubarShortcut>*S</MenubarShortcut>
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                                        <RemoveFormattingIcon className='size-4 mr-2'/>
                                        Убрать фонт
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                </div>

            </div>
            <div className='flex gap-3 items-center'>

                <OrganizationSwitcher afterCreateOrganizationUrl='/'
                                      afterLeaveOrganizationUrl='/'
                                      afterSelectOrganizationUrl='/'
                                      afterSelectPersonalUrl='/'

                />
                <UserButton/>
            </div>

        </nav>
    )
}
export default Navbar
