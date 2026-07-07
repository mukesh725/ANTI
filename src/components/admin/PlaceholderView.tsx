import { Construction } from "lucide-react";

export function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl border border-emerald-100/50 p-8 m-6">
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-serif text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm max-w-md text-center">
        This module is currently under development. Check back later for updates.
      </p>
    </div>
  );
}
