import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

export default function PdfThumbnail({ file }) {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="pdf-thumbnail-wrapper" style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative', 
      overflow: 'hidden',
      backgroundColor: '#222'
    }}>
      {error ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666', fontSize: '0.875rem' }}>
          Cover Unavailable
        </div>
      ) : (
        <Document
          file={file}
          options={options}
          onLoadSuccess={() => setIsLoaded(true)}
          onLoadError={() => setError(true)}
          loading={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>Loading Cover...</div>}
        >
          <Page 
            pageNumber={1} 
            width={600} // Render at a reasonable resolution for thumbnails
            renderTextLayer={false} 
            renderAnnotationLayer={false}
            className="thumbnail-page"
          />
        </Document>
      )}
    </div>
  );
}
