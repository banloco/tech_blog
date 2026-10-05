import type { CategoryInfo } from "@/lib/categories";

export default function CategoryBadge({ category, small = false }: { category: CategoryInfo; small?: boolean }) {
  const Icon = category.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${small ? "text-xs" : "px-2.5 py-1 text-xs"}`}
      style={{
        color: category.color,
        background: small ? undefined : `color-mix(in srgb, ${category.color} 10%, transparent)`,
      }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {category.short}
    </span>
  );
}
