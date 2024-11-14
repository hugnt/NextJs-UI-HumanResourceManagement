import React, { useState } from 'react'
import { FaPen } from "react-icons/fa";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import authApiRequest from '@/apis/auth.api';
import { useCurrentUser } from '@/app/system/ui/auth-context';
import { handleSuccessApi } from '@/lib/utils';
import { AccountUpdate } from '@/data/schema/auth.schema';
type Props = {
    userName: string,
    password: string,
    email: string
}
const QUERY_KEY = {
    KEY: 'profile',
    MUTATION_KEY: 'account-update'
}
export default function Account({ userName, password, email }: Props) {
    const [emailFE, setEmailFE] = useState<string>(email)
    const [passwordFE, setPasswordFE] = useState<string>(password)
    const [userNameFE, setUserNameFe] = useState<string>(userName)
    const user = useCurrentUser().currentUser
    const queryClient = useQueryClient()
    const onOpenChange = () => {
        setEmailFE(email)
        setUserNameFe(userName)
        setPasswordFE(password)
    }

    const { mutate, isPending } = useMutation({
        mutationKey: [QUERY_KEY.MUTATION_KEY],
        mutationFn: ({ id, accountUpdate }: { id: number; accountUpdate: AccountUpdate }) => {
            console.log(id, accountUpdate)
            return authApiRequest.updateAccount(id, accountUpdate)
        },
        onSuccess(data) {
            if (data.isSuccess) {
                handleSuccessApi({ message: "Account updated successfully" });
                queryClient.invalidateQueries({queryKey: [QUERY_KEY.KEY]})
            }
        },
    });
    return (
        <div className='rounded-xl border bg-card text-card-foreground shadow col-span-2'>
            <div className='flex flex-col space-y-1.5 p-6'>
                <div className='font-semibold leading-none tracking-tight'>
                    <div className='flex items-center justify-between'>
                        <p>Tài khoản</p>
                        <AlertDialog onOpenChange={onOpenChange}>
                            <AlertDialogTrigger asChild>
                                <FaPen className='text-center cursor-pointer transition-transform duration-200 hover:text-gray-400' />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Change account profile</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className='p-6 pt-0 pl-2'>
                                    <div className="grid max-w-sm items-center gap-1.5 ml-4">
                                        <Label htmlFor="email">Tên người dùng</Label>
                                        <Input onChange={(e) => setUserNameFe(e.target.value)} placeholder="Tên người dùng" value={userNameFE} />
                                    </div>
                                    <div className="grid max-w-sm items-center gap-1.5 ml-4 mt-2">
                                        <Label htmlFor="email">Mật khẩu</Label>
                                        <Input onChange={(e) => setPasswordFE(e.target.value)} placeholder="Password" value={passwordFE} />
                                    </div>
                                    <div className="grid max-w-sm items-center gap-1.5 ml-4 mt-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input onChange={(e) => setEmailFE(e.target.value)} placeholder="Email" value={emailFE} />
                                    </div>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => mutate({
                                        id: user!.id, accountUpdate: {
                                            userName: userNameFE,
                                            password: "phucdeptrai",
                                            email: emailFE
                                        }
                                    })}>Save</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
            <div className='p-6 pt-0 pl-2 ml-4'>
                <div className="grid w-full max-w-sm items-center gap-1.5 p-1">
                    <Label htmlFor="email">Tên người dùng</Label>
                    <Input disabled={true} placeholder="Email" value={userName} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 p-1">
                    <Label htmlFor="email">Mật khẩu</Label>
                    <Input disabled={true} placeholder="Password" value={password} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 p-1">
                    <Label htmlFor="email">Email</Label>
                    <Input disabled={true} placeholder="Email" value={email} />
                </div>
            </div>
        </div>
    )
}
