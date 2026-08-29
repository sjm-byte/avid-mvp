import { redirect } from "next/navigation";

export default function RiskDisclosureRedirectPage() {
  redirect("/transparency?section=methodology");
}
