import { TooltipProvider } from "@/components/ui/tooltip";
import TripHeader from "./trip-header";
import NotFoundWrapper from "./not-found-wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NotFoundWrapper>
      <div className="relative flex size-full flex-col justify-end">
        <TripHeader />
        <div className="w-full flex-1 overflow-auto p-4">
          <TooltipProvider delayDuration={0}>
            <div className="relative grow">{children}</div>
          </TooltipProvider>
        </div>
      </div>
    </NotFoundWrapper>
  );
}
