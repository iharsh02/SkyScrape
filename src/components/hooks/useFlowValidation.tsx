import { useContext } from "react";
import { FlowValidationContext } from "../global/FlowValidationContext";

const useFlowValidation = () => {
  const context = useContext(FlowValidationContext);
  if (!context) {
    throw new Error("useFlowValidation must be within a FlowValidationContext")
  }

  return context;
}

export default useFlowValidation;
