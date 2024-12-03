import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { ParamProps } from "@/types/appNode";
import { useEffect, useId, useState } from "react";
import { Textarea } from "@/components/ui/textarea";


export const StringParam = ({ param, value = "", updateNodeparamValue, disabled }: ParamProps) => {

  const [internalValue, setInternalValue] = useState(value);
  const id = useId();

  useEffect(() => { setInternalValue(value) }, [value])

  let Component: any = Input;
  if (param.varient === "textarea") {
    Component = Textarea
  }

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex"
      >{param.name}
        {param.required && <p className="text-red-400 px-2"></p>}</Label>
      <Component
        id={id}
        value={internalValue}
        placeholder="Enter the value"
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInternalValue(e.target.value)}
        onBlur={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateNodeparamValue(e.target.value)}
        className="text-xs"
        disabled={disabled}
      />
      {param.helperText && (<p
        className="text-muted-foreground px-2">
        {param.helperText}
      </p>)}
    </div>
  )
}

