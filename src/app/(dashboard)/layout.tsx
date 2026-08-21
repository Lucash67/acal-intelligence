import { AuthProvider } from "@/components/auth/auth-provider";
import { AppShell } from "@/components/layout/app-shell";
import { MockBanner } from "@/components/layout/mock-banner";
import { getRequestSession } from "@/lib/auth-request";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequestSession();

  return (
    <AuthProvider session={session}>
      <AppShell>
        <MockBanner preview={session.role === "preview"} />
        <main className="px-4 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </AppShell>
    </AuthProvider>
  );
}
