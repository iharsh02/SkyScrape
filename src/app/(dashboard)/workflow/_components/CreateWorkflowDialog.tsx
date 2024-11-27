import { CustomDialogHeader } from "@/components/global/CustomDialogHeader"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Layers2Icon } from "lucide-react"

export function CreateWorkflowDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-500 dark:text-white hover:bg-blue-400">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <CustomDialogHeader icon={Layers2Icon} title="Create workflow" subTitle="Start building your workflow" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

