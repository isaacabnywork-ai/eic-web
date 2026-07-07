import { getContentById } from "@/lib/db";
import { EditorForm } from "@/components/admin/editor-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditorPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams.id as string | undefined;
  
  let initialData = null;
  if (id) {
    initialData = await getContentById(id);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Link href="/admin" className="flex items-center gap-2 text-black/40 hover:text-[#1a1715] mb-6 transition-colors w-fit">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
      
      <div className="mb-8 pb-4 border-b border-black/5">
        <h1 className="font-sans font-black tracking-tighter uppercase text-3xl text-[#1a1715]">
          {initialData ? "Edit Content" : "Create New Content"}
        </h1>
        <p className="text-black/60 mt-2">
          {initialData ? "Update the details for this item below." : "Fill out the fields to publish a new piece of content."}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-black/5 p-6 md:p-8 shadow-sm">
        <EditorForm initialData={initialData} />
      </div>
    </div>
  );
}
