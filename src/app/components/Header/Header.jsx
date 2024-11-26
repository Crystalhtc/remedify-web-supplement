"use client";
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(''); 
    const [locked, setLocked] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = (section) => {
        setActiveSection(section);
        setLocked(true);
        setIsMenuOpen(false);
        setTimeout(() => {
            setLocked(false);
        }, 500);
    };

    useEffect(() => {
        const sections = document.querySelectorAll("section");
    
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !locked) {
                        const id = `#${entry.target.id}`;
                        if (activeSection !== id) {
                            setActiveSection(id); 
                        }
                    }
                });
            },
            { threshold: 0.2 }
        );
    
        sections.forEach((section) => observer.observe(section));
        
        return () => observer.disconnect();
    }, [activeSection, locked]);

    return (
        <nav className={styles.nav}>
            <div className={styles.logoContainer}>
                <a href="/" onClick={() => handleLinkClick('')} className={activeSection === '#features' ? styles.activeLink : ''}>
                    <img src="/logo.svg" alt="Remedify logo" className={styles.logo} />
                </a>
            </div>

            <div className={styles.pageTitleContainer}>
                <h1 className={styles.pageTitle}>Medication Database</h1>
            </div>
                <a 
                    href="../about" 
                    onClick={() => handleLinkClick('')} 
                    className={`${styles.navLink} ${activeSection === '#features' ? styles.activeLink : ''}`}
                >
                    About Us
                </a>
        </nav>
    );
}