import Link from "next/link";
import { FicheHACCP } from "@/lib/fiches";
import { FicheIcon } from "./FicheIcon";

export function FicheCard({ fiche }: { fiche: FicheHACCP }) {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-primary-light transition-all group">
      <Link href={`/fiches-haccp/${fiche.slug}`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FicheIcon name={fiche.icon} className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
              {fiche.shortTitle}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{fiche.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                {fiche.frequency}
              </span>
              <span className="text-xs text-accent-dark font-semibold">PDF gratuit</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
