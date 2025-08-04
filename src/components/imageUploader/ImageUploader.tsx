import {
  ChangeEvent,
  DragEvent,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/utils/cn";

import ImagePlaceholder from "./ImagePlaceholder";
import ImagePreview from "./ImagePreview";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label: string;
  value: File | undefined;
  onChange: (_file: File | undefined) => void;
}

const ImageUploader = ({ onChange, value, label }: Props) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [base64, setBase64] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDelete = () => {
    onChange(undefined);
    setBase64([]);
  };

  useEffect(() => {
    if (value) {
      const newBase64: string[] = [];
      const reader = new FileReader();
      reader.readAsDataURL(value);
        reader.onload = () => {
          newBase64.push(reader.result as string);
          setBase64(newBase64);
        };
    } else {
      setBase64([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    event: DragEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    let acceptedFile: File | undefined;

    if (event.type === "drop") {
      event = event as DragEvent<HTMLDivElement>;
      const files = Array.from(event.dataTransfer.files) as File[];
      acceptedFile = files.length > 0 ? files[0] : undefined;
    } else if (
      event.target instanceof HTMLInputElement &&
      event.target.files &&
      event.target.files.length > 0
    ) {
      const files = Array.from(event.target.files) as File[];
      acceptedFile = files.length > 0 ? files[0] : undefined;
    }

    if (!acceptedFile) return;

    // 단일 이미지 처리
    const reader = new FileReader();
    reader.readAsDataURL(acceptedFile);
    reader.onload = () => {
      setBase64([reader.result as string]);
      onChange(acceptedFile);
    };

    setIsDragActive(false);
  };

  const renderImageComponent = () => {
    if (base64.length === 0) {
      return (
        <ImagePlaceholder
          ref={inputRef}
          label={label}
          isDragActive={isDragActive}
          onChange={(e) => handleChange(e)}
        />
      );
    }

    if (base64.length > 0) {
      return (
        <div className="h-[200px] w-full">
          {base64.map((src, index) => (
            <ImagePreview
              key={src + index}
              src={src}
              onDelete={handleDelete}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div
      className={cn("w-full flex flex-col gap-2 relative")}
      onDrop={handleChange}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragActive(false)}
    >
      <label className="text-sm font-medium text-gray-700" htmlFor={label}>
        {label}
      </label>
      {renderImageComponent()}
    </div>
  );
};

export default ImageUploader;
