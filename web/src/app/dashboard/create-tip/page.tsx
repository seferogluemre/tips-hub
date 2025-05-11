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
import { CreateTipFormValues, createTipSchema } from "@/schemas/tip.schema";
import { tipService } from "@/services/tip.service";
import { useTipFilterStore } from "@/store/tip-filter.store";
import { CreateTipParams } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateTipPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { resetFilters } = useTipFilterStore();

  const form = useForm<CreateTipFormValues>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  });

  const createTipMutation = useMutation({
    mutationFn: (data: CreateTipParams) => tipService.createTip(data),
    onSuccess: (response) => {
      setIsSubmitting(false);
      setFormError(null);

      toast({
        title: "İpucu oluşturuldu",
        description: "İpucunuz başarıyla oluşturuldu.",
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["tips"] });
      resetFilters();
      router.push("/dashboard");
    },
    onError: (error: any) => {
      setIsSubmitting(false);

      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map((err: any) => err.message)
          .join("\n");

        setFormError(errorMessages || "İpucu oluşturulurken bir hata oluştu.");

        toast({
          title: "Hata",
          description: "İpucu oluşturulurken bir hata oluştu.",
          variant: "destructive",
        });
      } else {
        setFormError(
          "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );

        toast({
          title: "Hata",
          description:
            "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
          variant: "destructive",
        });
      }

      console.error("Tip creation failed:", error);
    },
  });

  const onSubmit = (data: CreateTipFormValues) => {
    setIsSubmitting(true);

    const tagsArray = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    createTipMutation.mutate({
      title: data.title,
      content: data.content,
      tags: tagsArray,
    });
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
            <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4">
              <p className="font-medium">Bir hata oluştu:</p>
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
