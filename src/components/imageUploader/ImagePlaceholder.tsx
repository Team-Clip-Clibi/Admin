import { ChangeEvent, forwardRef, HtmlHTMLAttributes, Ref } from "react";

import { cn } from "@/utils/cn";
import ImageUploadButton from "../core/button/ImageUploadButton";

interface Props extends Omit<HtmlHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  isDragActive: boolean;
  onChange: (_event: ChangeEvent<HTMLInputElement>) => void;
  ref?: Ref<HTMLInputElement>;
}

const ImagePlaceholder = forwardRef<HTMLInputElement, Props>(
  ({ label, isDragActive, onChange, ...props }, ref) => {
    return (
      <ImageUploadButton
        onClick={() => {
          if (ref && typeof ref !== "function" && ref.current) {
            ref.current.click();
          }
        }}
        className={cn(
          "w-full h-[200px] rounded-lg duration-300",
          "border border-gray-300",
          "flex justify-center items-center",
          isDragActive ? "bg-blue-50 border-blue-300" : "bg-white hover:bg-gray-50",
          props.className,
        )}
      >
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <input
          ref={ref}
          name={label}
          type="file"
          accept="image/jpeg, image/png, image/webp, image/jpg, image/svg"
          hidden
          onChange={onChange}
          {...props}
        />
      </ImageUploadButton>
    );
  },
);

ImagePlaceholder.displayName = "ImagePlaceholder";

export default ImagePlaceholder;
