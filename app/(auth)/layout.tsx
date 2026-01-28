/**
 * Auth layout for /login, /register, /forgot-password, /reset-password.
 * Wireframes: 0.5.1.11, 0.5.1.12, 0.5.1.13.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {children}
    </div>
  );
}
