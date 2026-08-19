import { AppShell } from "@/components/layout/app-shell";
import { MockBanner } from "@/components/layout/mock-banner";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <MockBanner />
      <main className="px-4 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-[1200px]">{children}</div>
      </main>
    </AppShell>
  );
}
