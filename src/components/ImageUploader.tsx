import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages';

interface ImageUploaderProps {
  currentImageUrl: string;
  onImageChange: (url: string) => void;
}

export const ImageUploader = ({
  currentImageUrl,
  onImageChange,
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full space-y-2.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
          <span>Source Image Input</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
          Drag & Drop or Presets
        </span>
      </label>

      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
          isDragging
            ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/20 scale-[0.99]'
            : 'border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 bg-white dark:bg-slate-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />

        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 group-hover:scale-110 transition-transform">
            <Upload className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Upload custom image
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Drop image here or click to browse
            </p>
          </div>
        </div>
      </div>

      {/* Sample Image Quick Presets */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-pink-400" />
            <span>Sample Presets:</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {SAMPLE_IMAGES.map((sample) => {
            const isActive = currentImageUrl === sample.url;
            return (
              <button
                key={sample.id}
                onClick={() => onImageChange(sample.url)}
                className={`p-1.5 rounded-xl border text-left transition-all flex flex-col items-center space-y-1 ${
                  isActive
                    ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
                title={sample.subtitle}
              >
                <div className="w-full h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={sample.url}
                    alt={sample.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate w-full text-center">
                  {sample.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
