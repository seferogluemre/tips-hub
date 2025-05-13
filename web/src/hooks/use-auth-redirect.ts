import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UseAuthRedirectOptions {
  redirectAuthenticatedTo?: string;
  redirectUnauthenticatedTo?: string;
}

/**
 * Yönlendirme kuralları için özel hook.
 * - Giriş yapılmışsa ve redirectAuthenticatedTo varsa o sayfaya yönlendirir (örn. login sayfasından dashboard'a)
 * - Giriş yapılmamışsa ve redirectUnauthenticatedTo varsa o sayfaya yönlendirir (örn. korunan sayfalardan login'e)
 */
export const useAuthRedirect = ({
  redirectAuthenticatedTo,
  redirectUnauthenticatedTo,
}: UseAuthRedirectOptions = {}) => {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();

    // Kullanıcı giriş yapmışsa ve yönlendirme hedefi belirtilmişse
    if (isAuthenticated && redirectAuthenticatedTo) {
      router.push(redirectAuthenticatedTo);
    }

    // Kullanıcı giriş yapmamışsa ve yönlendirme hedefi belirtilmişse
    if (!isAuthenticated && redirectUnauthenticatedTo) {
      // Oturum sonlandırıldı toast mesajı
      toast({
        title: "Oturumunuz sonlandırıldı",
        description: "Devam etmek için lütfen tekrar giriş yapın.",
        variant: "destructive",
      });
      router.push(redirectUnauthenticatedTo);
    }
  }, [redirectAuthenticatedTo, redirectUnauthenticatedTo, router, toast]);

  return { isAuthenticated: authService.isAuthenticated() };
};
