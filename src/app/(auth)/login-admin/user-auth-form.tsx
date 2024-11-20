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
import { cn, handleErrorApi, handleSuccessApi } from '@/lib/utils'
import Link from 'next/link'
import { useForm } from "react-hook-form";
import { Auth, authDefault, authSchema } from '@/data/schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import authApiRequest from '@/apis/auth.api';
import { usePathname, useRouter } from 'next/navigation';
interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }


const KEY = {
  KEY_LOGIN: "login"
}
const authPaths = ['/login-admin'];
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const pathname = usePathname();
  const layout = authPaths.includes(pathname) ? 1 : 0;
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<Auth>({
    resolver: zodResolver(authSchema),
    defaultValues: authDefault,
  });

  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationKey: [KEY.KEY_LOGIN],
    mutationFn: (body: Auth) => {
      return authApiRequest.adminLogin(body)
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({queryKey:["current-user"]});
        handleSuccessApi({title:'Đăng nhập thành công', message:'Vui lòng chờ trong giây lát'})
        router.push('/dashboard');
      }
      else{
        handleErrorApi({ error: data.message })
      }
    }
  })

  const { mutate: mutateLoginEmployee, isPending: isPendingLoginEmployee } = useMutation({
    mutationKey: [KEY.KEY_LOGIN],
    mutationFn: (body: Auth) => {
      return authApiRequest.employeeLogin(body)
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({queryKey:["current-user"]});
        handleSuccessApi({title:'Đăng nhập thành công', message:'Vui lòng chờ trong giây lát'})
        router.push('/profile');
      }
      else{
        handleErrorApi({ error: data.message })
      }
      
    }
  })

  function onSubmit(data: Auth) {
    if (layout == 1) {
      mutateLogin(data)
    } else {
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
            <Button type='submit' className='mt-2' loading={isPendingLogin || isPendingLoginEmployee}>
              Login
            </Button>
            <Button type='button' className='bg-gray-400'>
              {layout == 0 ?
                <Link href="/login-admin">
                  Đăng nhập quản trị viên
                </Link> :
                <Link href="/login-employee">
                  Đăng nhập nhân viên
                </Link>
              }

            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
