import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const VerveLogo = ({ className }: { className?: string }) => (
  <div className={cn("relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center", className)}>
    <Image 
      src="/main-logo.png" 
      alt="Verve Ledger Logo" 
      width={48} 
      height={48} 
      className="object-contain"
      unoptimized
    />
  </div>
);

export function BrandLogo({ showSubtext = true, className }: { showSubtext?: boolean, className?: string }) {
  return (
    <Link className={cn("flex items-center gap-2 md:gap-3 group", className)} href="/">
      <VerveLogo className="group-hover:scale-110 transition-transform shrink-0" />
      <div className="flex flex-col leading-none">
        <span className="text-base md:text-xl font-black tracking-tighter text-[#002E25] uppercase font-outfit">Verve Ledger</span>
        {showSubtext && (
          <span className="text-[7px] md:text-[9px] font-black text-[#10B981] tracking-[0.2em] md:tracking-[0.3em] uppercase mt-0.5 md:mt-1">
            Nova Technologies
          </span>
        )}
      </div>
    </Link>
  );
}
