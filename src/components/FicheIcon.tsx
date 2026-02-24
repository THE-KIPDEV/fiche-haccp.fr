import {
  SprayCan,
  ClipboardList,
  AlertTriangle,
  Flame,
  Snowflake,
  Thermometer,
  Package,
  Wrench,
  FileText,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "spray-can": SprayCan,
  "clipboard-list": ClipboardList,
  "alert-triangle": AlertTriangle,
  flame: Flame,
  snowflake: Snowflake,
  thermometer: Thermometer,
  package: Package,
  wrench: Wrench,
  "file-text": FileText,
};

export function FicheIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] || FileText;
  return <Icon className={className} />;
}
