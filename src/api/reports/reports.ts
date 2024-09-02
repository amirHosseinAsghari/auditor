import axios from "@/api/axiosConfig";

export interface Report {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface FetchReportsResponse {
  current_page: number;
  total_pages: number;
  reports: Report[];
}

export const fetchReports = async (
  status: string
): Promise<FetchReportsResponse> => {
  const response = await axios.get<FetchReportsResponse>("/reports", {
    params: { status },
  });
  return response.data;
};

export const fetchReport = async (id: string | undefined): Promise<Report> => {
  if (!id) throw new Error("Report ID is required");
  const response = await axios.get<Report>(`/reports/${id}`);
  return response.data;
};

interface CreateReportParams {
  title: string;
  description: string;
  // TODO
  //cve
}

export const createReport = async (
  data: CreateReportParams
): Promise<Report> => {
  const response = await axios.post<Report>("/reports", data);
  return response.data;
};

export const updateReport = async (
  id: string,
  data: CreateReportParams
): Promise<Report> => {
  const response = await axios.put<Report>(`/reports/${id}`, data);
  return response.data;
};

export const approveReport = async (id: string): Promise<Report> => {
  const response = await axios.post<Report>(`/reports/${id}/approve`);
  return response.data;
};

export const rejectReport = async (id: string): Promise<Report> => {
  const response = await axios.post<Report>(`/reports/${id}/reject`);
  return response.data;
};
