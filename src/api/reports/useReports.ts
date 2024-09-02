import { useQuery } from "react-query";
import { fetchReport, fetchReports } from "./reports";

const useReports = (status: string) => {
  return useQuery(["reports", status], () => fetchReports(status), {
    enabled: !!status,
  });
};

export default useReports;

export const useReport = (id: string | undefined, enabled: boolean) => {
  return useQuery(["report", id], () => fetchReport(id), { enabled });
};
