"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  defaultImage?: string;
}

export function ImageUploader({ onUploadSuccess, defaultImage }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc).");
      return;
    }
    
    // Set local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    uploadToFirebase(file);
  };

  const uploadToFirebase = (file: File) => {
    setIsUploading(true);
    
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, `content-images/${fileName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // We could track progress here if we wanted a progress bar
      },
      (err) => {
        console.error("Upload error:", err);
        setError("Failed to upload image to Firebase Storage.");
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onUploadSuccess(downloadURL);
        setIsUploading(false);
      }
    );
  };

  const clearImage = () => {
    setPreview(null);
    onUploadSuccess(""); // clear it in parent form
  };

  if (preview) {
    return (
      <div className="relative w-full h-48 rounded-xl border border-black/10 overflow-hidden bg-black/5 group">
        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        
        {isUploading ? (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#b47539] mb-2" size={32} />
            <span className="text-sm font-semibold text-[#1a1715]">Uploading...</span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button" 
              onClick={clearImage}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors shadow-lg"
            >
              <X size={16} /> Remove Image
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-colors cursor-pointer relative ${
          isDragging 
            ? 'border-[#b47539] bg-[#b47539]/5' 
            : 'border-black/10 bg-white hover:border-[#b47539]/50 hover:bg-black/5'
        }`}
      >
        <input 
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDragging ? 'bg-[#b47539]/20 text-[#b47539]' : 'bg-black/5 text-black/40'}`}>
          <UploadCloud size={24} />
        </div>
        <h4 className="font-semibold text-[#1a1715] mb-1">
          {isDragging ? 'Drop image here' : 'Drag or drop files'}
        </h4>
        <p className="text-sm text-black/40">
          or click to choose from files
        </p>
      </div>
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
