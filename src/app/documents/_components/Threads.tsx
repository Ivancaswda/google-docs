"use client";

import { useThreads } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";

export function Threads() {
    const { threads } = useThreads();

    return (
        <div className='absolute right-10 w-[200px]'>
            {threads.map((thread) => (
                <Thread key={thread.id} thread={thread} />
            ))}
            <Composer />
        </div>
    );
}