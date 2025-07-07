'use client'
import DocsBg from "../../public/Docs-bg.png"
import {ReactNode} from "react";
import {ConvexReactClient} from "convex/react";
import {ConvexProviderWithClerk} from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated, AuthLoading} from 'convex/react'
import {SignIn} from "@clerk/clerk-react";
import {Loader2Icon} from "lucide-react";
import Image from "next/image";
import FullscreenLoader from "@/app/(home)/_components/FullscreenLoader";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)


export const ConvexClientProvider = ({children}: {children: ReactNode}) => {
    return <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
            <Authenticated>
                {children}
            </Authenticated>
            <Unauthenticated>
                <div className='min-h-screen flex relative items-center justify-center w-full'>
                    <div className='absolute  left-10 top-[20%] '>
                        <SignIn routing='hash'/>
                    </div>

                    <Image src={DocsBg} className='w-[100%] h-[100%]' alt=""/>
                </div>
            </Unauthenticated>
            <AuthLoading>
                <FullscreenLoader label='Authenticating...'/>
            </AuthLoading>
        </ConvexProviderWithClerk>
    </ClerkProvider>
}