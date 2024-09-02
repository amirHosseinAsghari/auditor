import { toast } from "sonner";

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "bottom-right",
    richColors: true,
  });
};
