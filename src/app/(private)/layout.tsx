import { AuthProvider, ModalProvider, Sidebar } from "@/modules";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ModalProvider>
        <main className="w-full min-h-screen relative">
          <Sidebar />
          <div className="w-full pr-6 pl-21.5 py-3">
            {children}
          </div>
        </main>
      </ModalProvider>
    </AuthProvider>
  );
}
