"use client";

import { useRef } from "react";

interface PdfBuilderSettingsProps {
  restaurantName: string;
  onRestaurantNameChange: (name: string) => void;
  headerColor: string;
  onHeaderColorChange: (color: string) => void;
  orientation: "portrait" | "landscape";
  onOrientationChange: (o: "portrait" | "landscape") => void;
  rowCount: number;
  onRowCountChange: (count: number) => void;
  allFields: string[];
  selectedFields: string[];
  onSelectedFieldsChange: (fields: string[]) => void;
  logoPreview: string | null;
  onLogoChange: (data: string | null, mimeType: string | null) => void;
}

const COLOR_PRESETS = [
  { label: "Vert", value: "#065f46" },
  { label: "Bleu", value: "#1e40af" },
  { label: "Rouge", value: "#991b1b" },
  { label: "Gris", value: "#374151" },
  { label: "Violet", value: "#5b21b6" },
  { label: "Orange", value: "#9a3412" },
];

const ROW_OPTIONS = [15, 20, 25, 30, 35, 40];

export function PdfBuilderSettings({
  restaurantName,
  onRestaurantNameChange,
  headerColor,
  onHeaderColorChange,
  orientation,
  onOrientationChange,
  rowCount,
  onRowCountChange,
  allFields,
  selectedFields,
  onSelectedFieldsChange,
  logoPreview,
  onLogoChange,
}: PdfBuilderSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert("Le logo ne doit pas dépasser 500 Ko.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onLogoChange(result, file.type);
    };
    reader.readAsDataURL(file);
  }

  function handleFieldToggle(field: string) {
    if (selectedFields.includes(field)) {
      if (selectedFields.length <= 3) return;
      onSelectedFieldsChange(selectedFields.filter((f) => f !== field));
    } else {
      onSelectedFieldsChange([...selectedFields, field]);
    }
  }

  function handleSelectAll() {
    onSelectedFieldsChange([...allFields]);
  }

  return (
    <div className="space-y-6">
      {/* Restaurant info */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Informations restaurant
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Nom du restaurant
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => onRestaurantNameChange(e.target.value)}
              placeholder="Mon restaurant"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Logo</label>
            <div className="flex items-center gap-3">
              {logoPreview ? (
                <div className="flex items-center gap-2">
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-10 w-auto object-contain border border-gray-200 rounded"
                  />
                  <button
                    onClick={() => {
                      onLogoChange(null, null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Choisir un fichier
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">PNG ou JPG, 500 Ko max</p>
          </div>
        </div>
      </section>

      {/* Color */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Couleur</h3>
        <div className="flex items-center gap-3 mb-2">
          <input
            type="color"
            value={headerColor}
            onChange={(e) => onHeaderColorChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-300"
          />
          <span className="text-xs text-gray-500 font-mono">{headerColor}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onHeaderColorChange(preset.value)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                headerColor === preset.value
                  ? "border-gray-900 scale-110"
                  : "border-transparent hover:border-gray-300"
              }`}
              style={{ backgroundColor: preset.value }}
              title={preset.label}
            />
          ))}
        </div>
      </section>

      {/* Format */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Format</h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => onOrientationChange("portrait")}
            className={`border rounded-lg p-3 text-center text-xs transition-all ${
              orientation === "portrait"
                ? "border-primary bg-primary/5 text-primary font-semibold"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="w-6 h-8 border-2 rounded-sm mx-auto mb-1" style={{ borderColor: orientation === "portrait" ? headerColor : "#d1d5db" }} />
            Portrait
          </button>
          <button
            onClick={() => onOrientationChange("landscape")}
            className={`border rounded-lg p-3 text-center text-xs transition-all ${
              orientation === "landscape"
                ? "border-primary bg-primary/5 text-primary font-semibold"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="w-8 h-6 border-2 rounded-sm mx-auto mb-1" style={{ borderColor: orientation === "landscape" ? headerColor : "#d1d5db" }} />
            Paysage
          </button>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Nombre de lignes
          </label>
          <select
            value={rowCount}
            onChange={(e) => onRowCountChange(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {ROW_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} lignes
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Columns */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Colonnes ({selectedFields.length}/{allFields.length})
          </h3>
          {selectedFields.length < allFields.length && (
            <button
              onClick={handleSelectAll}
              className="text-xs text-primary hover:underline"
            >
              Tout cocher
            </button>
          )}
        </div>
        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {allFields.map((field) => {
            const checked = selectedFields.includes(field);
            const disabled = checked && selectedFields.length <= 3;
            return (
              <label
                key={field}
                className={`flex items-center gap-2 text-sm py-1 px-2 rounded cursor-pointer hover:bg-gray-50 ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => handleFieldToggle(field)}
                  className="rounded border-gray-300 text-primary focus:ring-primary/20"
                />
                <span className="text-gray-700 truncate">{field}</span>
              </label>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">3 colonnes minimum</p>
      </section>
    </div>
  );
}
