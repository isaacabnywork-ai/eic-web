import { LayoutShell } from "@/components/layout-shell";
import { GlobalBanner } from "@/components/global-banner";
import { BannerWrapper } from "@/components/banner-wrapper";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutShell>
      <BannerWrapper>
        <GlobalBanner />
      </BannerWrapper>
      {children}
    </LayoutShell>
  );
}
