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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { CreateTipFormValues, createTipSchema } from "@/schemas/tip.schema";
import { useTipFilterStore } from "@/store/tip-filter.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateTipPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Giriş yapmamış kullanıcıları login sayfasına yönlendir
  useAuthRedirect({ redirectUnauthenticatedTo: "/login" });

  const { resetFilters } = useTipFilterStore();

  const form = useForm<CreateTipFormValues>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  });

  // Prisma hatalarında anlamlı mesajlar oluşturma
  const formatPrismaError = (errorText: string): string => {
    if (errorText.includes("Argument `author` is missing")) {
      return "Oturum bilgileriniz bulunamadı. Lütfen tekrar giriş yapın.";
    }

    if (errorText.includes("authorId: undefined")) {
      return "Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın veya oturumunuzu yenileyin.";
    }

    return "İpucu oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
  };

  // Form submission handler
  const onSubmit = async (data: CreateTipFormValues) => {
    setIsSubmitting(true);
    setFormError(null);

    // Get userId from localStorage
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("auth_token");

    if (!userId) {
      setFormError(
        "Oturum bilgileriniz bulunamadı. Lütfen tekrar giriş yapın."
      );
      setIsSubmitting(false);

      toast({
        title: "Hata",
        description:
          "Kullanıcı bilgileriniz bulunamadı. Lütfen tekrar giriş yapın.",
        variant: "destructive",
      });

      return;
    }

    // Convert comma-separated tags to array
    const tagsArray = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    try {
      // Doğrudan fetch kullanarak isteği gönderelim
      const payload = {
        title: data.title,
        content: data.content,
        tags: tagsArray,
        authorId: userId,
      };

      console.log("Sending payload:", payload);
      console.log("Token:", token ? "Mevcut" : "Yok");

      // Önce API'den kullanıcı ID'sini alalım
      let userIdFromApi;
      try {
        const userResponse = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const userData = await userResponse.json();
        console.log("User data from API:", userData);

        if (userData && userData.id) {
          userIdFromApi = userData.id;
          console.log("Using user ID from API:", userIdFromApi);
        }
      } catch (userError) {
        console.error("Could not get user data:", userError);
      }

      // API'den alınan userId ile payload'ı güncelleyelim
      if (userIdFromApi) {
        payload.authorId = userIdFromApi;
      }

      const response = await fetch("http://localhost:3000/api/tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      // Ham yanıtı inceleyelim
      const responseText = await response.text();
      console.log("Raw API Response:", responseText);

      let result;
      try {
        // Text'i JSON'a çevirelim
        result = JSON.parse(responseText);
        console.log("Parsed API Response:", result);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        result = {
          message: "API yanıtı işlenemedi",
          errors: [{ message: responseText }],
        };
      }

      if (!response.ok) {
        throw { response: { data: result } };
      }

      setIsSubmitting(false);
      setFormError(null);

      toast({
        title: "Başarılı!",
        description: "İpucunuz başarıyla oluşturuldu.",
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["tips"] });
      resetFilters();
      router.push("/dashboard");
    } catch (error: any) {
      setIsSubmitting(false);

      // Daha detaylı hata logu
      console.error("Tip creation error details:", {
        error,
        errorType: typeof error,
        hasResponse: !!error.response,
        responseData: error.response?.data,
        originalMessage: error.message,
        stack: error.stack,
      });

      // API'den gelen hata mesajlarını işle
      if (error.response?.data?.errors) {
        const errorObj = error.response.data.errors;
        let errorMessage = "";

        // Error dizisi varsa
        if (Array.isArray(errorObj)) {
          const messages = errorObj.map((err: any) => {
            // Prisma hatası içeren mesaj varsa formatlayalım
            if (
              err.message &&
              typeof err.message === "string" &&
              err.message.includes("prisma")
            ) {
              return formatPrismaError(err.message);
            }
            return err.message || "Bilinmeyen hata";
          });

          errorMessage = messages.join("\n");
        }
        // Ana hata mesajı varsa
        else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        setFormError(errorMessage || "İpucu oluşturulurken bir hata oluştu.");

        toast({
          title: "Hata",
          description:
            "İpucu oluşturulamadı. Lütfen detaylar için formu kontrol edin.",
          variant: "destructive",
        });
      } else {
        const errorMessage =
          "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
        setFormError(errorMessage);

        toast({
          title: "Bağlantı Hatası",
          description: errorMessage,
          variant: "destructive",
        });
      }

      console.error("Tip creation failed:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Yeni İpucu Oluştur</h1>

      <Card>
        <CardHeader>
          <CardTitle>İpucu Detayları</CardTitle>
          <CardDescription>
            Yazılım ipucunuzu aşağıdaki formu doldurarak paylaşabilirsiniz.
            İpucunuzun başlık, içerik ve etiketlerini belirtin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formError && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6 border border-destructive/30">
              <p className="font-medium mb-1">
                İşlem sırasında bir hata oluştu:
              </p>
              <p className="text-sm whitespace-pre-line">{formError}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="React useEffect Hook'unu Optimize Etme"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      İpucunuzu en iyi şekilde tanımlayan kısa bir başlık girin.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İçerik</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="useEffect hook'unu kullanırken dependency array'i doğru şekilde kullanmak performans açısından çok önemlidir..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      İpucunuzu açıklayıcı ve anlaşılır bir şekilde yazın.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiketler</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="React, Hooks, Performance"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Virgülle ayırarak birden fazla etiket ekleyebilirsiniz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Oluşturuluyor..." : "İpucu Oluştur"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
