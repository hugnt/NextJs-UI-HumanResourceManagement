"use client";
import { HTMLAttributes } from 'react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn, handleErrorApi } from '@/lib/utils'
import Link from 'next/link'
import { useForm } from "react-hook-form";
import { Auth, authDefault, authSchema } from '@/data/schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import authApiRequest from '@/apis/auth.api';
import { usePathname, useRouter } from 'next/navigation'
interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }


const KEY = {
  KEY_LOGIN: "login"
}
const authPaths = ['/login-admin'];
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const pathname = usePathname();
  var layout = authPaths.includes(pathname) ? 1 : 0;
  const router = useRouter();
  const form = useForm<Auth>({
    resolver: zodResolver(authSchema),
    defaultValues: authDefault,
  });

  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationKey : [KEY.KEY_LOGIN],
    mutationFn: (body: Auth) => {
      return authApiRequest.adminLogin(body)
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        router.push('/');
      }
      handleErrorApi({ error: data.message })
    }
  })

  const { mutate: mutateLoginEmployee, isPending: isPendingLoginEmployee } = useMutation({
    mutationKey : [KEY.KEY_LOGIN],
    mutationFn: (body: Auth) => {
      return authApiRequest.employeeLogin(body)
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        router.push('/profile');
      }
      handleErrorApi({ error: data.message })
    }
  })

  function onSubmit(data: Auth) {
    if(layout == 1){
      mutateLogin(data)
    }else{
      mutateLoginEmployee(data)
    }
    
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link href='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'>
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isPendingLogin || isPendingLoginEmployee}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
