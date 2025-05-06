import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LoginForm } from '@/components/login-form';

const LoginPage = async () => {
  const session = await auth();

  // Redirect to home if already logged in
  if (session) {
    redirect('/');
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;