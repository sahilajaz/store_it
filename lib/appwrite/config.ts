export const appwriteConfig = {
    endpoinUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
    userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
    filesCollectioId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
    secretKey: process.env.NEXT_APPWRITE_KEY!,
}