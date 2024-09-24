import Button from "./button";
import { ActionButtonsProps } from "./types";

export const ActionButtons = ({
  mode,
  role,
  handleApprove,
  handleReject,
  handleDelete,
  loadingStates,
}: ActionButtonsProps) => {
  if (mode === "view" && role === "auditor") {
    return (
      <div className="mt-10 flex gap-4">
        <Button
          onClick={handleApprove}
          label="تایید گزارش"
          loading={loadingStates.approveLoading}
          variant="secondary"
        />
        <Button
          onClick={handleReject}
          label="رد گزارش"
          loading={loadingStates.rejectLoading}
          variant="danger"
        />
      </div>
    );
  }

  if (mode === "view" && role === "author") {
    return (
      <div className="mt-10">
        <Button
          onClick={handleDelete}
          label="حذف گزارش"
          loading={loadingStates.deleteLoading}
          variant="danger"
        />
      </div>
    );
  }

  return null;
};
