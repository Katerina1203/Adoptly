import { NextResponse } from "next/server"
import { createUser } from "@/lib/actions"
import bcrypt from "bcryptjs"


export const POST = async (request: Request) => {
    const { username, email, password,phone } = await request.json()
    try {
        const hashedPass = await bcrypt.hash(password, 10)

        const newUser = {
            username,
            password: hashedPass,
            email,
            phone, 
        }
       
        await createUser(newUser)
    } catch (e) {
        console.error(e)    
        return new NextResponse("Unable to register user!", {
            status: 401,
        })
    }
    return new NextResponse("User was successfully created!", {
        status: 201,
    })
}

