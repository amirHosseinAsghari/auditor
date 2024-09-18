import { useMutation, useQueryClient } from "react-query";
import {
  createReport,
  updateReport,
  approveReport,
  rejectReport,
  deleteReport,
} from "./reports";
import { toast } from "sonner";

interface CreateReportParams {
  title: string;
  description: string;
  vulnerability_path: string;
  source: string | null;
  documents: string | null;
  cvss_vector: string | null;
}

export const useCreateReport = () => {
  return useMutation((data: CreateReportParams) => createReport(data));
};

export const useUpdateReport = (id: string) => {
  return useMutation((data: CreateReportParams) => updateReport(id, data));
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation((reportId: string) => deleteReport(reportId), {
    onMutate: () => {
      toast.loading("در حال حذف گزارش...", {
        position: "bottom-right",
        richColors: true,
      });
    },
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

export const useApproveReport = (id: string) => {
  return useMutation(() => approveReport(id));
};

export const useRejectReport = (id: string) => {
  return useMutation(() => rejectReport(id));
};
