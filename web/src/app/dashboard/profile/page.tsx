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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTips } from "@/hooks/use-tips";
import { useLogout, useUpdateProfile, useUserProfile } from "@/hooks/use-user";
import { profileFormSchema, ProfileFormValues } from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user profile
  const { data: user, isLoading: isUserLoading } = useUserProfile();

  // Logout mutation
  const logoutMutation = useLogout();

  // Update profile mutation
  const updateProfileMutation = useUpdateProfile();

  const { data: userTips, isLoading: isTipsLoading } = useTips();

  // Form setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Set form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, form]);

  // Handle profile update
  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate({
      name: data.name,
      email: data.email,
      ...(data.newPassword && {
        currentPassword: data.currentPassword,
        password: data.newPassword,
      }),
    });
  };

  // Handle logout
  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Hesap Bilgileri</h1>

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="tips">İpuçlarım</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil Detayları</CardTitle>
                <CardDescription>
                  Profil bilgilerinizi güncelleyin veya şifrenizi değiştirin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isUserLoading ? (
                  <div className="space-y-4">
                    <div className="h-10 bg-muted rounded animate-pulse" />
                    <div className="h-10 bg-muted rounded animate-pulse" />
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ad Soyad</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-posta</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="border-t pt-4">
                        <h3 className="text-md font-medium mb-3">
                          Şifre Değiştir
                        </h3>

                        <FormField
                          control={form.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mevcut Şifre</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Yeni Şifre</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Şifre Tekrar</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending
                          ? "Güncelleniyor..."
                          : "Kaydet"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hesap Ayarları</CardTitle>
                <CardDescription>
                  Hesabınız ile ilgili diğer ayarlar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending
                    ? "Çıkış yapılıyor..."
                    : "Çıkış Yap"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle>İpuçlarım</CardTitle>
              <CardDescription>
                Oluşturduğunuz ve paylaştığınız yazılım ipuçları.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isTipsLoading ? (
                <div className="space-y-4">
                  <div className="h-14 bg-muted rounded animate-pulse" />
                  <div className="h-14 bg-muted rounded animate-pulse" />
                  <div className="h-14 bg-muted rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-4">
                  {userTips && userTips.length > 0 ? (
                    userTips.map((tip) => (
                      <div key={tip.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-md">{tip.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {tip.createdAt}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {tip.content}
                        </p>
                        <div className="flex gap-2">
                          {tip.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-3">
                        Henüz bir ipucu paylaşmadınız.
                      </p>
                      <Button
                        onClick={() => router.push("/dashboard/create-tip")}
                      >
                        İpucu Oluştur
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
