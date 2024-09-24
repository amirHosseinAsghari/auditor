import { ImageItemProps } from "./types";

export const ImageItem = ({
  file,
  index,
  onPreview,
  onRemove,
  mode,
}: ImageItemProps) => {
  const isFile = file instanceof File;
  const src = isFile ? URL.createObjectURL(file) : file;
  const alt = isFile ? file.name : `Document ${index}`;

  return (
    <div className="border rounded-[10px] p-3 flex flex-col items-center justify-center gap-3">
      <img src={src} alt={alt} className="w-28 h-28 object-cover" />
      {isFile && <span className="text-sm">{file.name}</span>}
      <div className="flex justify-center items-center gap-4 w-full">
        <button
          type="button"
          className="text-blue-500"
          onClick={() => onPreview(src)}
        >
          Preview
        </button>
        {mode !== "view" && (
          <button
            type="button"
            className="text-red-500"
            onClick={() => onRemove(index)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};
