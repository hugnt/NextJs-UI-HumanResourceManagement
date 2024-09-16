import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react";
export interface PathItem {
  name: string,
  url?: string
};

export default function AppBreadcrumb({ pathList,className }: { pathList: Array<PathItem>,className?:string }) {
  return (
    <div className={className}>
      <Breadcrumb>
        <BreadcrumbList>
          {pathList && pathList.length > 0 && pathList.map((x, i) => {
            const isLastItem = i == pathList.length - 1;
            return(
            <Fragment key={i}>
              <BreadcrumbItem>
                {isLastItem &&<BreadcrumbPage>{x.name}</BreadcrumbPage>}
                {!isLastItem &&<BreadcrumbLink href={x.url}>{x.name}</BreadcrumbLink>}
              </BreadcrumbItem> 
              {!isLastItem &&<BreadcrumbSeparator/>}
            </Fragment>)
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>

  )
}
