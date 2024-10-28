import Link from "next/link";

type PDFPreviewProps = {
  pdfUrl: string;
};

export function PDFPreview({ pdfUrl }: PDFPreviewProps) {
  return (
    <div className="space-y-4">
      <p>
        PDF generated successfully. You can view it below or open in a new tab.
      </p>
      <iframe src={pdfUrl} width="100%" height="800px" />
      <Link href={pdfUrl} target="_blank">
        <button>Open PDF in new tab</button>
      </Link>
    </div>
  );
}
