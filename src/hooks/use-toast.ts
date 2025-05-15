
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";
import {
  useToast as useShadcnToast
} from "@/components/ui/use-toast";

export type ToasterToast = Toast & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
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

const toast: ToastActionType = props => {
  const id = genId();

  const update = (props: ToastProps) => {
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

export { useShadcnToast as useToast, toast };
