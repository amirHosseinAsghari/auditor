import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  useCreateReport,
  useUpdateReport,
  useApproveReport,
  useRejectReport,
  useDeleteReport,
} from "@/api/reports/reportMutations";
import { useDropzone } from "react-dropzone";
import { useDocumentImages, useReport } from "@/api/reports/useReports";
import Modal from "@/components/modal";
import { toast } from "sonner";
import Field from "@/components/field";
import Button from "@/components/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store.ts";
import { ImageUploader } from "@/components/imageUploader";
import { ActionButtons } from "@/components/actionButtons";

interface FormField {
  name: keyof ReportFormValues;
  label: string;
  type?: string;
  as?: string;
}

interface ReportFormValues {
  title: string;
  description: string;
  vulnerability_path: string;
  source: string | null;
  cvss_vector: string | null;
  documents: File[] | string[];
}

const formFields: FormField[] = [
  { name: "title", label: "عنوان", type: "text" },
  { name: "description", label: "توضیحات", as: "textarea" },
  { name: "vulnerability_path", label: "مسیر آسیب پذیری", type: "text" },
  { name: "source", label: "منبع و یا CVE مربوطه", type: "text" },
  { name: "cvss_vector", label: "وکتور CVSS", type: "text" },
];

interface ReportPageProps {
  mode: "view" | "edit" | "new";
}
const Report: React.FC<ReportPageProps> = ({ mode }) => {
  const { id } = useParams();
  const { role } = useSelector((state: RootState) => state.auth);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleMutation = (
    mutationFn: (id: string, options: any) => void,
    onSuccessMessage: string,
    onErrorMessage: string
  ) => {
    mutationFn(id as string, {
      onSuccess: () => {
        navigate(-1);
        toast.success(onSuccessMessage, {
          position: "bottom-right",
          richColors: true,
        });
      },
      onError: (error: any) => {
        console.error(onErrorMessage, error);
        toast.error(onErrorMessage, {
          position: "bottom-right",
          richColors: true,
        });
      },
    });
  };

  const handleImageDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageDrop,
    accept: { "image/*": [] },
  });

  const { data: report, isLoading } = useReport(
    Number(id),
    mode !== "new" && !!id
  );
  const { mutate: createMutation, isLoading: createLoading } =
    useCreateReport();
  const { mutate: updateMutation, isLoading: updateLoading } = useUpdateReport(
    id as string
  );
  const { mutate: approveMutation, isLoading: approveLoading } =
    useApproveReport();
  const { mutate: rejectMutation, isLoading: rejectLoading } =
    useRejectReport();
  const { mutate: deleteMutation, isLoading: deleteLoading } =
    useDeleteReport();

  const handleSubmit = async (values: ReportFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("vulnerability_path", values.vulnerability_path);
    formData.append("source", values.source || "");
    formData.append("cvss_vector", values.cvss_vector || "");
    images.forEach((file) => formData.append(`documents`, file));

    if (mode === "new") {
      createMutation(formData, { onSuccess: () => navigate("/") });
    } else {
      updateMutation(formData, { onSuccess: () => navigate("/") });
    }
  };

  useEffect(() => {
    if (mode === "view" || mode === "edit") {
      const documentIds = report?.documents ? report.documents.split(",") : [];
      const { data: imageUrls } = useDocumentImages(documentIds, id || "");
      if (imageUrls) setImageUrls(imageUrls);
    }
  }, [report, mode, id]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    vulnerability_path: Yup.string().required("Required"),
  });

  const handleApprove = () =>
    handleMutation(approveMutation, "Report approved", "Approval failed");
  const handleReject = () =>
    handleMutation(rejectMutation, "Report rejected", "Rejection failed");
  const handleDelete = () =>
    handleMutation(deleteMutation, "Report deleted", "Delete failed");

  if (isLoading)
    return (
      <div className="container after:!bg-primary before:!bg-primary">
        <div className="dot !bg-primary"></div>
      </div>
    );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied", {
      position: "bottom-right",
      richColors: true,
    });
  };

  const handleImageRemove = (index: number) => {
    if (index < images.length) {
      setImages(images.filter((_, i) => i !== index));
    } else {
      setImageUrls(imageUrls.filter((_, i) => i !== index - images.length));
    }
  };

  const handlePreviewImage = (image: string) => {
    setSelectedImage(image);
  };

  const initialValues =
    mode === "new"
      ? {
          title: "",
          description: "",
          source: "",
          cvss_vector: "",
          vulnerability_path: "",
          documents: [],
        }
      : report || {};

  return (
    <div className="p-6">
      <Formik
        initialValues={initialValues as ReportFormValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form>
            <div className="flex justify-start items-start w-full flex-col gap-7">
              {formFields.map(({ name, label, type, as }) => (
                <Field
                  key={name}
                  name={name}
                  label={label}
                  disabled={mode === "view"}
                  value={values[name] as string}
                  type={type}
                  onCopy={mode === "new" ? undefined : handleCopy}
                  as={as}
                  error={touched[name] && errors[name] ? true : false}
                />
              ))}
              {!(mode === "view" && images.length <= 0) && (
                <ImageUploader
                  images={images}
                  imageUrls={imageUrls}
                  onRemove={handleImageRemove}
                  onPreview={handlePreviewImage}
                  getRootProps={getRootProps}
                  getInputProps={getInputProps}
                  mode={mode}
                />
              )}
            </div>
            {mode != "view" && (
              <div className="mt-10">
                <Button
                  type="submit"
                  label={mode === "new" ? "ایجاد گزارش" : "ویرایش"}
                  loading={createLoading || updateLoading}
                  variant="primary"
                />
              </div>
            )}
          </Form>
        )}
      </Formik>

      <ActionButtons
        mode={mode}
        role={role}
        handleApprove={handleApprove}
        handleReject={handleReject}
        handleDelete={handleDelete}
        loadingStates={{ approveLoading, rejectLoading, deleteLoading }}
      />

      {selectedImage && (
        <Modal onClose={() => setSelectedImage(null)}>
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-full"
          />
        </Modal>
      )}
    </div>
  );
};

export default Report;
