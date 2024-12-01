import Logo from "@/components/global/Logo";
import { ModeToggle } from "@/components/global/ModeToggle";
import { Separator } from "@radix-ui/react-separator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-screen">
      {children}
      <Separator />
      <footer className=" flex items-center justify-between ">
        <Logo iconSize={16} fontSize="text-xl" />
        <ModeToggle />
      </footer>
    </div>
  )
}

