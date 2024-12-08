import { FlowToExecutionPlan, FlowToExecutionPlanValidationErrors } from "@/lib/workflow/ExecutionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidation from "./useFlowValidation";
import { toast } from "sonner";

const useExecutionPlan = () => {

  const { toObject } = useReactFlow();
  const {  clearErrors } = useFlowValidation();
  const handleError = useCallback((error: any) => {
    switch (error.type) {
      case FlowToExecutionPlanValidationErrors.NO_ENTRY_POINT:
        toast.error("No entry points found");
        break;

      case FlowToExecutionPlanValidationErrors.INVALID_INPUTS:
        toast.error("Not all inputs value are set");
        break;
      default:
        toast.error("Somthing went wrong");
        break;
    }
  }, [])
  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(nodes as AppNode[], edges);
    if (error) {
      handleError(error);
      return null;
    }

    clearErrors();
    return executionPlan;

  }, [toObject, handleError, clearErrors]);
  return generateExecutionPlan;
};

export default useExecutionPlan;
