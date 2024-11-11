import { Card } from '@/components/ui/card'
import { UserAuthForm } from './user-auth-form'
import Image from 'next/image'

export default function SignIn() {
  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <Image src={'/images/logo-clip.jpg'} alt='logo' width={200} height={60}/>
          </div>
          <Card className='p-6'>
            <div className='flex flex-col space-y-2 text-left mb-5'>
              <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
            </div>
            <UserAuthForm />
            <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
              By clicking login, you agree to our{' '}
              <a href='/terms' className='underline underline-offset-4 hover:text-primary'>
                Terms of Service</a>{' '}and{' '}
              <a href='/privacy' className='underline underline-offset-4 hover:text-primary'>
                Privacy Policy
              </a>.
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
