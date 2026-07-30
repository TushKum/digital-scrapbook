import { SmokeyBackground, LoginForm } from '@/components/ui/login-form';

// Full-screen glass login page: interactive smokey WebGL backdrop + an
// Apple-style liquid-glass login card that tilts and lights up under the cursor.
export default function GlassLoginPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gray-900">
      <SmokeyBackground className="absolute inset-0" color="#1E40AF" backdropBlurAmount="sm" />
      <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
        <LoginForm />
      </div>
    </main>
  );
}
