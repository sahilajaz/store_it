'use server'

import { ID, Query } from "node-appwrite"
import { createAdminClient } from "../appwrite"
import { appwriteConfig } from "../appwrite/config"
import { parseStringfy } from "../utils"
import { cookies } from "next/headers"

const getUserByEmail = async (email : string) => {
    const {databases} = await createAdminClient()
    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('email' , [email])]
    )
    console.log(result)
    return result.total > 0 ? result.documents[0] : null
}

const handleError = (error : unknown , message:string) => {
    console.log(error , message)
    throw error
}

export const sendEmailOTP = async ({email} : {email : string}) => {
    const {account} = await createAdminClient()

    try {
        const session = await account.createEmailToken(ID.unique() , email)
        return  session.userId 
    } catch (error) {
        handleError(error , "Failed to send message")
    }
}

export const createAccount = async ({fullName , email}: {fullName: string , email:string}) => {
    const existingUser = await getUserByEmail(email)
    const accountId  = await sendEmailOTP({email})

    if(!accountId) throw new Error('failed to send an OTP')
    
   if(!existingUser) {
        const {databases} = await createAdminClient()
        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
             {
                fullName,
                email,
                avatar: "https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg",
                accountId
            }
        )
   }
   
   return parseStringfy({accountId})
}

export const  verifySecret = async ({accountId , password} : {accountId: string , password: string}) => {
    try {
        const {account} = await createAdminClient();
        const session = await account.createSession(accountId , password);
        (await cookies()).set('appwrite-session' , session.secret , {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        })
        return parseStringfy({sessionId: session.$id})   
    } catch (error) {
        handleError(error , 'Failed to verify OTP')
    }
}