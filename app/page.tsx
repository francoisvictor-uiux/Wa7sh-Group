import { redirect } from "next/navigation";

export default function Home() {
  // Entry point — the user logs in, and the brand is resolved automatically
  // from their account (see AuthContext.applyBrandTheme).
  redirect("/login");
}
