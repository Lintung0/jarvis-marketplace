import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-50 rounded-full mb-6">
        <Icon className="w-10 h-10 text-teal-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 gradient-brand text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  description = "Maaf, ada masalah saat memuat data. Silakan coba lagi.",
  actionLabel = "Coba Lagi",
  onRetry,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
