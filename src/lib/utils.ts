/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast"
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
        toast({
          title:'System Error',
          description: error[i]??"Undefined Error",
          variant:'destructive',
          duration: duration ?? 5000
        })
      }
    }
    else{
      toast({
        title:'Uncontroled Error',
        description: error??"Undefined Error",
        variant:'destructive',
        duration: duration ?? 5000
      })
    }
    throw new Error('API fetching error', error);
}
export const handleSuccessApi = ({message, duration}:{
  message: any,
  duration?:number
}) => {
    toast({
      title:'Successfully!',
      description: message??"Completed",
      variant:'success',
      duration: duration ?? 5000
    })
}
export function assertApiResponse<T>(data: any): T {
  console.log("http data:", data)
  if (typeof data.isSuccess !== 'boolean' || 
      (Array.isArray(data.message) === false && data.message !== null)) {
        throw new Error('Invalid API response structure');
  }
  else if(data.isSuccess == false){
      handleErrorApi({error:data.message});
      throw new Error('Some errors appear on server');
    }
  return data as T; 
}

