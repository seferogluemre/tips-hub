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
import {
  useLogout,
  useUpdateProfile,
  useUserById,
  useUserProfile,
} from "@/hooks/use-user";
import { profileFormSchema, ProfileFormValues } from "@/schemas/user.schema";
import { UserTip } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [activeTab, setActiveTab] = useState("profile");

  // Always fetch current user profile as a fallback
  const { data: currentUser, isLoading: isCurrentUserLoading } = useUserProfile(
    userId || ""
  );

  // Fetch user by ID only if valid userId is provided
  const { data: userById, isLoading: isUserByIdLoading } = useUserById(
    userId || "",
    {
      enabled: !!userId && userId.length > 0,
    }
  );

  // Determine which user data to use
  const userData = userId && userById ? userById : currentUser;
  const isLoading = userId ? isUserByIdLoading : isCurrentUserLoading;

  console.log("Current user data:", currentUser);
  console.log("User by ID data:", userById);
  console.log("Final user data to display:", userData);

  // Logout mutation
  const logoutMutation = useLogout();

  // Update profile mutation
  const updateProfileMutation = useUpdateProfile();

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

  useEffect(() => {
    if (userData) {
      console.log("Setting form values with:", userData);
      form.reset({
        name: userData.name || "",
        email: userData.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [userData, form]);

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
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-10 bg-muted rounded animate-pulse" />
                    <div className="h-10 bg-muted rounded animate-pulse" />
                  </div>
                ) : !userData ? (
                  <div className="p-4 text-center">
                    <p className="text-red-500">
                      Kullanıcı bilgileri yüklenemedi.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => router.push("/dashboard")}
                      variant="outline"
                    >
                      Panele Dön
                    </Button>
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
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-14 bg-muted rounded animate-pulse" />
                  <div className="h-14 bg-muted rounded animate-pulse" />
                  <div className="h-14 bg-muted rounded animate-pulse" />
                </div>
              ) : !userData ? (
                <div className="p-4 text-center">
                  <p className="text-red-500">
                    Kullanıcı bilgileri yüklenemedi.
                  </p>
                </div>
              ) : userData.tips && userData.tips.length > 0 ? (
                <div className="space-y-4">
                  {userData.tips.map((tip: UserTip) => (
                    <div key={tip.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-md">{tip.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(tip.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(`/dashboard/tips/${tip.id}`)
                          }
                        >
                          Görüntüle
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-3">
                    Henüz bir ipucu paylaşılmamış.
                  </p>
                  <Button onClick={() => router.push("/dashboard/create-tip")}>
                    İpucu Oluştur
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Debug information */}
      {process.env.NODE_ENV !== "production" && (
        <div className="mt-8 p-4 border border-gray-200 rounded-md">
          <h3 className="font-medium mb-2">Debug Info</h3>
          <pre className="text-xs overflow-auto bg-gray-50 p-2 rounded">
            {JSON.stringify(
              {
                userId,
                userDataSource: userId && userById ? "userById" : "currentUser",
                userData: userData
                  ? {
                      id: userData.id,
                      name: userData.name,
                      email: userData.email,
                      tipsCount: userData.tips?.length || 0,
                    }
                  : null,
                isLoading,
                isCurrentUserLoading,
                isUserByIdLoading,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
