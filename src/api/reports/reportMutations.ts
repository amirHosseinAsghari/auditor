import { useMutation, useQueryClient } from "react-query";
import {
  createReport,
  updateReport,
  approveReport,
  rejectReport,
  deleteReport,
} from "./reports";
import { toast } from "sonner";


export const useCreateReport = () => {
  return useMutation((data: FormData) => createReport(data));
};

export const useUpdateReport = (id: string) => {
  return useMutation((data: FormData) => updateReport(id, data));
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation((reportId: string) => deleteReport(reportId), {
    onSuccess: () => {
      toast.success("گزارش با موفقیت حذف شد", {
        position: "bottom-right",
        richColors: true,
      });
      queryClient.invalidateQueries("reports");
    },
    onError: () => {
      toast.error("خطا در حذف گزارش", {
        position: "bottom-right",
        richColors: true,
      });
    },
  });
};

// Function for approving a report
export const useApproveReport = () => {
  return useMutation((id: string) => approveReport(id));
};

// Function for rejecting a report
export const useRejectReport = () => {
  return useMutation((id: string) => rejectReport(id));
};
