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

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();

    // Kullanıcı giriş yapmışsa ve yönlendirme hedefi belirtilmişse
    if (isAuthenticated && redirectAuthenticatedTo) {
      console.log(
        `Kullanıcı giriş yapmış, yönlendiriliyor: ${redirectAuthenticatedTo}`
      );
      router.push(redirectAuthenticatedTo);
    }

    // Kullanıcı giriş yapmamışsa ve yönlendirme hedefi belirtilmişse
    if (!isAuthenticated && redirectUnauthenticatedTo) {
      console.log(
        `Kullanıcı giriş yapmamış, yönlendiriliyor: ${redirectUnauthenticatedTo}`
      );
      router.push(redirectUnauthenticatedTo);
    }
  }, [redirectAuthenticatedTo, redirectUnauthenticatedTo, router]);

  // Kullanıcının giriş durumunu döndür
  return { isAuthenticated: authService.isAuthenticated() };
};
