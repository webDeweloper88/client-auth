import { useEffect } from "react";
import { useToast } from "@/shared/lib/toast";
import { ToastContainer } from "./Toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast, subscribe } = useToast();

  useEffect(() => {
    const unsubscribe = subscribe();
    return unsubscribe;
  }, [subscribe]);

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
