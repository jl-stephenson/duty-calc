"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PDFPreviewPage() {
  const params = useSearchParams();
  const pdfUrlParam = params.get("pdfUrl");

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfUrlParam) {
      setPdfUrl(pdfUrlParam);
    }
  }, [pdfUrlParam]);

  if (!pdfUrl) {
    return <p>Error generating PDF.</p>;
  }

  return (
    <div>
      <h2>PDF Preview</h2>
      <p>
        PDF generated successfully. You can view it below or open in a new tab.
      </p>

      <iframe src={pdfUrl} width="100%" height="800px" />

      <div>
        <Link href={pdfUrl} target="_blank">
          Open PDF in new tab
        </Link>

        <a href={pdfUrl} download="EX606-complete.pdf">
          Download PDF
        </a>
      </div>

      <Link href="/guest-return/review">Back to Review</Link>
    </div>
  );
}
