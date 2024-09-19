import { JSX } from "react";
import { Id, toast, ToastOptions } from "react-toastify";

export const Msg = ({ title, message }:{title?:string, message?: string}) => {
  return (
    <div className="msg-container ms-2">
      {title&&<p className="msg-title font-semibold">{title}</p>}
      {message&&<p className="msg-description">{message}</p>}
    </div>
  );
};
export const toaster = (myProps: JSX.IntrinsicAttributes & { title?: string; message?: string; }, toastProps: ToastOptions<unknown> | undefined): Id =>
  toast(<Msg {...myProps} />, { ...toastProps });

toaster.success = (myProps: JSX.IntrinsicAttributes & { title?: string; message?: string; }, toastProps: ToastOptions<unknown> | undefined): Id =>
  toast.success(<Msg {...myProps} />, { ...toastProps });

toaster.error = (myProps: JSX.IntrinsicAttributes & { title?: string; message?: string; }, toastProps: ToastOptions<unknown> | undefined): Id =>
  toast.error(<Msg {...myProps} />, { ...toastProps });