import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | TipHub",
  description: "Login to your TipHub account",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen max-w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            TipHub&apos;a Giriş Yap
          </h1>
          <p className="text-sm text-muted-foreground">
            Yazılım dünyasındaki ipuçlarını keşfetmek için giriş yapın
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Hesabınız yok mu? Kayıt olun
          </Link>
        </p>
      </div>
    </div>
  );
}
