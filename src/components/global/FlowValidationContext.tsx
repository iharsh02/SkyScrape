import { AppNodeMissingInputs } from "@/types/appNode";
import React, { Dispatch, SetStateAction, createContext, useState } from "react";

type FlowValidationContextType = {
  inValidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
}

export const FlowValidationContext = createContext<FlowValidationContextType | null>(null);


export function FlowValidationContextProvider({ children }: { children: React.ReactNode }) {
  const [inValidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>([]);
  
  const clearErrors = () => {
    setInvalidInputs([]);
  }
  return (
    <FlowValidationContext.Provider value={{
      inValidInputs,
      setInvalidInputs,
      clearErrors,
    }}>
      {children}
    </FlowValidationContext.Provider>
  );
}

