"use client";

import React, { createContext, useContext, ReactNode } from "react";
import fallbackCmsData from "@/data/cms.json";

export type CmsDataType = typeof fallbackCmsData;

const CmsContext = createContext<CmsDataType>(fallbackCmsData);

export function CmsProvider({ 
  children, 
  initialData 
}: { 
  children: ReactNode;
  initialData: CmsDataType;
}) {
  return (
    <CmsContext.Provider value={initialData}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}
