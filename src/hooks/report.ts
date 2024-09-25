import { useDocumentImages } from "@/api/reports/useReports";

export const useImageUrls = (report: any, id: string | undefined) => {
  const { data: imageUrls } = useDocumentImages(
    report?.documents ? report.documents.split(",") : [],
    id || ""
  );

  return imageUrls;
};
