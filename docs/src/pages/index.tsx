import React, {ReactNode, useState, useEffect, useRef} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { 
  ArrowRight, 
  Github, 
  Zap, 
  Shield, 
  Smartphone, 
  BarChart3, 
  Users, 
  CreditCard,
  TrendingUp,
  Globe,
  Sparkles,
  CheckCircle,
  Star,
  Play,
  Download,
  ExternalLink,
  Brain,
  Database,
  Lock,
  Rocket,
  Target,
  Award,
  Code,
  Layers,
  Cpu,
  Wifi,
  Eye,
  Heart,
  Infinity,
  Lightbulb,
  MousePointer,
  Palette,
  PieChart,
  Settings,
  Terminal,
  Timer,
  Workflow,
  FileText
} from 'lucide-react';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
      return () => hero.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <header ref={heroRef} className={clsx('hero hero--primary', styles.heroBanner)}>
      {/* Animated Background Elements */}
      <div className={styles.heroBackground}>
        <div className={styles.floatingOrbs}>
          <div className={clsx(styles.orb, styles.orb1)} style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}></div>
          <div className={clsx(styles.orb, styles.orb2)} style={{
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
          }}></div>
          <div className={clsx(styles.orb, styles.orb3)} style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * -10}px)`
          }}></div>
        </div>
        
        {/* Grid Pattern */}
        <div className={styles.gridPattern}></div>
        
        {/* Gradient Overlay */}
        <div className={styles.gradientOverlay}></div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col col--6">
            <div className={styles.heroContent}>
              {/* Animated Badge */}
              <div className={styles.heroBadge}>
                <div className={styles.badgeGlow}></div>
                <Brain className={styles.sparkleIcon} />
                <span>AI-Powered Finance</span>
                <div className={styles.badgeParticles}>
                  <div className={styles.particle}></div>
                  <div className={styles.particle}></div>
                  <div className={styles.particle}></div>
                </div>
              </div>
              
              {/* Main Title with Typewriter Effect */}
              <Heading as="h1" className={styles.heroTitle}>
                <span className={styles.titleLine1}>Next-Gen</span>
                <span className={styles.titleLine2}>Financial Management</span>
                <span className={styles.titleLine3}>for WordPress</span>
              </Heading>
              
              {/* Enhanced Subtitle */}
              <p className={styles.heroSubtitle}>
                Experience the future of personal finance with Pika's AI-driven insights, 
                modern PWA interface, and enterprise-grade security. Built for WordPress 6.0+ 
                with React 19 and PHP 8.1+.
              </p>
              
              {/* Enhanced CTA Buttons */}
              <div className={styles.heroButtons}>
                <Link className={clsx(styles.ctaButton, styles.primaryButton)} to="/docs">
                  <div className={styles.buttonGlow}></div>
                  <Rocket className={styles.buttonIcon} />
                  <span>Launch Pika</span>
                  <ArrowRight className={styles.buttonArrow} />
                </Link>
                <Link className={clsx(styles.ctaButton, styles.secondaryButton)} to="https://github.com/e-labInnovations/pika">
                  <Github className={styles.buttonIcon} />
                  <span>View Source</span>
                  <ExternalLink className={styles.buttonArrow} />
                </Link>
              </div>
              
              {/* Enhanced Tech Badges */}
              <div className={styles.heroBadges}>
                <div className={styles.badgeContainer}>
                  <div className={styles.badgeItem}>
                    <div className={styles.badgeIconWrapper}>
                      <Globe className={styles.badgeIcon} />
                    </div>
                    <span>WordPress 6.0+</span>
                  </div>
                  <div className={styles.badgeItem}>
                    <div className={styles.badgeIconWrapper}>
                      <Zap className={styles.badgeIcon} />
                    </div>
                    <span>PHP 8.1+</span>
                  </div>
                  <div className={styles.badgeItem}>
                    <div className={styles.badgeIconWrapper}>
                      <TrendingUp className={styles.badgeIcon} />
                    </div>
                    <span>React 19.1.0</span>
                  </div>
                  <div className={styles.badgeItem}>
                    <div className={styles.badgeIconWrapper}>
                      <Smartphone className={styles.badgeIcon} />
                    </div>
                    <span>PWA Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col col--6">
            <div className={styles.heroImage}>
              {/* Floating Elements */}
              <div className={styles.floatingElements}>
                <div className={clsx(styles.floatingElement, styles.element1)}>
                  <Database className={styles.floatingIcon} />
                </div>
                <div className={clsx(styles.floatingElement, styles.element2)}>
                  <Shield className={styles.floatingIcon} />
                </div>
                <div className={clsx(styles.floatingElement, styles.element3)}>
                  <Brain className={styles.floatingIcon} />
                </div>
              </div>
              
              {/* Main Screenshot with 3D Effect */}
              <div className={styles.screenshotContainer}>
                <div className={styles.screenshotGlow}></div>
                <img 
                  src="/img/screenshots/ss_1.png" 
                  alt="Pika Dashboard" 
                  className={styles.heroScreenshot}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ScreenshotsSlider() {
  const screenshots = [
    { id: 1, src: '/img/screenshots/ss_1.png', title: 'Dashboard Overview', description: 'Main financial dashboard with key metrics' },
    { id: 2, src: '/img/screenshots/ss_2.png', title: 'Transaction Management', description: 'Easy transaction entry and categorization' },
    { id: 3, src: '/img/screenshots/ss_3.png', title: 'Category Organization', description: 'Smart category management system' },
    { id: 4, src: '/img/screenshots/ss_4.png', title: 'Account Overview', description: 'Multi-account financial tracking' },
    { id: 5, src: '/img/screenshots/ss_5.png', title: 'Analytics & Reports', description: 'Comprehensive financial insights' },
    { id: 6, src: '/img/screenshots/ss_6.png', title: 'Mobile Interface', description: 'Responsive PWA design' },
    { id: 7, src: '/img/screenshots/ss_7.png', title: 'Settings & Preferences', description: 'Customizable user preferences' },
    { id: 8, src: '/img/screenshots/ss_8.png', title: 'AI Features', description: 'Smart categorization and insights' },
    { id: 9, src: '/img/screenshots/ss_9.png', title: 'People Management', description: 'Contact and relationship tracking' },
    { id: 10, src: '/img/screenshots/ss_10.png', title: 'Tag System', description: 'Flexible transaction tagging' },
    { id: 11, src: '/img/screenshots/ss_11.png', title: 'Budget Tracking', description: 'Financial goal monitoring' },
    { id: 12, src: '/img/screenshots/ss_12.png', title: 'Export Options', description: 'Data portability features' },
    { id: 13, src: '/img/screenshots/ss_13.png', title: 'Security Features', description: 'Advanced security measures' },
    { id: 14, src: '/img/screenshots/ss_14.png', title: 'Integration Hub', description: 'Third-party integrations' },
    { id: 15, src: '/img/screenshots/ss_15.png', title: 'Help & Support', description: 'Comprehensive documentation' },
    { id: 16, src: '/img/screenshots/ss_16.png', title: 'Advanced Analytics', description: 'Deep financial insights' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, screenshots.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className={styles.screenshotsSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>See Pika in Action</h2>
          <p>Explore the powerful features through our interactive screenshot gallery</p>
        </div>
        
        <div className={styles.sliderContainer}>
          <div className={styles.sliderWrapper}>
            <button 
              className={clsx(styles.sliderButton, styles.prevButton)} 
              onClick={prevSlide}
              aria-label="Previous screenshot"
            >
              <ArrowRight className={styles.arrowIcon} />
            </button>
            
            <div className={styles.sliderContent}>
              <img 
                src={screenshots[currentSlide].src} 
                alt={screenshots[currentSlide].title}
                className={styles.sliderImage}
              />
              <div className={styles.slideInfo}>
                <h3>{screenshots[currentSlide].title}</h3>
                <p>{screenshots[currentSlide].description}</p>
                <span className={styles.slideCounter}>
                  {currentSlide + 1} / {screenshots.length}
                </span>
              </div>
            </div>
            
            <button 
              className={clsx(styles.sliderButton, styles.nextButton)} 
              onClick={nextSlide}
              aria-label="Next screenshot"
            >
              <ArrowRight className={styles.arrowIcon} />
            </button>
          </div>
          
          <div className={styles.sliderDots}>
            {screenshots.map((_, index) => (
              <button
                key={index}
                className={clsx(styles.dot, { [styles.activeDot]: index === currentSlide })}
                onClick={() => goToSlide(index)}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Brain className={styles.featureIcon} />,
      title: "AI-Powered Intelligence",
      description: "Gemini AI integration for smart categorization, insights, and financial recommendations",
      color: "#8B5CF6",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)"
    },
    {
      icon: <Shield className={styles.featureIcon} />,
      title: "Privacy-First Security",
      description: "WordPress Application Passwords and HTTP-only cookies",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)"
    },
    {
      icon: <Smartphone className={styles.featureIcon} />,
      title: "Progressive Web App",
      description: "Install as native app with offline capabilities and responsive design",
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
    },
    {
      icon: <BarChart3 className={styles.featureIcon} />,
      title: "Advanced Analytics",
      description: "Monthly summaries, weekly expenses, and comprehensive financial insights",
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
    },
    {
      icon: <Users className={styles.featureIcon} />,
      title: "People Management",
      description: "Track transactions with contacts and manage relationships effectively",
      color: "#EF4444",
      gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
    },
    {
      icon: <Database className={styles.featureIcon} />,
      title: "Multi-Account System",
      description: "Manage multiple bank accounts, credit cards, and investment portfolios",
      color: "#06B6D4",
      gradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)"
    },
    {
      icon: <Layers className={styles.featureIcon} />,
      title: "Categories & Tags",
      description: "Organize transactions with customizable categories and flexible tagging system",
      color: "#8B5CF6",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
    },
    {
      icon: <FileText className={styles.featureIcon} />,
      title: "File Attachments",
      description: "Upload receipts, documents, and supporting files for complete record keeping",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #047857 100%)"
    },
    {
      icon: <Workflow className={styles.featureIcon} />,
      title: "REST API",
      description: "Full REST API for integrations, automation, and third-party connections",
      color: "#F97316",
      gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)"
    }
  ];

  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <Star className={styles.badgeIcon} />
            <span>Core Features</span>
          </div>
          <h2>Powerful Features for Modern Finance</h2>
          <p>Built with cutting-edge technology to deliver the most comprehensive financial management experience</p>
        </div>
        
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={clsx(styles.featureCard, styles.animateOnScroll)} data-delay={index * 100}>
              <div className={styles.featureCardInner}>
                <div className={styles.featureIconWrapper} style={{ background: feature.gradient }}>
                  <div className={styles.iconGlow} style={{ background: feature.gradient }}></div>
                  {feature.icon}
                </div>
                <div className={styles.featureContent}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                <div className={styles.featureHoverEffect}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  const technologies = [
    { 
      name: "WordPress 6.0+", 
      icon: <Globe className={styles.techIcon} />, 
      color: "#21759B",
      description: "Built for WordPress ecosystem",
      gradient: "linear-gradient(135deg, #21759B 0%, #1E5F8B 100%)"
    },
    { 
      name: "PHP 8.1+", 
      icon: <Code className={styles.techIcon} />, 
      color: "#777BB4",
      description: "Modern PHP with type safety",
      gradient: "linear-gradient(135deg, #777BB4 0%, #6B5B95 100%)"
    },
    { 
      name: "React 19.1.0", 
      icon: <TrendingUp className={styles.techIcon} />, 
      color: "#61DAFB",
      description: "Latest React with concurrent features",
      gradient: "linear-gradient(135deg, #61DAFB 0%, #21D4FD 100%)"
    },
    { 
      name: "TypeScript 5.8.3", 
      icon: <Terminal className={styles.techIcon} />, 
      color: "#3178C6",
      description: "Type-safe development",
      gradient: "linear-gradient(135deg, #3178C6 0%, #2563EB 100%)"
    },
    { 
      name: "Vite 6.3.5", 
      icon: <Zap className={styles.techIcon} />, 
      color: "#646CFF",
      description: "Lightning-fast build tool",
      gradient: "linear-gradient(135deg, #646CFF 0%, #5A67D8 100%)"
    },
    { 
      name: "Tailwind CSS 4.1.8", 
      icon: <Palette className={styles.techIcon} />, 
      color: "#38B2AC",
      description: "Utility-first CSS framework",
      gradient: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)"
    },
    { 
      name: "PWA Ready", 
      icon: <Smartphone className={styles.techIcon} />, 
      color: "#5A0FC8",
      description: "Self-hosted Progressive Web App",
      gradient: "linear-gradient(135deg, #5A0FC8 0%, #4C1D95 100%)"
    },
    { 
      name: "Gemini AI", 
      icon: <Brain className={styles.techIcon} />, 
      color: "#FF6B35",
      description: "Google's advanced AI integration",
      gradient: "linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)"
    },
    { 
      name: "REST API", 
      icon: <Workflow className={styles.techIcon} />, 
      color: "#FF6B6B",
      description: "Self-hosted RESTful API",
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #E53E3E 100%)"
    }
  ];

  return (
    <section className={styles.techStackSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <Cpu className={styles.badgeIcon} />
            <span>Technology Stack</span>
          </div>
          <h2>Built with Cutting-Edge Technology</h2>
          <p>Leveraging the latest and greatest technologies for optimal performance and developer experience</p>
        </div>
        
        <div className={styles.techGrid}>
          {technologies.map((tech, index) => (
            <div key={index} className={clsx(styles.techCard, styles.animateOnScroll)} data-delay={index * 100}>
              <div className={styles.techCardInner}>
                <div className={styles.techIconWrapper} style={{ background: tech.gradient }}>
                  <div className={styles.techGlow} style={{ background: tech.gradient }}></div>
                  {tech.icon}
                </div>
                <div className={styles.techContent}>
                  <h3>{tech.name}</h3>
                  <p>{tech.description}</p>
                </div>
                <div className={styles.techHoverEffect}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const [counters, setCounters] = useState([0, 0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLElement>(null);

  const stats = [
    { 
      icon: <CheckCircle className={styles.statIcon} />, 
      number: 100, 
      suffix: "%", 
      label: "WordPress Native", 
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)"
    },
    { 
      icon: <Smartphone className={styles.statIcon} />, 
      number: 1, 
      suffix: "PWA", 
      label: "Progressive Web App", 
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
    },
    { 
      icon: <Brain className={styles.statIcon} />, 
      number: 1, 
      suffix: "AI", 
      label: "Gemini Powered", 
      color: "#8B5CF6",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
    },
    { 
      icon: <Github className={styles.statIcon} />, 
      number: 1, 
      suffix: "Open", 
      label: "Source Project", 
      color: "#1F2937",
      gradient: "linear-gradient(135deg, #1F2937 0%, #111827 100%)"
    },
    { 
      icon: <Shield className={styles.statIcon} />, 
      number: 1, 
      suffix: "Privacy", 
      label: "First Solution", 
      color: "#EF4444",
      gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Animate counters
          stats.forEach((stat, index) => {
            const duration = 2000;
            const steps = 60;
            const increment = stat.number / steps;
            let current = 0;
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.number) {
                current = stat.number;
                clearInterval(timer);
              }
              setCounters(prev => {
                const newCounters = [...prev];
                newCounters[index] = Math.floor(current);
                return newCounters;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, stats]);

  return (
    <section ref={statsRef} className={styles.statsSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <Target className={styles.badgeIcon} />
            <span>Key Stats</span>
          </div>
          <h2>Built for Excellence</h2>
          <p>Numbers that speak for themselves</p>
        </div>
        
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={clsx(styles.statCard, styles.animateOnScroll)} data-delay={index * 150}>
              <div className={styles.statCardInner}>
                <div className={styles.statIconWrapper} style={{ background: stat.gradient }}>
                  <div className={styles.statGlow} style={{ background: stat.gradient }}></div>
                  {stat.icon}
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>
                    {counters[index]}{stat.suffix}
                  </div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
                <div className={styles.statHoverEffect}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaBackground}>
        <div className={styles.ctaOrbs}>
          <div className={clsx(styles.ctaOrb, styles.ctaOrb1)}></div>
          <div className={clsx(styles.ctaOrb, styles.ctaOrb2)}></div>
          <div className={clsx(styles.ctaOrb, styles.ctaOrb3)}></div>
        </div>
        <div className={styles.ctaGrid}></div>
      </div>
      
      <div className="container">
        <div className={styles.ctaContent}>
          <div className={styles.ctaInfo}>
            <div className={styles.ctaBadge}>
              <Rocket className={styles.badgeIcon} />
              <span>Ready to Launch?</span>
            </div>
            
            <h2>Transform Your Financial Management Today</h2>
            <p>
              Join the future of self-hosted financial management. Experience AI-powered insights, 
              modern PWA interface, and privacy-first security. Built by developers, for developers.
            </p>
            
            <div className={styles.ctaButtons}>
              <Link className={clsx(styles.ctaButton, styles.primaryButton)} to="/docs">
                <div className={styles.buttonGlow}></div>
                <Rocket className={styles.buttonIcon} />
                <span>Get Started Free</span>
                <ArrowRight className={styles.buttonArrow} />
              </Link>
              <Link className={clsx(styles.ctaButton, styles.secondaryButton)} to="https://github.com/e-labInnovations/pika">
                <Github className={styles.buttonIcon} />
                <span>View on GitHub</span>
                <ExternalLink className={styles.buttonArrow} />
              </Link>
            </div>
            
            <div className={styles.ctaFeatures}>
              <div className={styles.ctaFeature}>
                <div className={styles.featureIcon}>
                  <CheckCircle className={styles.checkIcon} />
                </div>
                <span>100% Free & Open Source</span>
              </div>
              <div className={styles.ctaFeature}>
                <div className={styles.featureIcon}>
                  <CheckCircle className={styles.checkIcon} />
                </div>
                <span>WordPress 6.0+ Compatible</span>
              </div>
              <div className={styles.ctaFeature}>
                <div className={styles.featureIcon}>
                  <CheckCircle className={styles.checkIcon} />
                </div>
                <span>Privacy-First Security</span>
              </div>
              <div className={styles.ctaFeature}>
                <div className={styles.featureIcon}>
                  <CheckCircle className={styles.checkIcon} />
                </div>
                <span>AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  
  useEffect(() => {
    // Make navbar transparent/solid on scroll
    const navbar = document.querySelector('.navbar') as HTMLElement;
    navbar.classList.add('home-navbar');
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (navbar) {
        if (currentScrollY > 100) {
          // Make navbar solid when scrolled down
          navbar.style.backgroundColor = 'var(--ifm-navbar-background-color)';
          navbar.style.backdropFilter = 'blur(10px)';
          navbar.style.borderBottom = '1px solid var(--ifm-color-emphasis-200)';
          navbar.style.transition = 'all 0.3s ease-in-out';
        } else {
          // Make navbar transparent when at top
          navbar.style.backgroundColor = 'transparent';
          navbar.style.backdropFilter = 'none';
          navbar.style.borderBottom = 'none';
          navbar.style.transition = 'all 0.3s ease-in-out';
        }
      }
      
      lastScrollY = currentScrollY;
    };

    // Initially make navbar transparent
    if (navbar) {
      navbar.style.backgroundColor = 'transparent';
      navbar.style.backdropFilter = 'none';
      navbar.style.borderBottom = 'none';
      navbar.style.transition = 'all 0.3s ease-in-out';
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Enhanced Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add(styles.animateIn);
          }, parseInt(delay.toString()));
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(`.${styles.animateOnScroll}`);
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <Layout
      title={`${siteConfig.title} - Next-Gen WordPress Financial Management`}
      description="AI-powered personal finance and expense tracking plugin for WordPress. Modern PWA interface with Gemini AI integration, enterprise-grade security, and comprehensive analytics."
    >
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
