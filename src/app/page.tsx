import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/login/LoginForm";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (session) {
    redirect("/home");
  }

  // 세션이 없으면 로그인 폼 렌더링
  return <LoginForm />;
}