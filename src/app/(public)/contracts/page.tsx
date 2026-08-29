import { redirect } from "next/navigation";

export default function ContractsRedirectPage() {
  redirect("/transparency?section=contracts");
}
