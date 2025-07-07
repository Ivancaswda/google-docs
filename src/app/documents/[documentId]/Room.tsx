"use client";

import {ReactNode, useEffect, useState} from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import {useParams} from "next/navigation";
import FullscreenLoader from "@/app/(home)/_components/FullscreenLoader";

import {toast} from "sonner";

type User = {
    id: string,
    name: string,
    avatar: string,
    color: string
}

export function Room({ children }: { children: ReactNode }) {

    const params = useParams()

    const [users, setUsers] = useState<User>([])

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch('/api/users');
                if (!res.ok) throw new Error('Failed to fetch users');
                const data = await res.json();
                setUsers(data);
            } catch {
                toast('Не удалось найти пользователей');
            }
        }

        fetchUsers();
    }, []);

    return (
        <LiveblocksProvider authEndpoint='/api/liveblocks-auth'
                            throttle={16}
                            resolveUsers={({userIds}) => {
                                return userIds.map((userId) => users.find((user) => user.id === userId) ?? undefined)
                            }}
                            resolveMentionSuggestions={({text}) => {
                                let filteredUsers = users;
                                if (text) {
                                    filteredUsers = users.filter((user) = user.name.toLowerCase().includes(text.toLowerCase()))
                                }
                                return filteredUsers.map((user) => user.id)
                            }}
                            resolveRoomsInfo={() => {

                            }}
        >
            <RoomProvider initialStorage={{leftMargin: 56, rightMargin: 56}} id={params.documentId as string}>
                <ClientSideSuspense fallback={<div><FullscreenLoader label='Room loading...'/></div>}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}