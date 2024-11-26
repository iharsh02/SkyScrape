import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen">
    <div className="flex flex-col flex-1 min-h-screen">
      <header className="
        flex 
        items-center
        justify-between
        px-6
        py-4
        h-[50px]
        container">
        SkyScrapper
      </header>
      <Separator>
        <div className="overflow-auto">
          <div className="flex-1 container py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </Separator>
    </div>
  </div>
}
