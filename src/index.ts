import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'
import argon2 from '@node-rs/argon2'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { showRoutes } from 'hono/dev'

import { type Users } from './models/user.js'

const prisma = new PrismaClient()

const app = new Hono()

// ต้อง pnpm apprive-builds ก่อน

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

app.get('/users', async (c) => {
    const users = await prisma.user.findMany()
    if (!users) {
        throw new HTTPException(404, { message: 'Users not found' })
    }
    return c.json({ data: users })
})


app.post('/addUser', zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
        return c.json({
            status: 'error',
            code: 'VALIDATION_ERROR',
            details: result.error.flatten().fieldErrors
        })
    }
}), async (c) => {
    const data = c.req.valid('json')
    data.password = await argon2.hash(data.password)
    await prisma.user.create({ data })
    return c.json({ message: "put record success" })
})

app.put('/updateUser/:userId', zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
        return c.json({
            status: 'error',
            code: 'VALIDATION_ERROR',
            details: result.error.flatten().fieldErrors
        })
    }
}), async (c) => {
    const userData = c.req.valid('json')
    const userId = parseInt(c.req.param('userId'))
    userData.password = await bcrypt.hash(userData.email,10)
    const userExist = await prisma.user.findUnique({where:{id:userId}})
    if(!userExist){
        throw new HTTPException(404,{message:'id not found'})
    }
    await prisma.user.update({ where: { id: userId }, data: { email: userData.email, password:userData.password} })
    return c.json({ message:"update email successful" })

})


app.patch('/updateEmail/:userId', zValidator('json', z.object({ email: z.string() }), (result, c) => {
    if (!result.success) {
        return c.json({
            status: 'error',
            code: 'VALIDATION_ERROR',
            details: result.error.flatten().fieldErrors
        })
    }
}), async (c) => {
    const userId = parseInt(c.req.param('userId'))
    const userData = c.req.valid('json')
    const userExist = await prisma.user.findUnique({where:{id:userId}})
    if(!userExist){
        throw new HTTPException(404,{message:'id not found'})
    }
    await prisma.user.update({where:{id: userId},data:{email:userData.email}})
    return c.json({message:"update email successful"})
}
)

app.delete('/delete/:userId', zValidator('param', z.object({ id: z.number() }), (result, c) => {
    if (!result.success) {
        return c.json({
            status: 'error',
            code: 'VALIDATION_ERROR',
            details: result.error.flatten().fieldErrors
        })
    }
}), async (c) => {
    const data = c.req.valid('param')
    if(!data){
        throw new HTTPException(404,{message:'id not found'})
    }
    await prisma.user.delete({where:{id: +data}})
    return c.json({message:"delete user successful"})
}
)


app.onError((err,c) =>{
    if(err instanceof HTTPException){
        return c.json({message:err.message})
    }
    return c.json({message:"internal server error"})
})


const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port
})