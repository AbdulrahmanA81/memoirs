export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/album-upload',
    customers: '/dashboard/reference-faces',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/chat',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
