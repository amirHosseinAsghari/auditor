import { ImageItem } from "./imageItem";
import { ImageUploaderProps } from "./types";

export const ImageUploader = ({
  images,
  imageUrls,
  onRemove,
  onPreview,
  getRootProps,
  getInputProps,
  mode,
}: ImageUploaderProps) => (
  <div className="flex justify-start items-start flex-col gap-3 md:w-[50%] max-md:w-full">
    <label className="block text-base font-medium text-black">مستندات</label>
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
        <ImageItem
          key={`new-${index}`}
          file={file}
          index={index}
          onPreview={onPreview}
          onRemove={onRemove}
          mode={mode}
        />
      ))}
      {imageUrls.map((url, index) => (
        <ImageItem
          key={`existing-${index}`}
          file={url}
          index={index}
          onPreview={onPreview}
          onRemove={onRemove}
          mode={mode}
        />
      ))}
    </div>
  </div>
);
