"use client"
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GrCircleQuestion } from "react-icons/gr";
import { useMutation } from "@tanstack/react-query";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaPenAlt } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { FaCheck } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import { CiEraser } from "react-icons/ci";
import Image from "next/image";
import { DigitalSig, digitalSigDefault, digitalSigSchema } from "@/data/schema/digitalSignature.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { dataURLtoFile, handleSuccessApi } from "@/lib/utils";
import contractApiRequest from "@/apis/contract.api";
import LoadingSpinIcon from "@/components/loading-spin-icon";
import envConfig from "@/config";

type ContractSigProps = {
    contractId: number,
    name: string,
    fileUrlBase?: string,
    fileUrlSigned?: string,
    employeeSignStatus?:number
}
export default function SignContract(props: ContractSigProps) {
    
    const {contractId, name="", fileUrlBase, fileUrlSigned, employeeSignStatus = 0} = props;
    const [contractList, setContractList] = useState<ContractSigProps[]>([]);
    const [openFormPDF, setOpenFormPDF] = useState<boolean>(false);
    const [tabTypeSign, setTabTypeSign] = useState<string>("image");
    const sigPadRef = useRef<SignatureCanvas>(null);
    const [sigImage, setSigImage] = useState<string | undefined>(undefined);
    const [certificate, setCertificate] = useState<File>();
    const [sigImageFile, setSigImageFile] = useState<File>();
    const [signMode, setSignMode] = useState<number>(2);
    const [sigColor, setSigColor] = useState<string>("black");

    const signContractMutation = useMutation({
        mutationFn: ({ id, body }: { id: number, body: FormData }) => contractApiRequest.signContract(id, body),
        onSuccess: () => {
            setOpenFormPDF(false);
            handleSuccessApi({ message: "Signed Successfully!" });
        }
    });


    const handleOpenFormPDF = (mode: number) => {
        setSignMode(mode);
        setOpenFormPDF(true);
    }
    const onTabChange = (value: string) => {
        console.log(value);
        setTabTypeSign(value);

    }
    const handleChangeSigImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSigImage(URL.createObjectURL(files[0]));
            setSigImageFile(files[0])
        }
    };
    const handleChangeCerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setCertificate(files[0]);
        } else {
            setCertificate(undefined);
        }
    };
    const handleClearSignature = () => {
        sigPadRef.current?.clear();
    };


    const form = useForm<DigitalSig>({
        resolver: zodResolver(digitalSigSchema),
        defaultValues: digitalSigDefault,
    });

    const handleSubmitData = () => {
        const data = form.getValues();
        const formData = new FormData();
        console.log("data:", data)

        if (tabTypeSign == "image") {
            if (sigImageFile) formData.append('SignatureImageFile', sigImageFile);
        }
        else if (tabTypeSign == "hand") {
            if (!sigPadRef.current?.isEmpty()) {
                const canvas = sigPadRef.current?.getTrimmedCanvas().toDataURL("image/png");
                if (canvas) {
                    const file = dataURLtoFile(canvas, "user_sign.png")
                    formData.append('SignatureImageFile', file);
                }
            }
        }

        // Append files and other fields to FormData
        if (certificate) formData.append('CertificateFile', certificate);
        //if (sigImageSignFile) formData.append('SignatureImageFile', sigImageSignFile);
        formData.append('Reason', data.reason ?? "");
        formData.append('Location', "Hà nội");
        formData.append('Password', data.password ?? "");
        console.log("form-data", formData);
        signContractMutation.mutate({ id: contractId, body: formData });

    }

    useEffect(()=>{
        const newList:ContractSigProps[] = [];
        newList.push(props)
        setContractList(newList);
    },[contractId])
    return (
        <div>
            <Table className="border-collapse border">
                <TableCaption>Danh sách hợp đồng</TableCaption>
                <TableHeader className="bg-gray-200">
                    <TableRow>
                        <TableHead className="w-[180px]">Mã hợp đồng</TableHead>
                        <TableHead>Tên nhân viên</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contractList.map((x, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">{"HD-" + String(x.contractId).padStart(4, '0')}</TableCell>
                            <TableCell>{x.name}</TableCell>
                            <TableCell>
                                <Badge className={`py-0 px-2 ${x.employeeSignStatus==2 ? "bg-green-500" : "bg-slate-500"}`}>{x.employeeSignStatus==2 ? "Chưa kí" : "Đã kí"}</Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                                {employeeSignStatus==2&&<Button size={"sm"} className="" onClick={() => handleOpenFormPDF(1)}>
                                    <FaPenAlt size={14} className="me-2" />Kí
                                </Button>}
                                <Button size={"sm"} className="bg-slate-500" onClick={() => handleOpenFormPDF(2)}>
                                    <MdOutlineRemoveRedEye size={14} className="me-2" />Xem
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AlertDialog open={openFormPDF} onOpenChange={setOpenFormPDF}>
                <AlertDialogContent className={`gap-0 border-none overflow-hidden p-0 sm:min-w-[500px] sm:max-w-[1000px] !sm:w-[1000px] sm:rounded-[0.3rem]`}>
                    <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
                        <AlertDialogTitle className="text-slate-50">Sample Details</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription />
                    <Form {...form}>
                        {signMode == 1 ? <div className="flex w-full">
                            <iframe src={`${envConfig.NEXT_PUBLIC_API_HOST}/Contract/${fileUrlBase}`} className="w-[65%] h-[600px]"></iframe>
                            <div className="w-[35%]">
                                <div className="flex space-x-2 p-3 pe-0 border-b-2">
                                    <span className=" font-semibold text-lg">Thông tin chữ kí số</span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger >
                                            <GrCircleQuestion size={16} className="me-1 hover:text-primary hover:scale-110" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[530px]">
                                            <DropdownMenuLabel>Quy trình thực hiện kí số</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <div className="flex space-x-1">
                                                    <span className="font-medium whitespace-nowrap">B1: Upload chứng thư số (bắt buộc): </span>
                                                    <span className="">file chứng chỉ có định dạng
                                                        <span className="font-medium"> &quot;.pfx&quot;</span>
                                                    </span>
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <div className="flex space-x-1">
                                                    <span className="font-medium whitespace-nowrap">B2: Nhập lý do kí (tùy chọn) : </span>
                                                    <span className="">Có thể bỏ trống </span>
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <div className="flex space-x-1">
                                                    <span className="font-medium whitespace-nowrap">B3: Chọn ảnh chữ kí (tùy chọn): </span>
                                                    <span className="">Upload ảnh chữ kí hoặc kí tya trực tiếp trên pad</span>
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <div className="flex space-x-1">
                                                    <span className="font-medium whitespace-nowrap">B4: Nhập mã pin (bắt buộc): </span>
                                                    <span className="">Nhập mã khóa bí mật để thực hiện kí số trên file pdf</span>
                                                </div>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="px-3 py-2 space-y-2">
                                    <div>
                                        <Label htmlFor="cer">Chứng thư số (*)</Label>
                                        <Input id="cer" className="mt-1 w-full" type="file" accept=".pfx" onChange={handleChangeCerFile} />
                                    </div>
                                    <FormField control={form.control} name="reason" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lý do kí</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Lý do kí"  {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div>
                                        <Label htmlFor="locate">Hình ảnh chữ kí</Label>
                                        <Tabs defaultValue="image" value={tabTypeSign} onValueChange={onTabChange} className="border rounded-sm">
                                            <TabsList className="w-full justify-start">
                                                <TabsTrigger value="image">Hình ảnh</TabsTrigger>
                                                <TabsTrigger value="hand">Kí tay</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="image" className="p-2 py-1 h-[240px]">
                                                <Input id="cer" className="mt-1 w-full" type="file" onChange={handleChangeSigImage} />
                                                {sigImage &&
                                                    <div className="my-2 overflow-hidden w-[300px] h-[180px]">
                                                        <Image className="m-auto object-contain w-full h-full" src={sigImage} width={300} height={100} alt="Uploaded preview" />
                                                    </div>}
                                            </TabsContent>
                                            <TabsContent value="hand" className="p-2 py-1 ">
                                                <SignaturePad penColor={sigColor} canvasProps={{ className: 'sigCanvas h-[240px]' }} ref={sigPadRef} />
                                                <div className="flex items-center justify-between">
                                                    <div className="space-x-1">
                                                        <Button className="rounded-full bg-blue-500 w-6 h-6 p-0" onClick={() => setSigColor("#3b82f6")} />
                                                        <Button className="rounded-full bg-black w-6 h-6 p-0 hover:bg-slate-400" onClick={() => setSigColor("#000000")} />
                                                    </div>
                                                    <Button className="" size='sm' onClick={handleClearSignature}><CiEraser size={16} /></Button>
                                                </div>

                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                </div>

                            </div>
                        </div> :
                            <div className="flex w-full">
                                <iframe src={`${envConfig.NEXT_PUBLIC_API_HOST}/Contract/${fileUrlSigned}`} className="w-[100%] h-[600px]"></iframe>
                            </div>}
                        <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                            <Button onClick={() => setOpenFormPDF(false)} type="button" className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                            {signMode == 1 && <Dialog>
                                <DialogTrigger>
                                    <Button type="button" size='sm'>
                                        <FaCheck size={14} className="me-2" />Xác nhận kí
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Nhập mã pin của chứng thư</DialogTitle>
                                        <DialogDescription>
                                            Mã pin là khóa bí mật dùng để xác thực chứng thư số
                                        </DialogDescription>
                                        <FormField control={form.control} name="password" render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="password" placeholder="Nhập mã pin" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button type="button" disabled={signContractMutation.isPending || signContractMutation.isPending} onClick={handleSubmitData}>
                                            {(signContractMutation.isPending || signContractMutation.isPending)
                                                && <LoadingSpinIcon className="w-[22px] h-[22px] !border-[4px] !border-t-white " />}
                                            Xác nhận</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>}

                        </AlertDialogFooter>
                    </Form>
                </AlertDialogContent>
            </AlertDialog>


        </div>
    )
}
