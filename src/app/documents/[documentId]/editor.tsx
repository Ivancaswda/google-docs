'use client'
import React from 'react'
import {useStorage} from "@liveblocks/react";
import {useEditorStore} from "@/store/use-editor-store"
import {StarterKit} from "@tiptap/starter-kit";
import {Color} from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextStyle from '@tiptap/extension-text-style'
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import ImageResize from 'tiptap-extension-resize-image'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import FontFamily from '@tiptap/extension-font-family'
import {useEditor, EditorContent} from "@tiptap/react";
import Link from '@tiptap/extension-link'
import {LineHeightExtension} from '../../../extensions/line-height'
import {FontSizeExtension} from '../../../extensions/font-size'
import {useLiveblocksExtension} from "@liveblocks/react-tiptap";
import Ruler from '../_components/Ruler'
import {Threads} from "@/app/documents/_components/Threads";


interface EditorProps {
    initialContent?: string | undefined
}

const Editor = ({initialContent}) => {

    const leftMargin = useStorage((root) => root.leftMargin)
    const rightMargin = useStorage((root) => root.rightMargin)

    const liveblocks = useLiveblocksExtension({initialContent, offlineSupport_experimental: true});


    const {setEditor} = useEditorStore();

    const editor = useEditor({
        immediatelyRender: false,
        onCreate({editor}) {
          setEditor(editor)
        },
        onDestroy() {
          setEditor(null)
        },
        onUpdate({editor}) {
          setEditor(editor)
        },
        onTransaction({editor}) {
          setEditor(editor)
        },
        onFocus({editor}) {
            setEditor(editor)
        },
        onBlur({editor}) {
            setEditor(editor)
        },
        onContentError({editor}) {
            setEditor(editor)
        },
        onSelectionUpdate({editor}) {
            setEditor(editor)
        },
        editorProps: {
            attributes: {
                style: `padding-left: ${leftMargin ?? 56}px; padding-right:${rightMargin ?? 56}px`,
                class: 'focus:outline-none border print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px]  pr-14 py-10 cursor-text'
            }
        },
        extensions: [
            liveblocks,
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            LineHeightExtension.configure({
                types: ['heading', "paragraph"],
                defaultLineHeight: "normal"
            }),
            Link.configure({
               openOnClick: false,
                autolink: true,
                defaultProtocol: 'https://'
            }),
            FontSizeExtension,
            StarterKit.configure({
                history: false
            }),
            TaskList,

            TaskItem.configure({
                nested: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Image,
            Dropcursor,
            ImageResize,
            Underline,
            TextStyle,
            FontFamily.configure({
                types: ['textStyle'], // используемый тип
            }),
            Color,
            Highlight.configure({
                multicolor: true
            })
        ],
        content: `
      
      `,
    })


    return (
        <div className='size-full overflow-x-auto'>
            <Ruler/>
            <div className='min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
                <EditorContent editor={editor}/>

            </div>
        </div>
    )
}
export default Editor
