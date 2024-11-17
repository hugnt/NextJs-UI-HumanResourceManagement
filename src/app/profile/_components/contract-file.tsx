import React from 'react'

type Props = {
    fileUrlBase?: string, 
    fileUrlSigned?: string
}
export default function ContractFile({fileUrlBase} : Props) {
    return (
        <div className='rounded-xl border bg-card text-card-foreground shadow col-span-4 ml-2'>
            <div className='flex flex-col space-y-1.5 p-6'>
                <div className='font-semibold leading-none tracking-tight'>{fileUrlBase != null ? "Hợp đồng chưa ký" : "Hợp đồng đã ký"}</div>
            </div>
            <div className='p-6 pt-0 pl-2'>
                <iframe width={"400"} height={"600"} className='w-full' src='https://localhost:7025/CV/638660030205729631.pdf'></iframe>
            </div>
        </div>
    )
}
