import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";


export const AIOutput= pgTable('aiOutput',{
    id:serial('id').primaryKey(),
    formData:varchar('formdata').notNull(),
    aiResponse:text('aiResponse'),
    templateSlug:varchar('templateSlug').notNull(),
    createdBy:varchar('createdBy').notNull(),
    createdAt:varchar('createdAt'),
})