import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import UrbanPulseBackground from '../components/UrbanPulseBackground';

export default function Home() {
  const location = useLocation();
  const { lang, toggleLang } = useLanguage();

  const isHome = location.pathname === '/';

  const t = {
    EN: {
      projects: 'Projects',
      theme: 'The very pulse of the city',
      quote: '"The right to the city is far more than the simple right of access to what already exists: it is the right to change the city, the right to participate in making the city, and the right to appropriate the city\'s spaces for use."',
      emailLabel: 'Email: ',
      phoneLabel: 'Phone: ',
      resumeBtn: 'DOWNLOAD RESUME'
    },
    ZH: {
      projects: '作品',
      theme: '城市跳动的脉搏',
      quote: '“对城市的权利远不仅仅是享有既有城市资源的权利：它是改变城市的权利，是参与塑造城市的权利，更是为了使用而占用城市空间的权利。”',
      emailLabel: '邮箱：',
      phoneLabel: '电话：',
      resumeBtn: '下载完整简历'
    }
  }[lang];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}
    >
      <UrbanPulseBackground />
      
      <nav className="navbar" style={{ position: 'relative', zIndex: 10 }}>
        <div className="navbar-brand">ZHOU DAOYI</div>
        <div className="nav-links">
          <Link 
            to="/" 
            className="nav-link" 
            style={{ fontWeight: isHome ? '700' : '400', color: isHome ? '#111' : '#666' }}
          >
            {lang === 'EN' ? 'Home' : '首页'}
          </Link>
          <Link 
            to="/projects" 
            className="nav-link"
            style={{ fontWeight: !isHome ? '700' : '400', color: !isHome ? '#111' : '#666' }}
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

      {/* Reduced minHeight and simplified margin/padding to remove whitespace */}
      <main className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '4rem 5%', position: 'relative', zIndex: 10 }}>
        <section id="about" style={{ maxWidth: '800px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '12px' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',  
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '2rem'
          }}>
            {t.theme}
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', 
            lineHeight: 1.6, 
            color: '#555',
            fontWeight: 400,
            fontStyle: 'italic',
            marginBottom: '2.5rem'
          }}>
            {t.quote}
          </p>

          <a 
            href="/resume.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn"
            style={{ 
              display: 'inline-flex',
              padding: '0.75rem 2rem',
              backgroundColor: '#111',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              borderRadius: '30px',
              transition: 'background-color 0.3s',
              border: '1px solid #111'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#111'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#111'; e.currentTarget.style.color = '#fff'; }}
          >
            {t.resumeBtn}
          </a>
        </section>
      </main>

      {/* Sticky Footer */}
      <footer className="footer" style={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#000', 
        borderTop: '1px solid #333',
        padding: '1.5rem 5%',
        zIndex: 100,
        color: '#fff'
      }}>
        <div className="footer-text">© 2026 ZHOU DAOYI</div>
        <div className="nav-links" style={{ color: '#fff', fontSize: '0.9rem', gap: '2rem' }}>
          <span>{t.emailLabel}zhoudaoyi021120@163.com</span>
          <span>{t.phoneLabel}+86 19557070125</span>
        </div>
      </footer>
    </motion.div>
  );
}
