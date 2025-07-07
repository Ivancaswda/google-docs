'use client'
import React, {useState} from 'react'
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from '@/components/ui/carousel'
import {cn} from '../../../lib/utils'
import {Button} from "@/components/ui/button";
import {templates} from '@/templates'
import {useRouter} from "next/navigation";
import {useMutation} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {toast} from "sonner";

const TemplateGallery = () => {
    const router =  useRouter()
    const createDocument = useMutation(api.documents.createDocument)

    const [isCreating, setIsCreating] = useState<boolean>(false)

    const onTemplateCreate = async (title: string, initialContent: string) => {
        try {
            setIsCreating(true)

            await createDocument({title, initialContent}).then((documentId) => {
                router.push(`/documents/${documentId}`)
            })
            toast('Документ успешно создан ✅')
        }
            catch {
                toast('Не удалось создать новый документ! ')
            }
            finally {
            setIsCreating(false)
        }
    }
    return (
        <div className='bg-[#F1F3F4]'>
            <div className='max-w-screen-xl mx-auto px-4 md:px-16 py-6 flex flex-col gap-y-4'>
                <h3 className='text-base font-medium'>Начать новый документ</h3>
                <Carousel>
                    <CarouselContent className='-ml-4'>
                        {templates.map((template) => (
                            <CarouselItem
                                key={template.id}
                                className='basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4'
                            >
                                <div
                                    className={cn(
                                        'flex flex-col gap-y-2.5 items-center',
                                        isCreating && 'pointer-events-none opacity-70'
                                    )}
                                >
                                    <button
                                        onClick={() => onTemplateCreate(template.label, template.initialContent)}
                                        disabled={isCreating}
                                        className='relative w-full aspect-[3/4] bg-white border border-gray-300 shadow-md hover:shadow-lg rounded-sm transition-shadow duration-200 overflow-hidden'
                                    >
                                        <img
                                            src={template.imageUrl}
                                            alt={template.label}
                                            fill
                                            className='object-cover object-top'
                                        />
                                    </button>
                                    <p className='text-sm font-medium text-center px-1 truncate w-full'>{template.label}</p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
            </div>
        </div>
    )
}
export default TemplateGallery
