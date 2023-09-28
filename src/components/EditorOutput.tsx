"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false },
);

interface EditorOutputProps {
  content: any;
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const EditorOutput: React.FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      className="text-sm"
      style={style}
      renderers={renderers}
      data={content}
    />
  );
};

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative min-h-[15rem] w-full">
      <Image src={src} fill className="object-contain" alt="Image" />
    </div>
  );
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="rounded-md bg-gray-800 p-4">
      <code className="text-sm text-gray-100">{data.code}</code>
    </pre>
  );
}

export default EditorOutput;
