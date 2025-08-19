import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

let toastId = 0;

const generateId = () => `toast-${++toastId}`;

// Глобальное состояние для toast уведомлений
let globalToasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener([...globalToasts]));
};

export const toastService = {
  show: (message: string, type: Toast["type"] = "info", duration = 3000) => {
    const toast: Toast = {
      id: generateId(),
      message,
      type,
      duration,
    };
    
    globalToasts.push(toast);
    notifyListeners();
    
    // Автоматическое удаление
    setTimeout(() => {
      toastService.remove(toast.id);
    }, duration);
    
    return toast.id;
  },

  success: (message: string, duration?: number) => 
    toastService.show(message, "success", duration),
  
  error: (message: string, duration?: number) => 
    toastService.show(message, "error", duration),
  
  info: (message: string, duration?: number) => 
    toastService.show(message, "info", duration),

  remove: (id: string) => {
    globalToasts = globalToasts.filter(toast => toast.id !== id);
    notifyListeners();
  },

  clear: () => {
    globalToasts = [];
    notifyListeners();
  },

  subscribe: (listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    listener([...globalToasts]); // Отправляем текущее состояние
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const subscribe = useCallback(() => {
    return toastService.subscribe(setToasts);
  }, []);

  const showToast = useCallback((message: string, type: Toast["type"] = "info", duration?: number) => {
    return toastService.show(message, type, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    toastService.remove(id);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    subscribe,
    success: toastService.success,
    error: toastService.error,
    info: toastService.info,
  };
}
