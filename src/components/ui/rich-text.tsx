"use client";

import { useEffect, useRef } from "react";
import type Quill from "quill";
import "quill/dist/quill.snow.css";
import { UseFormRegisterReturn } from "react-hook-form";

type RichTextProps = {
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
};

export function RichText({ label, placeholder, defaultValue, register }: RichTextProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const prevDefaultRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!editorRef.current) return;
    if (quillRef.current) return;

    let isMounted = true;

    (async () => {
      const QuillModule = await import("quill");
      const Quill = QuillModule.default;

      if (!isMounted || !editorRef.current) return;

      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      // Initialize from defaultValue once on mount
      if (defaultValue !== undefined) {
        quillRef.current.root.innerHTML = defaultValue;
        const syntheticEvent: React.ChangeEvent<HTMLInputElement> = {
          target: { value: defaultValue, name: register.name } as HTMLInputElement,
        } as React.ChangeEvent<HTMLInputElement>;
        register.onChange(syntheticEvent);
        prevDefaultRef.current = defaultValue;
      }

      quillRef.current.on("text-change", () => {
        const html = quillRef.current?.root.innerHTML || "";
        const syntheticEvent: React.ChangeEvent<HTMLInputElement> = {
          target: { value: html, name: register.name } as HTMLInputElement,
        } as React.ChangeEvent<HTMLInputElement>;

        register.onChange(syntheticEvent);
      });
    })();

    return () => {
      isMounted = false;
    };
  }, [placeholder, register, defaultValue]);

  useEffect(() => {
    if (!quillRef.current) return;
    if (defaultValue === undefined) return;
    if (prevDefaultRef.current === defaultValue) return;

    prevDefaultRef.current = defaultValue;
    const current = quillRef.current.root.innerHTML;
    if (current !== defaultValue) {
      quillRef.current.root.innerHTML = defaultValue;
      const syntheticEvent: React.ChangeEvent<HTMLInputElement> = {
        target: { value: defaultValue, name: register.name } as HTMLInputElement,
      } as React.ChangeEvent<HTMLInputElement>;
      register.onChange(syntheticEvent);
    }
  }, [defaultValue, register]);

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-medium">{label}</label>}
      <div ref={editorRef} className="min-h-[150px]" />
      <input type="hidden" {...register} />
    </div>
  );
}
