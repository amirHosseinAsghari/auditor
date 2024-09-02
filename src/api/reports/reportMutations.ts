import { useMutation } from "react-query";
import {
  createReport,
  updateReport,
  approveReport,
  rejectReport,
} from "./reports";

interface CreateReportParams {
  title: string;
  description: string;
  // TODO
  //cve
}

export const useCreateReport = () => {
  return useMutation((data: CreateReportParams) => createReport(data));
};

export const useUpdateReport = (id: string) => {
  return useMutation((data: CreateReportParams) => updateReport(id, data));
};

export const useApproveReport = (id: string) => {
  return useMutation(() => approveReport(id));
};

export const useRejectReport = (id: string) => {
  return useMutation(() => rejectReport(id));
};
