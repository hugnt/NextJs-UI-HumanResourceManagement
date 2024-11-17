import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CRUD_MODE } from '@/data/const';


type FormProps = {
    children: React.ReactNode,
    open: boolean,
    setOpen: (open:boolean) => void,
    size?: number,
    mode: CRUD_MODE,
    setIsBusy: (isBusy: boolean)=>void
}


export default function FormDialog(props: FormProps) {
    const {size,open, setOpen,mode ,setIsBusy=()=>{}, children } = props;
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen} modal={true} >
                <DialogContent className={`p-0 sm:min-w-[500px] sm:max-w-[${size}px] !sm:w-[${size}px] sm:rounded-[0.3rem]`}>
                    <DialogHeader className='flex justify-between align-middle p-2 bg-secondary/80'>
                        <DialogTitle>Details</DialogTitle>
                    </DialogHeader>
                    {children}
                    <DialogFooter>
                        <Button>Close</Button>
                        {(mode===CRUD_MODE.ADD ||mode===CRUD_MODE.EDIT)&& 
                        <Button onClick={()=>setIsBusy(true)}>Save</Button>}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
