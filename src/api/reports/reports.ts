import axios from "@/api/axiosConfig";

export interface Report {
  id: string;
  status: string | null;
  author: string;
  auditor: string | null;
  title: string;
  date: string;
  description: string;
  vulnerability_path: string;
  source: string | null;
  documents: string | null;
  cvss_vector: string | null;
}

export interface ReportsApiResponse {
  reports: Report[];
  page_count: number;
}

export const fetchReports = async (
  page: number,
  status?: string
): Promise<ReportsApiResponse> => {
  const response = await axios.get<ReportsApiResponse>("/reports", {
    params: { status, page },
  });
  return response.data;
};

export const fetchReport = async (id: number | undefined): Promise<Report> => {
  if (!id) throw new Error("Report ID is required");
  const response = await axios.get<Report>(`/report/${id}`);
  return response.data;
};
//TODO if got an error of 404 code it's better to show a message indicating the wanted resource doesn't exist
/*
* {
  "token": {
    "token": "3b95c3c20f5aaf341bbd48ec8329f61f51c8058328182beaf990a6a2f8085ebc"
  },
  "report": {
    "title": "string",
    "date": "string",
    "description": "string",
    "vulnerability_path": "string",
    "source": "string",
    "documents": "string",
    "cvss_vector": "string"
  }
}
* */ // TODO this is the schema that create report api requires and it wants its token in the body of the request not in the header
interface CreateReportParams {
  title: string;
  description: string;
  vulnerability_path: string;
  source: string | null;
  documents: string | null;
  cvss_vector: string | null;
}

export const createReport = async (
  data: CreateReportParams
): Promise<Report> => {
  const response = await axios.post<Report>("/report/create", data);
  return response.data;
};
// TODO updateReport doesnt exist on the backend but removeReport with delete method does
export const updateReport = async (
  id: string,
  data: CreateReportParams
): Promise<Report> => {
  const response = await axios.put<Report>(`/report/${id}`, data);
  return response.data;
};

export const deleteReport = async (id?: string): Promise<Report> => {
  const response = await axios.delete<Report>(`/report/delete/${id}`);
  return response.data;
};

export const approveReport = async (id: string): Promise<Report> => {
  const response = await axios.patch<Report>(`/report/${id}/approve`);
  return response.data;
};

export const rejectReport = async (id: string): Promise<Report> => {
  const response = await axios.patch<Report>(`/report/${id}/reject`);
  return response.data;
};
