'use client'
import React from 'react'
import {type ColorResult, CirclePicker} from 'react-color'
import {
    LucideIcon,
    Undo2Icon,
    Redo2Icon,
    PrinterIcon,
    SpellCheckIcon,
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    MessageCircleIcon,
    RemoveFormattingIcon,
    ListTodoIcon,
    ChevronDownIcon,
    HighlighterIcon,
    ListOrderedIcon,
    ListIcon,
    Link2Icon,
    UploadIcon,
    SearchIcon,
    ImageIcon,
    AlignLeftIcon,
    AlignRightIcon,
    AlignCenterIcon,
    AlignJustifyIcon,
    MinusIcon, PlusIcon
} from "lucide-react";

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from '@/components/ui/dialog'
import {cn} from '@/lib/utils'
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {useEditorStore} from "@/store/use-editor-store";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu'
import {type Level} from '@tiptap/extension-heading'
import {useState} from 'react'
import {Input} from '@/components/ui/input'


interface ToolbarButtonProps {
    onClick: () => void,
    isActive?: boolean,
    icon: LucideIcon
}

const LineHeightButton = () => {
    const {editor} = useEditorStore();

    const lineHeight = [
        { label: 'Default', value: 'normal' },
        { label: 'Single', value: '1' },
        { label: '1.15', value: '1.15' },
        { label: '1.5', value: '1.5' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button>
                    <AlignLeftIcon className='size-4' />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='p-1 flex flex-col gap-y-1'>
                {lineHeight.map(({label, value}) => {
                    const isActive =
                        editor?.getAttributes('paragraph').textAlign === value ||
                        editor?.getAttributes('heading').textAlign === value;

                    return (
                        <Button
                            key={value}
                            className={cn(
                                "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                                editor?.getAttributes('paragraph').lineHeight === value && 'bg-neutral-200/80'
                            )}
                            onClick={() => editor?.chain().focus().setLineHeight(value).run()}
                        >

                            <span className='text-sm'>{label}</span>
                        </Button>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const FontSizeButton = () => {
    const {editor} = useEditorStore();

    const currentFontSize= editor?.getAttributes('textStyle').fontSize ? editor?.getAttributes('textStyle').fontSize.replace('px', '') : '16'

    const [fontSize, setFontSize] = useState(currentFontSize)
    const [inputValue, setInputValue] = useState(fontSize)
    const [isEditing, setIsEditing] = useState(false)

    const updateFontSize = (newSize: string) => {
        const size= parseInt(newSize)
        if (!isNaN(size) && size > 0) {
            editor?.chain().focus().setFontSize(`${size}px`).run()
            setFontSize(newSize)
            setInputValue(newSize)
            setIsEditing(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleInputBlur =() => {
        updateFontSize(inputValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            updateFontSize(inputValue)
            editor?.commands.focus()
        }
    }
    const increment = () => {
        const newSize = parseInt(fontSize) + 1;
        updateFontSize(newSize.toString())
    }

    const decrement = () => {
        const newSize = parseInt(fontSize) - 1
        if (newSize > 0) {
            updateFontSize(newSize.toString())
        }
    }



    return (
        <div className='flex items-center gap-x-0.5'>
            <Button onClick={decrement}>
                <MinusIcon className='size-4'/>
            </Button>
            {isEditing ? (
                <Input type='text'
                       value={inputValue}
                       onChange={handleInputChange}
                       onBlur={handleInputBlur}
                       onKeyDown={handleKeyDown}
                />
            ) : (
                <Button onClick={() => {
                    setIsEditing(true)
                    setFontSize(currentFontSize)
                }}>
                    {currentFontSize}
                </Button>
            )}
            <Button onClick={increment}>
                <PlusIcon/>
            </Button>
        </div>
    );
};

const ListButton = () => {
    const {editor} = useEditorStore();

    const lists = [
        { label: 'Bullet List',
            icon: ListIcon,
            isActive: () => editor?.isActive('bulletList'),
            onClick: () => editor?.chain().focus().toggleBulletList().run()
        },
        { label: 'Ordered List',
            icon: ListOrderedIcon,
            isActive: () => editor?.isActive('orderedList'),
            onClick: () => editor?.chain().focus().toggleOrderedList().run()
        },

    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button>
                    <AlignLeftIcon className='size-4' />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='p-1 flex flex-col gap-y-1 '>
                {lists.map(({label,  icon: Icon, onClick, isActive}) => {


                    return (
                        <Button
                            key={label}
                            className={cn(
                                "flex items-center gap-x-2 px-2  text-black py-1 rounded-sm hover:bg-neutral-200/80",
                                isActive && 'bg-neutral-200/80'
                            )}
                            onClick={onClick}
                        >
                            <Icon className='size-4' />
                            <span className='text-sm'>{label}</span>
                        </Button>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


const AlignButton = () => {
    const {editor} = useEditorStore();

    const alignments = [
        { label: 'Align Left', value: 'left', icon: AlignLeftIcon },
        { label: 'Align Center', value: 'center', icon: AlignCenterIcon },
        { label: 'Align Right', value: 'right', icon: AlignRightIcon },
        { label: 'Align Justify', value: 'justify', icon: AlignJustifyIcon },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button>
                    <AlignLeftIcon className='size-4' />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='p-1 flex flex-col gap-y-1'>
                {alignments.map(({label, value, icon: Icon}) => {
                    const isActive =
                        editor?.getAttributes('paragraph').textAlign === value ||
                        editor?.getAttributes('heading').textAlign === value;

                    return (
                        <Button
                            key={value}
                            className={cn(
                                "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                                isActive && 'bg-neutral-200/80'
                            )}
                            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
                        >
                            <Icon className='size-4' />
                            <span className='text-sm'>{label}</span>
                        </Button>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const ImageButton = () => {
    const {editor} = useEditorStore()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState("")


    const onChange = (src: string) => {
        editor?.chain().focus().setImage({src}).run()
    }

    const onUpload = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const imageUrl = URL.createObjectURL(file)
                onChange(imageUrl)
            }
        }
        input.click()
    }

    const handleImageUrlSubmit = () => {
        if (imageUrl){
            onChange(imageUrl)
            setImageUrl("")
            setIsDialogOpen(false)
        }
    }


    return(
        <>
            <DropdownMenu>
                <DropdownMenuTrigger  asChild>
                    <Button >
                        <ImageIcon className='size-4'/>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className='p-2.5 flex items-center gap-x-2'>
                    <DropdownMenuItem onClick={onUpload}>
                        <UploadIcon className='size-4 mr-2'/>
                        Upload
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                        <SearchIcon className='size-4 mr-2'/>
                        Paste image url
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Paste image URL</DialogTitle>
                    </DialogHeader>
                    <Input onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleImageUrlSubmit()
                        }
                    }}
                        onChange={(e) => setImageUrl(e.target.value)}
                           placeholder='paste image URL' value={imageUrl}
                    />
                    <DialogFooter>
                        <Button onClick={handleImageUrlSubmit}>
                            Paste
                        </Button>
                    </DialogFooter>
                </DialogContent>


            </Dialog>
        </>

    )

}


const LinkButton = () => {
    const {editor} = useEditorStore()

    const [value, setValue] = useState("")


    const onChange = (href: string) => {
        editor?.chain().focus().extendMarkRange('link').setLink({href}).run()
        setValue('')
    }
    return(
        <DropdownMenu onOpenChange={(open) => {
            if (open) {

                setValue(editor?.getAttributes('link').href || '')
            }
        }}>
            <DropdownMenuTrigger  asChild>
                <Button >
                    <Link2Icon/>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='p-2.5 flex items-center gap-x-2'>
                    <Input placeholder='https://example.com' value={value} onChange={(e) => setValue(e.target.value)}/>
                <Button onClick={() => onChange(value)}>Apply</Button>

            </DropdownMenuContent>
        </DropdownMenu>
    )

}

const TextColorButton = () =>{
    const {editor} = useEditorStore()

    const value = editor?.getAttributes('textStyle').color || "#000000"

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run()
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button>
                    <span className='text-xs'>A</span>
                    <div className='h-0.5 w-full' style={{backgroundColor: value}}></div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='border border-2 border-gray-500'>
            <CirclePicker color={value} onChange={onChange}/>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}


const HighlightColorButton = () =>{
    const {editor} = useEditorStore()


    const value = editor?.getAttributes('highlight').color || '#000000'


    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setHighlight({color: color.hex}).run()
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button>
                        <HighlighterIcon className='size-4'/>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='border border-2 border-gray-500'>
                <CirclePicker color={value} onChange={onChange}/>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}

const HeadingLevelButton = () => {
    const {editor} = useEditorStore()

    const headings = [
        {label: 'Normal text', value: 0, fontSize: "16px"},
        {label: 'Heading 1', value: 1, fontSize: "32px"},
        {label: 'Heading 2', value: 2, fontSize: "24px"},
        {label: 'Heading 3', value: 3, fontSize: "20px"},
        {label: 'Heading 4', value: 4, fontSize: "18px"},

    ]

    const getCurrentHeading = () => {
        for (let level = 1; level <= 5; level++) {
            if (editor?.isActive('heading', {level})) {
                return `Heading ${level}`
            }
        }
        return 'Normal text'
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className={cn('h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm')}>
                    <span className='truncate'>
                        {getCurrentHeading()}
                    </span>
                    <ChevronDownIcon className='mt-2 size-4 shrink-0'/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='p-1 border flex flex-col gap-y-1'>
                {headings.map(({label, value, fontSize}) => (
                    <button onClick={() => {

                        if (value == 0) {
                            editor?.chain().focus().setParagraph().run()
                        } else {
                            editor?.chain().focus().toggleHeading({level: value as Level}).run()
                        }
                    }} key={value} style={{fontSize}}
                            className={cn('flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80 ',
                                (value === 0 && !editor?.isActive('heading'))
                                || editor?.isActive('heading', {level: value}) && 'bg-neutral-200/80'
                            )}>
                        {label}
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


const FontFamilyButton = () => {
    const {editor} = useEditorStore();
    const fonts = [
        {label: 'Arial', value: 'Arial'},
        {label: 'Times New Roman', value: 'Times New Roman'},
        {label: 'Courier New', value: 'Courier New'},
        {label: 'Georgia', value: 'Georgia'},
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className={cn('h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm')}>
                    {editor?.getAttributes('textStyle').fontFamily || 'Arial'}
                    <ChevronDownIcon className='mt-2 size-4 shrink-0'/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='p-1 flex flex-col gap-y-1'>
                {fonts.map(({label, value}) => (
                        <Button onClick={() => editor?.chain().focus().setFontFamily(value).run()} style={{fontFamily: value}} key={value} className={cn('flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80 ', editor?.getAttributes('textStyle').fontFamily === value && 'bg-neutral-200/80')}>
                            <>

                                <span className='text-sm'>{label}</span>
                            </>
                        </Button>
                ))}

            </DropdownMenuContent>

        </DropdownMenu>
    )

}


const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
}: ToolbarButtonProps) => {



    return (
        <button onClick={onClick} className={cn('text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80',
            isActive && 'bg-neutral-200/80'
        )}>
            <Icon className='size-4'/>
        </button>
    )
}

const Toolbar = ({isOpen, setIsOpen}) => {
    const {editor} = useEditorStore()

    console.log('')

    const sections: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
        isActive?: boolean
    }[][] = [
        [
            {
                label: 'Undo',
                icon: Undo2Icon,
                onClick: () => editor?.chain().focus().undo().run()
            },
            {
                label: 'Redo',
                icon: Redo2Icon,
                onClick: () => editor?.chain().focus().redo().run()
            },
            {
                label: 'Print',
                icon: PrinterIcon,
                onClick: () => window.print()
            },
            {
                label: 'Spell Check',
                icon: SpellCheckIcon,
                onClick: () => {
                    const current = editor?.view.dom.getAttribute('spellcheck')
                    editor?.view.dom.setAttribute('spellcheck', current === 'false' ? 'true' : 'false')
                }
            }
        ],
        [
            {
                label: 'Bold',
                icon: BoldIcon,
                isActive: editor?.isActive('bold'),
                onClick: () => editor?.chain().focus().toggleBold().run()
            },
            {
                label: 'Italic',
                icon: ItalicIcon,
                isActive: editor?.isActive('italic'),
                onClick: () => editor?.chain().focus().toggleItalic().run()
            },
            {
                label: 'Underline',
                icon: UnderlineIcon,
                isActive: editor?.isActive('underline'),
                onClick: () => editor?.chain().focus().toggleUnderline().run()
            }
        ],
        [
            {
                label: 'Comment',
                icon: MessageCircleIcon,
                onClick: () => {
                    editor?.chain().focus().addPendingComment().run()
                    setIsOpen(!isOpen)
                },
                isActive: editor?.isActive('liveblockCommentMark')
            },
            {
                label: 'List Todo',
                icon: ListTodoIcon,
                onClick: () => editor?.chain().focus().toggleTaskList().run(),
                isActive: editor?.isActive('taskList')
            },
            {
                label: 'Remove Formatting',
                icon: RemoveFormattingIcon,
                onClick: () => editor?.chain().focus().unsetAllMarks().run(),
                isActive: editor?.isActive('taskList')
            },



        ]
    ]



    return (
        <div className='bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.6'>
            {sections[0].map((item) => (
                <ToolbarButton key={item.label} {...item}/>
            ))}
            <Separator orientation='vertical' className='h-6 bg-neutral-300'/>

            <Separator orientation='vertical' className='h-6 bg-neutral-300'/>

            <Separator orientation='vertical' className='h-6 bg-neutral-300'/>

            <Separator orientation='vertical' className='h-6 bg-neutral-300'/>

            {sections[1].map((item) => (
                <ToolbarButton key={item.label} {...item}/>
            ))}
            <div className='flex items-center gap-2'>


                <FontFamilyButton/>
                <HeadingLevelButton/>
                <TextColorButton/>
                <HighlightColorButton/>
            </div>
            <Separator orientation='vertical' className='h-6 bg-neutral-300'/>

            <div className='flex items-center gap-2'>


                <LinkButton/>

                <ImageButton/>

                <AlignButton/>

                <ListButton/>

                <FontSizeButton/>

                <LineHeightButton/>
            </div>
            {sections[2].map((item) => (
                <ToolbarButton key={item.label} {...item}/>
            ))}

        </div>
    )
}
export default Toolbar
