import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import {currentUser, getAuth} from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY! });
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
    const { userId, sessionClaims } = getAuth(req);
    const user = await currentUser()
    if (!user?.id || !sessionClaims) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { room } = await req.json();

    const document = await convex.query(api.documents.getDocumentById, { id: room });

    const isOwner = document?.ownerId === user?.id;
    const isOrgMember = document?.organizationId === sessionClaims.org_id;

    if (!isOwner && !isOrgMember) {
        return new Response("Unauthorized", { status: 401 });
    }


    const name = sessionClaims.name ?? "Anonymous"
    const  nameToNumber = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    const hue = Math.abs(nameToNumber) % 360

    const color = `hsl(${hue}, 80%, 60%)`

    const session = liveblocks.prepareSession(user?.id, {
        userInfo: {
            name: name,
            avatar: sessionClaims.picture,
            color: color
        },
    });

    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();
    return new Response(body, { status });
}
