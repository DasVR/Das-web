import { pageMetadata } from "@/lib/site";
import { LoginContent } from "./LoginContent";

export const metadata = pageMetadata({
  title: "Client Sign In",
  description: "Sign in to the DasDev client portal.",
  path: "/dashboard/login",
  noIndex: true,
});

export default function LoginPage() {
  return <LoginContent />;
}
