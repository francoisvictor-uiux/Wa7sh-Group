import { Shell } from "@/components/shell/Shell";
import { AuthGuard } from "@/components/auth/AuthGuard";

/**
 * (app) route group layout — wraps every authenticated module page.
 * AuthGuard redirects to /login if not authenticated.
 * Shell provides device-aware navigation chrome.
 */
export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Shell>{children}</Shell>
    </AuthGuard>
  );
}
