"use client";

interface PdfBuilderPreviewProps {
  ficheTitle: string;
  restaurantName: string;
  headerColor: string;
  orientation: "portrait" | "landscape";
  rowCount: number;
  selectedFields: string[];
  logoPreview: string | null;
}

export function PdfBuilderPreview({
  ficheTitle,
  restaurantName,
  headerColor,
  orientation,
  rowCount,
  selectedFields,
  logoPreview,
}: PdfBuilderPreviewProps) {
  const isLandscape = orientation === "landscape";
  const aspectRatio = isLandscape ? "1.414 / 1" : "1 / 1.414";
  const displayRows = Math.min(rowCount, isLandscape ? 12 : 20);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-medium">
        Aperçu ({isLandscape ? "Paysage" : "Portrait"})
      </div>
      <div className="p-4">
        <div
          className="mx-auto border border-gray-300 shadow-sm overflow-hidden"
          style={{
            aspectRatio,
            maxWidth: isLandscape ? "100%" : "320px",
            fontSize: isLandscape ? "6px" : "7px",
          }}
        >
          {/* Header */}
          <div
            className="px-3 py-2 flex items-center gap-2"
            style={{ backgroundColor: headerColor }}
          >
            {logoPreview && (
              <img
                src={logoPreview}
                alt=""
                className="h-5 w-auto object-contain rounded-sm"
                style={{ maxWidth: "40px" }}
              />
            )}
            <div className="min-w-0">
              <div className="text-white font-bold truncate" style={{ fontSize: "8px" }}>
                {restaurantName
                  ? `${restaurantName} — ${ficheTitle}`
                  : ficheTitle}
              </div>
              <div className="text-white/60 truncate" style={{ fontSize: "5px" }}>
                fiche-haccp.fr
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="px-2 py-1">
            <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
              <thead>
                <tr>
                  {selectedFields.map((field, i) => (
                    <th
                      key={i}
                      className="text-white text-left px-1 py-0.5 truncate"
                      style={{
                        backgroundColor: headerColor,
                        fontSize: "5px",
                        fontWeight: 600,
                      }}
                    >
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: displayRows }).map((_, r) => (
                  <tr key={r}>
                    {selectedFields.map((_, c) => (
                      <td
                        key={c}
                        className="border-b px-1"
                        style={{
                          borderColor: "#e5e5e5",
                          backgroundColor:
                            r % 2 === 0 ? "#fff" : "#fafafa",
                          height: isLandscape ? "10px" : "12px",
                        }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className="px-3 py-1 mt-auto flex justify-between items-center"
            style={{
              backgroundColor: headerColor,
              opacity: 0.85,
              fontSize: "4px",
            }}
          >
            <span className="text-white">fiche-haccp.fr</span>
            <span className="text-white">
              {new Date().toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
