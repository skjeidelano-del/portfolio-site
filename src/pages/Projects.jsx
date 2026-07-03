import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsData } from '../data/projects';
import PdfThumbnail from '../components/PdfThumbnail';
import FlipbookModal from '../FlipbookModal';
import { useLanguage } from '../context/LanguageContext';

export default function Projects() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const location = useLocation();
  const { lang, toggleLang } = useLanguage();

  const isProjects = location.pathname === '/projects';

  const t = {
    EN: {
      home: 'Home',
      projects: 'Projects',
      selectedWorks: 'Selected Works'
    },
    ZH: {
      home: '首页',
      projects: '作品',
      selectedWorks: '精选作品'
    }
  }[lang];

  const openPortfolio = (pdfUrl) => setSelectedPdf(pdfUrl);
  const closePortfolio = () => setSelectedPdf(null);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <nav className="navbar">
        <div className="navbar-brand">ZHOU DAOYI</div>
        <div className="nav-links">
          <Link 
            to="/" 
            className="nav-link" 
            style={{ fontWeight: !isProjects ? '700' : '400', color: !isProjects ? '#111' : '#666' }}
          >
            {t.home}
          </Link>
          <Link 
            to="/projects" 
            className="nav-link"
            style={{ fontWeight: isProjects ? '700' : '400', color: isProjects ? '#111' : '#666' }}
          >
            {t.projects}
          </Link>
          <button 
            onClick={toggleLang}
            style={{ 
              background: 'none', 
              border: '1px solid #ddd', 
              borderRadius: '20px',
              padding: '4px 12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              marginLeft: '1rem',
              color: '#333'
            }}
          >
            {lang === 'EN' ? 'EN / 中' : '中 / EN'}
          </button>
        </div>
      </nav>

      <main className="container mb-huge" style={{ flex: 1, marginTop: '2rem' }}>
        <section id="projects">
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <h2>{t.selectedWorks}</h2>
          </div>
          
          <div className="projects-grid">
            {projectsData.map((project) => (
              <div key={project.id} className="project-card" style={{ cursor: 'pointer' }} onClick={() => openPortfolio(project.pdfFile)}>
                <div style={{ 
                  backgroundColor: '#fff', 
                  aspectRatio: '16/9', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  borderRadius: '4px'
                }}>
                  <PdfThumbnail file={project.pdfFile} />
                  
                  {/* Hover Overlay */}
                  <div className="project-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.3s ease',
                    color: 'white',
                    zIndex: 10
                  }}>
                    <span style={{ fontWeight: 600, letterSpacing: '1px' }}>{lang === 'EN' ? 'VIEW PROJECT' : '查看作品'}</span>
                  </div>
                </div>
                <div className="project-info" style={{ marginTop: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', lineHeight: 1.4 }}>
                    {lang === 'ZH' && project.titleZh ? project.titleZh : project.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>
                    {lang === 'ZH' && project.descriptionZh ? project.descriptionZh : project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <FlipbookModal 
        isOpen={!!selectedPdf} 
        onClose={closePortfolio} 
        pdfUrl={selectedPdf} 
      />
    </motion.div>
  );
}
