import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { loginUser } from '@/api/endpoints/authApi';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest, LoginResponse } from '@/types/auth';

// Push-token registration itself is not triggered here — it runs off `isAuthenticated`
// in RootNavigator, which fires for this login the moment setSession flips that flag,
// and (unlike this hook) also fires on every later app open via restoreSession. That
// single trigger point is what lets a user who denied the iOS permission prompt once
// get registered on a later app open, instead of only ever getting one shot at login.
export function useLogin() {
  const setSession = useAuthStore(s => s.setSession);

  return useMutation<LoginResponse, AxiosError<{ error: string }>, LoginRequest>({
    mutationFn: (payload: LoginRequest) => loginUser(payload),
    onSuccess: async data => {
      await setSession(data.accessToken, data.refreshToken, data.user, data.modules);
    },
  });
}
