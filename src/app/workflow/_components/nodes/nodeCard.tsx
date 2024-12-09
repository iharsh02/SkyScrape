"use client";
import useFlowValidation from "@/components/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";

export const NodeCard = ({
  children,
  nodeId,
  isSelected,
}: {
  children: React.ReactNode;
  nodeId: string;
  isSelected: boolean;
}) => {
  const { getNode, setCenter } = useReactFlow();
  const { inValidInputs } = useFlowValidation();

  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;

        const { position, measured } = node;
        if (!position || !measured) return;

        const { width, height } = measured;

        const x = position.x + width! / 2;
        const y = position.y + height! / 2;

        setCenter(x, y, {
          zoom: 1,
          duration: 500,
        });
      }}
      className={cn(
        "rounded-md bg-background border-2 cursor-pointer border-separated w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-blue-500",
      )}
    >
      {children}
    </div>
  );
};

