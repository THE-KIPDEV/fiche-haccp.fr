"use client";

import { useState, useEffect } from "react";
import { PdfBuilderSettings } from "./PdfBuilderSettings";
import { PdfBuilderPreview } from "./PdfBuilderPreview";

interface FicheData {
  slug: string;
  title: string;
  shortTitle: string;
  pdfFields: string[];
}

interface PdfBuilderProps {
  fiche: FicheData;
}

export function PdfBuilder({ fiche }: PdfBuilderProps) {
  const [restaurantName, setRestaurantName] = useState("");
  const [headerColor, setHeaderColor] = useState("#065f46");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [rowCount, setRowCount] = useState(30);
  const [selectedFields, setSelectedFields] = useState<string[]>([...fiche.pdfFields]);
  const [logoData, setLogoData] = useState<string | null>(null);
  const [logoMimeType, setLogoMimeType] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load saved preferences
  useEffect(() => {
    fetch(`/api/pdf-preferences?slug=${fiche.slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.preferences) {
          const p = data.preferences;
          if (p.restaurantName) setRestaurantName(p.restaurantName);
          if (p.headerColor) setHeaderColor(p.headerColor);
          if (p.orientation) setOrientation(p.orientation);
          if (p.rowCount) setRowCount(p.rowCount);
          if (p.selectedFields) setSelectedFields(p.selectedFields);
          if (p.logoBase64) {
            setLogoData(p.logoBase64);
            setLogoMimeType(p.logoMimeType);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [fiche.slug]);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/pdf-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ficheSlug: fiche.slug,
          restaurantName,
          logoBase64: logoData,
          logoMimeType,
          headerColor,
          orientation,
          rowCount,
          selectedFields,
        }),
      });

      if (!res.ok) throw new Error("Erreur");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fiche-haccp-${fiche.slug}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors de la génération du PDF.");
    }
    setDownloading(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/pdf-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ficheSlug: fiche.slug,
          restaurantName,
          logoBase64: logoData,
          logoMimeType,
          headerColor,
          orientation,
          rowCount,
          selectedFields,
        }),
      });

      if (!res.ok) throw new Error("Erreur");
    } catch {
      alert("Erreur lors de la sauvegarde.");
    }
    setSaving(false);
  }

  function handleLogoChange(data: string | null, mimeType: string | null) {
    setLogoData(data);
    setLogoMimeType(mimeType);
  }

  if (!loaded) {
    return (
      <div className="text-center py-12 text-gray-500">
        Chargement...
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-lg font-bold mb-4">Personnalisation</h2>
          <PdfBuilderSettings
            restaurantName={restaurantName}
            onRestaurantNameChange={setRestaurantName}
            headerColor={headerColor}
            onHeaderColorChange={setHeaderColor}
            orientation={orientation}
            onOrientationChange={setOrientation}
            rowCount={rowCount}
            onRowCountChange={setRowCount}
            allFields={fiche.pdfFields}
            selectedFields={selectedFields}
            onSelectedFieldsChange={setSelectedFields}
            logoPreview={logoData}
            onLogoChange={handleLogoChange}
          />
        </div>

        {/* Preview */}
        <div>
          <PdfBuilderPreview
            ficheTitle={fiche.shortTitle}
            restaurantName={restaurantName}
            headerColor={headerColor}
            orientation={orientation}
            rowCount={rowCount}
            selectedFields={selectedFields}
            logoPreview={logoData}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {downloading ? "Génération..." : "Télécharger le PDF"}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder mes préférences"}
        </button>
      </div>
    </div>
  );
}
