import { Loader2Icon } from "lucide-react";

function loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2Icon size={30} className="animate-spin stroke-primary" />
    </div>
  )
}

export default loading;

