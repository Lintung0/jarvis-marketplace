import { Loader2 } from "lucide-react";

export default function PageLoader({ text = "Memuat..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-[#0d0d1a]/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full animate-pulse mx-auto" />
          <Loader2 className="w-16 h-16 text-white absolute inset-0 mx-auto animate-spin" />
        </div>
        <p className="text-gray-400 font-medium">{text}</p>
      </div>
    </div>
  );
}

export function ButtonLoader() {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>Memproses...</span>
    </div>
  );
}

export function SpinnerSmall() {
  return (
    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  );
}
