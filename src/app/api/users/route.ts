import { NextResponse } from "next/server";
import { getUsers } from "@/app/documents/[documentId]/actions";

export async function GET() {
    try {
        const users = await getUsers();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}
