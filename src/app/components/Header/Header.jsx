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
            <div className={styles.navbarContainer}>
                <div className={styles.logoContainer}>
                    <a href="#header" onClick={() => handleLinkClick('#header')} className={activeSection === '#features' ? styles.activeLink : ''}>
                        <img src="/logo.svg" alt="Remedify logo" className={styles.logo} />
                    </a>
                </div>
                <div className={styles.hamburger} onClick={toggleMenu}>
                    <span className={styles.hamburgerBar}></span>
                    <span className={styles.hamburgerBar}></span>
                    <span className={styles.hamburgerBar}></span>
                </div>
            </div>
            
            <ul className={`${styles.navList} ${isMenuOpen ? styles.navListOpen : ''}`}>
                <li className={`${styles.navItem} ${styles.firstNavItem}`}>
                    <a 
                        href="#features" 
                        onClick={() => handleLinkClick('#features')} 
                        className={`${styles.navLink} ${activeSection === '#features' ? styles.activeLink : ''}`}
                    >
                        Features
                    </a>
                </li>
                <li className={styles.navItem}>
                    <a 
                        href="#audience" 
                        onClick={() => handleLinkClick('#audience')} 
                        className={`${styles.navLink} ${activeSection === '#audience' ? styles.activeLink : ''}`}
                    >
                        Who Remedify is For
                    </a>
                </li>
                <li className={`${styles.navItem} ${styles.lastNavItem}`}>
                    <a 
                        href="#team" 
                        onClick={() => handleLinkClick('#team')} 
                        className={`${styles.navLink} ${activeSection === '#team' ? styles.activeLink : ''}`}
                    >
                        Meet Remedify Team
                    </a>
                </li>
                <li className={`${styles.navItem} ${styles.lastNavItem}`}>
                    <a 
                        href="#blog" 
                        onClick={() => handleLinkClick('#blog')} 
                        className={`${styles.navLink} ${activeSection === '#blog' ? styles.activeLink : ''}`}
                    >
                        Blog
                    </a>
                </li>
            </ul>
        </nav>
    );
}