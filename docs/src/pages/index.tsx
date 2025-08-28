import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {useState, useEffect} from 'react';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <Heading as="h1" className="hero__title">
              WordPress Financial Management
            </Heading>
            <p className="hero__subtitle">
              Pika Finance is a comprehensive financial management solution for WordPress that helps users track income, expenses, transfers, and manage their financial data with a modern PWA interface.
            </p>
            <div className={styles.heroButtons}>
              <Link className="cta-button" to="/docs">
                Get Started →
              </Link>
              <Link className="cta-button cta-button-secondary" to="https://github.com/e-labInnovations/pika">
                View on GitHub
              </Link>
            </div>
            <div className={styles.heroBadges}>
              <span className={styles.badge}>WordPress 6.0+</span>
              <span className={styles.badge}>PHP 8.1+</span>
              <span className={styles.badge}>React 19.1.0</span>
              <span className={styles.badge}>PWA Ready</span>
            </div>
          </div>
          <div className="col col--6">
            <div className={styles.heroImage}>
              <img 
                src="/img/screenshots/ss_1.png" 
                alt="Pika Dashboard" 
                className="screenshot-showcase"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ScreenshotsSlider() {
  const screenshots = [
    { src: '/img/screenshots/ss_1.png', alt: 'Dashboard Overview', title: 'Dashboard Overview' },
    { src: '/img/screenshots/ss_2.png', alt: 'Transaction Management', title: 'Transaction Management' },
    { src: '/img/screenshots/ss_3.png', alt: 'Account Management', title: 'Account Management' },
    { src: '/img/screenshots/ss_4.png', alt: 'Analytics & Reports', title: 'Analytics & Reports' },
    { src: '/img/screenshots/ss_5.png', alt: 'Categories & Tags', title: 'Categories & Tags' },
    { src: '/img/screenshots/ss_6.png', alt: 'Settings & Preferences', title: 'Settings & Preferences' },
    { src: '/img/screenshots/ss_7.png', alt: 'People Management', title: 'People Management' },
    { src: '/img/screenshots/ss_8.png', alt: 'File Attachments', title: 'File Attachments' },
    { src: '/img/screenshots/ss_9.png', alt: 'AI Features', title: 'AI Features' },
    { src: '/img/screenshots/ss_10.png', alt: 'Mobile Interface', title: 'Mobile Interface' },
    { src: '/img/screenshots/ss_11.png', alt: 'Responsive Design', title: 'Responsive Design' },
    { src: '/img/screenshots/ss_12.png', alt: 'Dark Mode', title: 'Dark Mode' },
    { src: '/img/screenshots/ss_13.png', alt: 'Budget Management', title: 'Budget Management' },
    { src: '/img/screenshots/ss_14.png', alt: 'Financial Goals', title: 'Financial Goals' },
    { src: '/img/screenshots/ss_15.png', alt: 'Export & Reports', title: 'Export & Reports' },
    { src: '/img/screenshots/ss_16.png', alt: 'Advanced Analytics', title: 'Advanced Analytics' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [screenshots.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <section className={styles.screenshots}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">See Pika in Action</Heading>
          <p className="text--lg">
            Experience the beautiful, intuitive interface that makes financial management effortless on any device
          </p>
        </div>
        
        <div className={styles.sliderContainer}>
          <div className={styles.sliderWrapper}>
            <button className={styles.sliderButton} onClick={prevSlide} aria-label="Previous">
              ‹
            </button>
            
             <div className={styles.sliderContent}>
               <img 
                 src={screenshots[currentSlide].src} 
                 alt={screenshots[currentSlide].alt} 
                 className="screenshot-showcase"
               />
               <div className={styles.slideInfo}>
                 <h3>{screenshots[currentSlide].title}</h3>
                 <p>Experience Pika's intuitive interface on mobile and desktop</p>
               </div>
             </div>
            
            <button className={styles.sliderButton} onClick={nextSlide} aria-label="Next">
              ›
            </button>
          </div>
          
          <div className={styles.sliderDots}>
            {screenshots.map((_, index) => (
              <button
                key={index}
                className={clsx(styles.dot, { [styles.activeDot]: index === currentSlide })}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">Why Choose Pika?</Heading>
          <p className="text--lg">
            Built for WordPress with modern web technologies and AI-powered features
          </p>
        </div>
        
        <div className="row">
          <div className="col col--4">
            <div className="feature-card">
              <div className="text--center">
                <div className={styles.featureIcon}>📊</div>
                <Heading as="h3">Financial Tracking</Heading>
                <p>
                  Complete income, expense, and transfer management with real-time balance tracking across multiple accounts.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col col--4">
            <div className="feature-card">
              <div className="text--center">
                <div className={styles.featureIcon}>🏦</div>
                <Heading as="h3">Account Management</Heading>
                <p>
                  Manage multiple accounts including bank accounts, cash, investments, and loans with comprehensive balance tracking.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col col--4">
            <div className="feature-card">
              <div className="text--center">
                <div className={styles.featureIcon}>👥</div>
                <Heading as="h3">People Management</Heading>
                <p>
                  Track transactions with contacts and people, perfect for shared expenses and business accounting.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row margin-top--xl">
          <div className="col col--4">
            <div className="feature-card">
              <div className="text--center">
                <div className={styles.featureIcon}>🏷️</div>
                <Heading as="h3">Categories & Tags</Heading>
                <p>
                  Organize transactions with customizable categories and tags for better financial organization and reporting.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col col--4">
            <div className="feature-card">
              <div className="text--center">
                <div className={styles.featureIcon}>📱</div>
                <Heading as="h3">PWA Interface</Heading>
                <p>
                  Modern Progressive Web App that works seamlessly on mobile and desktop with offline capabilities.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col col--4">
            <div className="feature-card">
              <div className="text--center">
                <div className={styles.featureIcon}>🤖</div>
                <Heading as="h3">AI Features</Heading>
                <p>
                  Gemini AI integration for creating transactions, smart categorization, and intelligent financial insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  return (
    <section className={styles.techStack}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">Built with Modern Technology</Heading>
          <p className="text--lg">
            Pika combines the power of WordPress with cutting-edge web technologies
          </p>
        </div>
        
        <div className="row">
          <div className="col col--3">
            <div className={styles.techCard}>
              <div className={styles.techIcon}>🔧</div>
              <h4>WordPress</h4>
              <p>Plugin architecture with admin integration</p>
            </div>
          </div>
          <div className="col col--3">
            <div className={styles.techCard}>
              <div className={styles.techIcon}>⚡</div>
              <h4>PHP 8.1+</h4>
              <p>Modern backend with REST API</p>
            </div>
          </div>
          <div className="col col--3">
            <div className={styles.techCard}>
              <div className={styles.techIcon}>⚛️</div>
              <h4>React 19.1.0</h4>
              <p>Latest React with TypeScript</p>
            </div>
          </div>
          <div className="col col--3">
            <div className={styles.techCard}>
              <div className={styles.techIcon}>🎨</div>
              <h4>Tailwind CSS</h4>
              <p>Utility-first CSS framework</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="row">
          <div className="col col--3">
            <div className="stat-item">
              <div className="stat-number">WP</div>
              <div className="stat-label">Plugin</div>
            </div>
          </div>
          <div className="col col--3">
            <div className="stat-item">
              <div className="stat-number">PWA</div>
              <div className="stat-label">Ready</div>
            </div>
          </div>
          <div className="col col--3">
            <div className="stat-item">
              <div className="stat-number">AI</div>
              <div className="stat-label">Powered</div>
            </div>
          </div>
          <div className="col col--3">
            <div className="stat-item">
              <div className="stat-number">Open</div>
              <div className="stat-label">Source</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className="text--center">
          <Heading as="h2">Ready to Transform Your WordPress Site?</Heading>
          <p className="text--lg margin-bottom--xl">
            Add powerful financial management capabilities to your WordPress website with Pika
          </p>
          <div className={styles.ctaButtons}>
            <Link className="cta-button" to="/docs/installation">
              Install Pika →
            </Link>
            <Link className="cta-button cta-button-secondary" to="https://github.com/e-labInnovations/pika">
              View Source Code
            </Link>
          </div>
          <div className={styles.ctaInfo}>
            <p>Free • Open Source • GPL v2+ License</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Pika Finance - WordPress Financial Management Plugin"
      description="A comprehensive financial management solution for WordPress that helps users track income, expenses, transfers, and manage their financial data with a modern PWA interface.">
      <HomepageHeader />
      <main>
        <ScreenshotsSlider />
        <FeaturesSection />
        <TechStackSection />
        <StatsSection />
        <CTASection />
      </main>
    </Layout>
  );
}
