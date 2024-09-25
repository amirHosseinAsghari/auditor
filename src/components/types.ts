export interface ImageItemProps {
  file: File | string;
  index: number;
  onPreview: (image: string) => void;
  onRemove: (index: number) => void;
  mode: "view" | "edit" | "new";
}

export interface ImageUploaderProps {
  images: File[];
  imageUrls: string[];
  onRemove: (index: number) => void;
  onPreview: (image: string) => void;
  getRootProps: any;
  getInputProps: any;
  mode: "view" | "edit" | "new";
}

export interface ActionButtonsProps {
  mode: "view" | "edit" | "new";
  role: string | null;
  handleApprove: () => void;
  handleReject: () => void;
  handleDelete: () => void;
  loadingStates: {
    approveLoading: boolean;
    rejectLoading: boolean;
    deleteLoading: boolean;
  };
}
