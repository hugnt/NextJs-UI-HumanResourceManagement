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

