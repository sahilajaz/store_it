"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createAccount } from "@/lib/actions/user.action"
import OtpModel from "./OtpModel"


type FormType = 'sign-in' | 'sign-up'

const authFormScheme = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName: formType === 'sign-up' ? z.string().min(2).max(50) : z.string().optional()
  })
}

const AuthForm = ({type}: {type: FormType}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const[errorMessaage , setErrorMessage] = useState<string>("")
  const [accountId , setAccountId] = useState('')

   
  const formSchema = authFormScheme(type)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          fullName: "",
          email: ""
        },
      })
     
      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          setIsLoading(true)
          setErrorMessage('')
          const user = await createAccount({
            fullName: values.fullName || '',
            email: values.email
          })
          setAccountId(user.accountId)
        } catch (error) {
          setErrorMessage("Failed to create an account. Please try again.")
        } finally {
          setIsLoading(false)
        }
      }
      

  return (
    <>
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
      <h1 className="form-title">
        {type === "sign-in" ? "Sign In" : "Sign Up"}
      </h1>
      {type === "sign-up" && (
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
             <div className="shad-form-item">
             <FormLabel className="shad-form-label">Full Name</FormLabel>
             <FormControl>
                <Input placeholder="Enter your full name" className="shad-input" {...field} />
              </FormControl>
             </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />      
      )}
      <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
             <div className="shad-form-item">
             <FormLabel className="shad-form-label">Email</FormLabel>
             <FormControl>
                <Input placeholder="Enter your full email" className="shad-input" {...field} />
              </FormControl>
             </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
      <Button type="submit" className="form-submit-button" disabled={isLoading}>
        {type === 'sign-in' ? 'Sign In' : 'Sign Up' }
        {isLoading && (
            <Image 
            src="/assets/icons/loader.svg"
             alt="loader"
             width={24}
             height={24}
             className="ml-2 animate-spin"
            />
        )}
      </Button>
      {errorMessaage && (<p className="error-message">*{errorMessaage}</p> )}
       <div className="body-2 flex justify-center">
         <p className="text-light-100">
          {
           type === 'sign-in' ? "Don't have an account?" : "Already have an account"
          }
         </p>
         <Link href={type === 'sign-in' ? "/sign-up" : "/sign-in" }
         className="ml-1 font-medium text-brand"
         >
          {type === 'sign-in' ? 'Sign up' : "Sign in"}
         </Link>
       </div>
    </form>
  </Form>
   {accountId && <OtpModel email={form.getValues("email")} accountId={accountId}/>}
</>

  )
}

export default AuthForm