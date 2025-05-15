
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
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToastActionType = (props: Omit<ToasterToast, "id">) => void;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toasts: ToasterToast[] = [];

const useToast = () => {
  return {
    toasts,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        toasts.forEach(t => {
          if (t.id === toastId) {
            t.open = false;
          }
        });
      }
    },
  };
};

const toast: ToastActionType = props => {
  const id = genId();

  const update = (props: ToasterToast) => {
    toasts.forEach(t => {
      if (t.id === id) {
        t.title = props.title;
        t.description = props.description;
        t.action = props.action;
        t.variant = props.variant;
      }
    });
  };

  const dismiss = () => {
    toasts.forEach(t => {
      if (t.id === id) {
        t.open = false;
      }
    });
  };

  toasts.push({
    ...props,
    id,
    open: true,
    onOpenChange: open => {
      if (!open) {
        dismiss();
      }
    },
  });

  setTimeout(() => {
    toasts.splice(
      toasts.findIndex(t => t.id === id),
      1
    );
  }, TOAST_REMOVE_DELAY);

  return {
    id,
    dismiss,
    update,
  };
};

export { useToast, toast };
