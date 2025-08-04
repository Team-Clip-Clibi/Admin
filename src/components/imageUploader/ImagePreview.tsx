import Image from "next/image";
import { FC } from "react";

import { cn } from "@/utils/cn";

import ImageUploadButton from "../core/button/ImageUploadButton";

interface Props {
  src: string;
  onDelete: () => void;
}

const ImagePreview: FC<Props> = ({ src, onDelete }) => {
  return (
    <div className="relative h-[200px] w-full bg-gray-50 rounded-lg flex items-center justify-center">
      <Image 
        fill 
        src={src} 
        alt={src} 
        className="rounded-lg object-cover" 
        style={{ objectPosition: 'center' }}
      />
      <ImageUploadButton
        className={cn(
          "flex justify-center items-center",
          "absolute top-2 right-2",
          "w-6 h-6 rounded-full bg-white shadow-md hover:bg-gray-50",
        )}
        onClick={onDelete}
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </ImageUploadButton>
    </div>
  );
};

export default ImagePreview;
