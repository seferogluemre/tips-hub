"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { authService, LoginParams } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Login form şeması
const loginSchema = z.object({
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz",
  }),
  password: z.string().min(6, {
    message: "Şifre en az 6 karakter olmalıdır",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Form setup
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginParams) => authService.login(data),
    onSuccess: (response) => {
      setIsSubmitting(false);
      setLoginError(null);

      // Başarılı giriş bildirimi
      toast({
        title: "Giriş Başarılı",
        description: "Başarıyla giriş yaptınız, yönlendiriliyorsunuz...",
        variant: "success",
      });

      // Dashboard'a yönlendir
      router.push("/dashboard");
    },
    onError: (error: any) => {
      setIsSubmitting(false);

      let errorMessage =
        "Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.";

      // API'den gelen hata mesajını kullan
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setLoginError(errorMessage);

      toast({
        title: "Giriş Başarısız",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginError(null);

    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Giriş Yap
            </CardTitle>
            <CardDescription className="text-center">
              İpuçları platformuna giriş yaparak ipuçlarınızı paylaşın
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loginError && (
              <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6 border border-destructive/30">
                <p className="text-sm">{loginError}</p>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta</FormLabel>
                      <FormControl>
                        <Input placeholder="ornek@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şifre</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm">
              <p>
                Hesabınız yok mu?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => router.push("/register")}
                >
                  Kayıt Ol
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
