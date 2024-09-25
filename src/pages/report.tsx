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
import { useReport } from "@/api/reports/useReports";
import Modal from "@/components/modal";
import { toast } from "sonner";
import Field from "@/components/field";
import Button from "@/components/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store.ts";
import axiosInstance from "@/api/axiosConfig.ts";

interface ReportPageProps {
  mode: "view" | "edit" | "new";
}

const BASE_IMAGE_URL = axiosInstance.defaults.baseURL + "/view";

const Report: React.FC<ReportPageProps> = ({ mode }) => {
  const { id } = useParams();
  const { role } = useSelector((state: RootState) => state.auth);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState<boolean[]>([]);
  const { mutate: deleteMutation, isLoading: deleteLoading } =
    useDeleteReport();
  const navigate = useNavigate();

  const handleImageDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageDrop,
    accept: {
      "image/*": [],
    },
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

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("vulnerability_path", values.vulnerability_path);
    formData.append("source", values.source || "");
    formData.append("cvss_vector", values.cvss_vector || "");

    images.forEach((file) => {
      formData.append(`documents`, file);
    });

    if (mode === "new") {
      createMutation(formData, {
        onSuccess: () => {
          navigate("/");
        },
      });
    } else {
      updateMutation(formData, {
        onSuccess: () => {
          navigate("/");
        },
      });
    }
  };

  useEffect(() => {
    if (mode === "view" || mode === "edit") {
      const documentIds = report?.documents?.match(",") ? report?.documents?.split(",") : (report?.documents ? [report?.documents] : []);
      const urls = documentIds.map((id: string) => `${BASE_IMAGE_URL}/${id}?report_id=${report?.id}`);
      console.log(urls)
      setImageUrls(urls);
      setLoadingImages(new Array(urls.length).fill(true));
    }
  }, [report, mode]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    vulnerability_path: Yup.string().required("Required"),
  });

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePreviewImage = (image: string) => {
    setSelectedImage(image);
  };

  const handleApprove = async () => {
    approveMutation(id as string, {
      onSuccess: () => {
        navigate(-1);
      },
      onError: (error) => {
        console.error("Approval error:", error);
        toast.error("Approval failed", {
          position: "bottom-right",
          richColors: true,
        });
      },
    });
  };

  const handleReject = async () => {
    rejectMutation(id as string, {
      onSuccess: () => {
        navigate(-1);
      },
      onError: (error) => {
        console.error("Rejection error:", error);
      },
    });
  };

  const handleDelete = async () => {
    deleteMutation(id as string, {
      onSuccess: () => {
        navigate(-1);
      },
      onError: (error) => {
        toast.error("اشکالی در حذف گزارش پیش آمده است.");
      },
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied", {
      position: "bottom-right",
      richColors: true,
    });
  };

  const handleImageLoad = (index: number) => {
    setLoadingImages((prevLoadingImages) =>
      prevLoadingImages.map((loading, i) => (i === index ? false : loading))
    );
  };

  if (isLoading)
    return (
      <div className="container after:!bg-primary before:!bg-primary">
        <div className="dot !bg-primary"></div>
      </div>
    );

  const startingValues = {
    title: "",
    description: "",
    source: "",
    cvss_vector: "",
    vulnerability_path: "",
    documents: [],
  };

  const initialValues = mode === "new" ? startingValues : report;

  return (
    <div className="p-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form>
            <div className="flex justify-start items-start w-full flex-col gap-7">
              <Field
                name="title"
                label="عنوان"
                disabled={mode === "view"}
                onCopy={mode === "new" ? undefined : handleCopy}
                value={values.title}
                type="text"
                error={touched.title && errors.title ? true : false}
              />
              <Field
                name="description"
                label="توضیحات"
                disabled={mode === "view"}
                onCopy={mode === "new" ? undefined : handleCopy}
                value={values.description}
                as="textarea"
                error={touched.description && errors.description ? true : false}
              />
              <Field
                name="vulnerability_path"
                label="مسیر آسیب پذیری"
                disabled={mode === "view"}
                onCopy={mode === "new" ? undefined : handleCopy}
                value={values.vulnerability_path}
                type="text"
                error={
                  touched.vulnerability_path && errors.vulnerability_path
                    ? true
                    : false
                }
              />
              <Field
                name="source"
                label="منبع و یا CVE مربوطه"
                disabled={mode === "view"}
                onCopy={mode === "new" ? undefined : handleCopy}
                value={values.source || ""}
                type="text"
              />
              <Field
                name="cvss_vector"
                label="وکتور CVSS"
                disabled={mode === "view"}
                onCopy={mode === "new" ? undefined : handleCopy}
                value={values.cvss_vector || ""}
                type="text"
              />
              {!(mode === "view" && images.length <= 0) && (
                <div className="flex justify-start items-start flex-col gap-3 md:w-[50%] max-md:w-full">
                  <label className="block text-base font-medium text-black">
                    {" "}
                    مستندات
                  </label>
                  {mode !== "view" && (
                    <div
                      {...getRootProps()}
                      className="border-2 border-dashed border-gray-300 p-6 w-full text-center cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <p className="text-gray-500">
                        Drag and drop images here, or click to select files
                      </p>
                    </div>
                  )}
                  <div className="mt-4 w-full grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-4">
                    {images.map((file, index) => (
                      <div
                        key={index}
                        className="border rounded-[10px] p-3 flex flex-col items-center justify-center gap-3"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-28 h-28 object-cover"
                        />
                        <span className="text-sm">{file.name}</span>
                        <div className="flex justify-center items-center gap-4 w-full">
                          <button
                            type="button"
                            className="text-blue-500"
                            onClick={() =>
                              handlePreviewImage(URL.createObjectURL(file))
                            }
                          >
                            Preview
                          </button>
                          {mode !== "view" && (
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => handleImageRemove(index)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {imageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="border rounded-[10px] p-3 flex flex-col items-center justify-center gap-3"
                      >
                        {loadingImages[index] ? (
                          <div className="w-32 h-32 rounded-[10px] border border-gray-400 bg-gray-200 animate-pulse"></div>
                        ) : (
                          <div
                            key={index}
                            className="border rounded-[10px] p-3 flex flex-col items-center justify-center gap-3"
                          >
                            <img
                              src={url}
                              alt={`Document ${index}`}
                              className="w-30 h-30 object-cover"
                              onLoad={() => handleImageLoad(index)}
                            />
                            <div className="flex justify-center items-center gap-4 w-full">
                              <button
                                type="button"
                                className="text-blue-500"
                                onClick={() => handlePreviewImage(url)}
                              >
                                Preview
                              </button>
                              {mode === "edit" && (
                                <button
                                  type="button"
                                  className="text-red-500"
                                  onClick={() => handleImageRemove(index)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
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

      {mode === "view" && role === "auditor" && (
        <div className="mt-10 flex gap-4">
          <Button
            onClick={handleApprove}
            label="تایید گزارش"
            loading={approveLoading}
            variant="secondary"
          />
          <Button
            onClick={handleReject}
            label="رد گزارش"
            loading={rejectLoading}
            variant="danger"
          />
        </div>
      )}
      {mode === "view" && role === "author" && (
        <div className="mt-10">
          <Button
            onClick={handleDelete}
            label="حذف گزارش"
            loading={deleteLoading}
            variant="danger"
          />
        </div>
      )}

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
