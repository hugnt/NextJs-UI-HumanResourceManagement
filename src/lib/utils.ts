/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { toaster } from "@/components/custom/_toast"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({error, duration}:{
  error: any,
  duration?:number
}) => {
    if(Array.isArray(error)){
      for (let i = 0; i < error.length; i++) {
        toaster.error({
          title:'System Error',
          message: error[i]??"Undefined Error",
        },{
          position:"bottom-right",
          autoClose: duration ?? 2000
        })
      }
    }
    else{
      toaster.error({
        title:'Uncontroled Error',
        message: error??"Undefined Error",
      },{
        position:"bottom-right",
        autoClose: duration ?? 2000
      })
    }
    throw new Error('API fetching error', error);
}
export const handleSuccessApi = ({title,message,duration}:{
  title?: string,
  message?: string,
  duration?:number
}) => {
    toaster.success({
      title: title??"Process Completed",
      message: message??"Process Completed"
    },{
      position:"bottom-right",
      autoClose: duration ?? 2000
    })
}
export function assertApiResponse<T>(data: any): T {
  console.log("http data:", data)
  if (typeof data.isSuccess !== 'boolean' || 
      (Array.isArray(data.message) === false && data.message !== null)) {
        throw new Error('Invalid API response structure');
  }
  else if(data.isSuccess == false){
      //handleErrorApi({error:data.message});
      //console.log(data.message)
      throw new Array(data.message);
  }
  return data as T; 
}


export const formatCurrency = (value?: number) => {
  if(!value) return 0;
  const formattedValue = new Intl.NumberFormat('it-IT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  return formattedValue;
};


export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};