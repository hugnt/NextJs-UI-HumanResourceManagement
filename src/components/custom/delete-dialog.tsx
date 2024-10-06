import React, { ReactNode } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
type Props = {
    title: string,
    description: string,
    cancelTitle: string,
    actionTitle: string,
    data?: any,
    onAction: (data?: any) => void,
}
export default function DeleteDialog({title, description, cancelTitle, actionTitle, data, onAction }: Props) {
    return (
        <AlertDialog>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelTitle}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onAction(data)}>{actionTitle}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
