import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {paginationOptsValidator} from "convex/server";



export const createDocument = mutation({
    args: {
        title: v.optional(v.string()),
        initialContent: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error('Unathorized entry')


        const organizationId = (user.organization_id ?? undefined) as | string | undefined




        return await ctx.db.insert('documents', {
            title: args.title ?? 'Untitled document',
            ownerId: user?.subject,
            organizationId,
            initialContent: args.initialContent
        })
    }
})

export const getDocuments = query({
    args: {
        paginationOpts:  paginationOptsValidator,
        search: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error('Unauthorized entry')

        console.log(user)
        const organizationId = user.organization_id ?? undefined

        // 1. Если есть search + организация — ищем по title + organizationId
        if (args.search && organizationId) {
            return await ctx.db
                .query('documents')
                .withSearchIndex('search_title', q =>
                    q.search('title', args.search).eq('organizationId', organizationId)
                )
                .paginate(args.paginationOpts)
        }

        // 2. Если есть только search — ищем по title + ownerId
        if (args.search) {
            return await ctx.db
                .query('documents')
                .withSearchIndex('search_title', q =>
                    q.search('title', args.search).eq('ownerId', user.subject)
                )
                .paginate(args.paginationOpts)
        }

        // 3. Если только организация — ищем все по организации
        if (organizationId) {
            return await ctx.db
                .query('documents')
                .withIndex('by_organization_id', q =>
                    q.eq('organizationId', organizationId)
                )
                .paginate(args.paginationOpts)
        }

        // 4. Фоллбэк — просто по ownerId
        return await ctx.db
            .query('documents')
            .withIndex('by_owner_id', q =>
                q.eq('ownerId', user.subject)
            )
            .paginate(args.paginationOpts)
    }

})

export const removeById = mutation({
    args: {id: v.id('documents')},
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error('Unathorized entry')



        const document = await ctx.db.get(args.id)
        if (!document) throw  new Error('Document not found')


        const isOwner = document.ownerId === user.subject


        if (!isOwner) throw  new Error('You are not the owner of this document')

        return await ctx.db.delete(document._id)
    }
})


export const updateById = mutation({
    args: {
        id: v.id('documents'),
        title: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error('Unatuhorized entry')

        const organizationId = (user.organization_id ?? undefined) as | string | undefined

        const document = await ctx.db.get(args.id)
        if (!document) throw  new Error('Document not found')



        const isOwner = document.ownerId === user.subject
        const isOrganizationMember = !!(document?.organizationId && document?.organizationId === organizationId)
        if (!isOwner && !isOrganizationMember) throw  new Error('You are not the owner of this document')

        return await ctx.db.patch(args.id, {title: args.title})
    }
})


export const getDocumentById = query({
    args: {
        id: v.id('documents')
    },
    handler: async (ctx, {id}) => {
        const document = await ctx.db.get(id)
        if (!document) {
            throw new Error('Document not found')
        }
        return document
    }

})

























