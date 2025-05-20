
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

export type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "destructive";
  duration?: number;
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

type ToastActionType = (props: Omit<ToasterToast, "id">) => void;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

// Create a global array to store toasts
const toasts: ToasterToast[] = [];

// Create a standalone toast function that can be imported directly
export const toast: ToastActionType = (props) => {
  const id = genId();
  const duration = props.duration || TOAST_REMOVE_DELAY;

  const newToast: ToasterToast = {
    ...props,
    id,
    open: true,
    onOpenChange: (open) => {
      if (!open) {
        // Mark toast as closed
        const index = toasts.findIndex(t => t.id === id);
        if (index !== -1) {
          toasts[index].open = false;
        }
      }
    },
  };

  // Add toast to the array
  toasts.push(newToast);
  console.log("Toast created:", newToast);
  console.log("Current toasts:", toasts);

  // Set timeout to close the toast
  setTimeout(() => {
    const index = toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts[index].open = false;
      console.log("Toast closed:", id);
    }
  }, duration);

  // Set timeout to remove the toast from the array
  setTimeout(() => {
    const index = toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.splice(index, 1);
      console.log("Toast removed from array:", id);
    }
  }, duration + 1000);

  return {
    id,
    dismiss: () => {
      const index = toasts.findIndex(t => t.id === id);
      if (index !== -1) {
        toasts[index].open = false;
      }
    },
    update: (props: Partial<Omit<ToasterToast, "id">>) => {
      const index = toasts.findIndex(t => t.id === id);
      if (index !== -1) {
        toasts[index] = { ...toasts[index], ...props };
      }
    },
  };
};

// Create a custom hook to access toasts array and actions
export const useToast = () => {
  return {
    toasts,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        const index = toasts.findIndex(t => t.id === toastId);
        if (index !== -1) {
          toasts[index].open = false;
        }
      }
    },
  };
};
