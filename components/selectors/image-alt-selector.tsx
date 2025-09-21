"use client";
import { useEditor } from "novel";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "../ui/popover";
import { Input } from "../ui/input";
import { Check, Eraser } from "lucide-react";

type ImageAltSelectorProps = {
  open?: boolean;
};

export const ImageAltSelector = (_props: ImageAltSelectorProps) => {
  const { editor } = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  if (!editor) return null;

  // Only show the control when an image node is active/selected
  const isImageActive = editor.isActive("image");
  if (!isImageActive) return null;

  const currentAlt = (editor.getAttributes("image").alt as string) || "";

  const applyAlt = (value: string) => {
    editor.chain().focus().updateAttributes("image", { alt: value }).run();
  };

  const clearAlt = () => {
    // empty alt is valid for decorative images
    editor.chain().focus().updateAttributes("image", { alt: "" }).run();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="gap-2 rounded-none">
          Alt
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2" sideOffset={10}>
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            defaultValue={currentAlt}
            placeholder="Describe the image (alt text)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const val = (e.currentTarget as HTMLInputElement).value;
                applyAlt(val);
              }
            }}
          />
          <Button
            size="icon"
            className="h-8 w-8"
            title="Apply"
            onClick={() => {
              if (!inputRef.current) return;
              applyAlt(inputRef.current.value);
            }}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            title="Clear alt"
            onClick={clearAlt}
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ImageAltSelector;
