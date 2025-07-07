import {auth, clerkClient} from "@clerk/nextjs/server";

export async function getUsers() {
    const { sessionClaims } = await auth();

    if (!sessionClaims?.org_id) {
        console.error('❌ Missing org_id in sessionClaims');
        throw new Error('No org_id found');
    }

    const response = await clerkClient.users.getUserList({
        organizationId: [sessionClaims.org_id as string],
    });

    return response.data.map((user) => ({
        id: user.id,
        name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Anonymous',
        avatar: user.imageUrl,
    }));
}
