'use client';


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation";
import React from "react";

export function BredCrumbHeader() {

  const pathname = usePathname();
  const paths = pathname === "/" ? [""] : pathname?.split('/');

  return (<div className="flex items-center flex-start">
    <Breadcrumb >
      <BreadcrumbList>{paths.map((path , index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            <BreadcrumbLink className="capitalize" href={`
              /${path}`
            }>
              {path === "" ? "home" : path}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </React.Fragment>
      ))}</BreadcrumbList>
    </Breadcrumb>
  </div>
  )
}
