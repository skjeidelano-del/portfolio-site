import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

export default function FlipbookModal({ isOpen, onClose, pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [pageHeight, setPageHeight] = useState(600);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    // Compute 75vh for PDF height
    const calculateHeight = () => setPageHeight(window.innerHeight * 0.75);
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  // Bulletproof manual keyboard listener instead of Swiper's built-in (which requires focus)
  useEffect(() => {
    if (!isOpen || !swiperInstance) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') swiperInstance.slideNext();
      if (e.key === 'ArrowLeft') swiperInstance.slidePrev();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, swiperInstance]);

  const forceSwiperUpdate = () => {
    if (swiperInstance) {
      setTimeout(() => {
        swiperInstance.update();
        window.dispatchEvent(new Event('resize'));
      }, 100);
      setTimeout(() => {
        swiperInstance.update();
      }, 500); // secondary fallback update
    }
  };

  if (!isOpen) return null;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setErrorMsg(null);
  }

  function onDocumentLoadError(error) {
    setErrorMsg(error.message);
  }

  return (
    <div className="flipbook-modal">
      <button className="close-btn" onClick={onClose}><X size={40} color="#000"/></button>
      
      <div className="flipbook-container">
        {errorMsg ? (
          <div style={{ color: 'red', fontSize: '1.2rem', backgroundColor: 'white', padding: '2rem' }}>
            Failed to load PDF: {errorMsg}
          </div>
        ) : (
          <Document
            file={pdfUrl}
            options={options}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div style={{color: '#000', fontSize: '1.5rem'}}>Loading Portfolio...</div>}
            className="pdf-document"
          >
            {numPages && (
              <Swiper
                onSwiper={setSwiperInstance}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                spaceBetween={20} // Reduced gap since scaling creates natural space
                mousewheel={true}
                keyboard={{ enabled: false }}
                pagination={{ clickable: true }}
                speed={700}
                observer={true}
                observeParents={true}
                observeSlideChildren={true}
                watchSlidesProgress={true}
                navigation={true}
                modules={[Navigation, Pagination, Keyboard, Mousewheel]}
                className="mySwiper"
                style={{ width: '100vw' }} // Force swiper to fill screen explicitly
              >
                {[...Array(numPages).keys()].map((pNum) => (
                  <SwiperSlide 
                    key={pNum} 
                    className="pdf-slide" 
                    style={{ width: 'max-content', display: 'flex', justifyContent: 'center' }}
                  >
                    <div className="slide-inner" style={{ width: 'max-content' }}>
                      <Page 
                        pageNumber={pNum + 1} 
                        height={pageHeight}
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        onLoadSuccess={forceSwiperUpdate}
                        loading={<div style={{height: pageHeight, width: pageHeight * 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>Loading...</div>}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Document>
        )}
      </div>
      
      {/* Keyboard Hint */}
      <div style={{ position: 'absolute', bottom: '2rem', color: '#555', fontSize: '0.85rem', letterSpacing: '0.05em', zIndex: 1010, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
        USE KEYBOARD <ArrowLeft size={16} color="#555"/> <ArrowRight size={16} color="#555"/> TO NAVIGATE
      </div>
    </div>
  );
}
