/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  RecruitmentWeb,
  recruitmentWebDefault,
  recruitmentWebSchema,
} from "@/data/schema/recruitmentWeb.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import webApiRequest from "@/apis/web.api";
import { handleSuccessApi } from "@/lib/utils";
import jobPostingApiRequest from "@/apis/jobPosting.api";
import { SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import recruitmentWebApiRequest from "@/apis/recruitmentWeb.apis";
type FormPost = {
  openPost: boolean;
  setOpenPost: (openPost: boolean) => void;
  size?: number;
  detail: RecruitmentWeb;
};

//react query key
const QUERY_KEY = {
  keyList: "recruitmentWebs",
  keyadd: "recruitmentWebsadd",
  keySub: "webs",
  keySub2: "jobPostings",
};

export default function FormPost(props: FormPost) {
  const {
    openPost = false,
    setOpenPost = () => {},
    size = 600,
    detail = {},
  } = props;

  // #region +TANSTACK QUERY
  const queryClient = useQueryClient();
  const addDataMutation = useMutation({
    mutationFn: (body: RecruitmentWeb) => recruitmentWebApiRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] });
      handleSuccessApi({ message: "Inserted Successfully!" });
      setOpenPost(false);
    },
  });

  const listDataWeb = useQuery({
    queryKey: [QUERY_KEY.keySub],
    queryFn: () => webApiRequest.getList(),
  });
  const listDataJobPosting = useQuery({
    queryKey: [QUERY_KEY.keySub2],
    queryFn: () => jobPostingApiRequest.getList(),
  });
  // #endregion

  // #region + FORM SETTINGS
  const form = useForm<RecruitmentWeb>({
    resolver: zodResolver(recruitmentWebSchema),
    defaultValues: recruitmentWebDefault,
  });

  const onSubmit = (data: RecruitmentWeb) => {
    addDataMutation.mutate(data);
    console.log(data);
  };

  const handleCloseForm = (e: any) => {
    e.preventDefault();
    setOpenPost(false);
  };
  // #endregion

  useEffect(() => {
    if (Object.keys(detail).length > 0) {
      form.reset(detail);
    }
  }, [detail, openPost]);

  return (
    <div>
      <AlertDialog open={openPost} onOpenChange={setOpenPost}>
        <AlertDialogContent
          className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] sm:max-w-[${size}px] !sm:w-[${size}px] sm:rounded-[0.3rem]`}
        >
          <AlertDialogHeader className="flex justify-between align-middle p-2 py-1 bg-primary">
            <AlertDialogTitle className="text-slate-50">
              Trang đăng bài
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              <div className="p-2 text-sm space-y-3">
                <FormField
                  control={form.control}
                  name="webId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chọn Web</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn web" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {listDataWeb.data?.metadata?.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                value={item.id?.toString() ?? "0"}
                              >
                                {item.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobPostingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chọn bài đăng</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn bài đăng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {listDataJobPosting.data?.metadata?.map(
                            (item, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  value={item.id?.toString() ?? "0"}
                                >
                                  {item.experienceRequired}
                                </SelectItem>
                              );
                            }
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                <Button
                  onClick={handleCloseForm}
                  className="bg-gray-400  hover:bg-red-500"
                  size="sm"
                >
                  Close
                </Button>
                <Button type="submit" size="sm">
                  Save
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
