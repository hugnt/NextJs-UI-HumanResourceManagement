import { cn } from "@/lib/utils";

interface LoadingSpinIconProps{
  className?:string,
}

export default function LoadingSpinIcon(props: LoadingSpinIconProps) {
  const {className} = props;
  return (
    <div className={cn('lds-ring',className,`!border-0 !border-none me-2`)}>
      <div className={cn(className)}></div>
      <div className={cn(className)} ></div>
      <div className={cn(className)}></div>
      <div className={cn(className)}></div>
    </div>
  )
}
