import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Play,
  Users,
  BarChart3,
  MessageCircle,
  Star,
  Brain,
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
  Check,
  ChevronDown,
  Pause,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Color palette: #184349, #202a42, #272829, #FFFFFF

const CoreCognitiveLogo = ({ scrolled }: { scrolled: boolean }) => (
  <Link to="/" className="flex items-center space-x-3">
    <div className="relative group">
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #184349 0%, #0f2027 100%)' }}
      >
        <Brain className="w-6 h-6 text-white" />
      </div>
    </div>
    <span className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-black' : 'text-gray-100'}`}>
      Core Cognitive
    </span>
  </Link>
);

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Experts', to: '/experts' },
  { name: 'Community', to: '/community' },
  { name: 'Resources', to: '/resources' },
  { name: 'About', to: '/about' },
];

const Navigation = ({ isMenuOpen, setIsMenuOpen }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
      style={{ 
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(6px)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <CoreCognitiveLogo scrolled={scrolled} />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <Link 
                key={item.name}
                to={item.to}
                className={`font-medium transition-colors duration-200 hover:opacity-80 text-gray-100 ${scrolled ? 'text-black' : 'text-gray-100'}`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/login"
              className={`px-6 py-2 transition-colors duration-200 hover:opacity-80 ${scrolled ? 'text-primary' : 'text-gray-100'}`}
            >
              Sign In
            </Link>
            <Link
              to="/get-started"
              className="px-10 py-3 text-white rounded-full transition-all duration-200 hover:shadow-lg transform hover:scale-105 bg-primary"
              
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg text-gray-100 transition-colors ${scrolled ? 'text-black' : 'text-gray-100'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden bg-white transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}>
          <div className="flex flex-col space-y-3 pt-4 p-10 border-t border-gray-200">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="py-2 transition-colors"
                style={{ color: '#272829' }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4">
              <Link
                to="/signin"
                className="text-left py-2"
                style={{ color: '#272829' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/get-started"
                className="px-6 py-3 text-white rounded-full text-center bg-primary"
                
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const VideoBackground = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Pause/play video when isPlaying changes
  React.useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="https://videos.pexels.com/video-files/6774633/6774633-uhd_2560_1440_30fps.mp4"
        autoPlay
        loop
        muted
        controls={false}
        playsInline
        style={{ zIndex: 0 }}
      />
      {/* Stronger dark overlay for better contrast */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(120deg, rgba(24, 43, 73, 0.92) 0%, rgba(32, 42, 66, 0.90) 100%)`,
          zIndex: 1,
          mixBlendMode: "multiply"
        }}
      />
      {/* Subtle gradient highlight overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.10) 0%, rgba(24,43,73,0.0) 70%)`,
          zIndex: 2
        }}
      />
      {/* Animated particles */}
      <div className="absolute inset-0 z-3 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30 animate-pulse"
            style={{
              backgroundColor: i % 2 === 0 ? '#fff' : '#b6c6d6',
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: (Math.random() * 3 + 2) + 's',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Growth', 'Healing', 'Wellness', 'Balance'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#182b49]">
      <VideoBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex w-full justify-center items-center">
          {/* Centered Content */}
          <div className="space-y-8 text-center w-full flex flex-col items-center py-10">
            <div className="space-y-4 w-full flex flex-col items-center">
              {/* Menu bar with high contrast */}
              <div
                className="inline-flex items-center px-4 py-2 rounded-full   mx-auto border-2 backdrop-blur-xs border-primary bg-gray-100"
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Mind Science & Personal Development
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-center" style={{ color: '#fff', textShadow: '0 2px 16px rgba(24,43,73,0.25)' }}>
                Your Journey to
                <div className="relative inline-block ml-3">
                  Growth
                </div>
                <br />
                Starts Here
              </h1>

              <p className="text-lg max-w-xl leading-relaxed text-center mx-auto" style={{ color: '#e5e7eb', textShadow: '0 1px 8px rgba(24,43,73,0.18)' }}>
                Connect with certified mental health experts, join supportive communities, and access AI-powered tools designed for your wellbeing and personal growth.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full">
              <Link
                to="/get-started"
                className="group text-white bg-primary px-8 py-4 rounded-full text-md font-semibold transform hover:bg-gray-100 hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/demo"
                className="flex items-center space-x-3 cursor-pointer group justify-center"
              >
                <div
                  className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all border"
                  style={{
                    borderColor: '#22c55e',
                  }}
                >
                  <Play size={18} className="ml-1 text-primary" fill="currentColor" />
                </div>
                <span
                  className="group-hover:opacity-80 transition-colors text-gray-100"
                >
                  Watch Demo
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center space-x-8 pt-8 w-full">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#fff' }}>10K+</div>
                <div className="text-sm" style={{ color: '#cbd5e1' }}>Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#fff' }}>500+</div>
                <div className="text-sm" style={{ color: '#cbd5e1' }}>Experts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#fff' }}>98%</div>
                <div className="text-sm" style={{ color: '#cbd5e1' }}>Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: <Users className="w-8 h-8 text-white" />,
    bg: '#184349',
    title: "Expert Therapists",
    desc: "Connect with licensed mental health professionals and certified coaches for personalized guidance."
  },
  {
    icon: <Brain className="w-8 h-8 text-white" />,
    bg: '#202a42',
    title: "AI-Powered Insights",
    desc: "Get personalized recommendations and track your mental health journey with intelligent analytics."
  },
  {
    icon: <Heart className="w-8 h-8 text-white" />,
    bg: '#ef4444',
    title: "Supportive Community",
    desc: "Join safe, moderated groups and connect with others on similar mental health journeys."
  }
];

const FeaturesSection = () => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#272829' }}>
          Complete Mental Health <span className='text-primary'>Support System</span>
        </h2>
        <p className="max-w-2xl mx-auto text-lg" style={{ color: '#6b7280' }}>
          Everything you need for your mental wellness journey in one integrated platform.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: feature.bg }}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: '#272829' }}>
              {feature.title}
            </h3>
            <p className="text-center leading-relaxed" style={{ color: '#6b7280' }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ServicesSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#272829' }}>
          How <span style={{ color: '#184349' }}>Core Cognitive</span> Works
        </h2>
        <p className="max-w-3xl mx-auto text-lg" style={{ color: '#6b7280' }}>
          Our platform connects you with professional mental health support through three pathways designed for your specific needs and comfort level.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              style={{ backgroundColor: '#184349' }}
            >
              <span className="text-white font-semibold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: '#272829' }}>Assessment & Matching</h3>
              <p style={{ color: '#6b7280' }}>Complete a comprehensive assessment to match with the right therapist and community groups.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              style={{ backgroundColor: '#184349' }}
            >
              <span className="text-white font-semibold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: '#272829' }}>Personalized Support</h3>
              <p style={{ color: '#6b7280' }}>Engage in one-on-one therapy sessions, group discussions, and AI-guided self-care activities.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              style={{ backgroundColor: '#184349' }}
            >
              <span className="text-white font-semibold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: '#272829' }}>Track Progress</h3>
              <p style={{ color: '#6b7280' }}>Monitor your mental health journey with detailed insights and celebrate your achievements.</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80"
            alt="Mental health session"
            className="w-full h-auto rounded-2xl shadow-xl"
          />
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{ background: 'linear-gradient(to top, rgba(39, 40, 41, 0.1), transparent)' }}
          ></div>
        </div>
      </div>
    </div>
  </section>
);

const TestimonialSection = () => (
  <section className="py-20" style={{ backgroundColor: '#f9fafb' }}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="inline-flex my-6 items-center px-4 py-2 rounded-full border mx-auto"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.4)', 
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" style={{ color: '#184349' }} />
                <span className="text-sm font-medium" style={{ color: '#272829' }}>
                  Testimonials
                </span>
              </div>
      <h2 className="text-3xl font-extrabold mb-4" style={{ color: '#272829' }}>
        Stories of <span className='text-primary'>Transformation</span>
      </h2>
      <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
          ))}
        </div>
        <blockquote className="text-lg mb-4 italic" style={{ color: '#6b7280' }}>
          "Core Cognitive helped me find the right therapist and connect with a supportive community. The AI insights helped me understand my patterns and track my progress. I feel more hopeful about my mental health journey than ever before."
        </blockquote>
        <div className="font-semibold" style={{ color: '#272829' }}>Sarah M.</div>
        <div className="text-sm" style={{ color: '#6b7280' }}>Community Member</div>
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-20 text-white" style={{ backgroundColor: '#272829' }}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold">
          Ready to Start Your <span style={{ color: '#5eead4' }}>Mental Health Journey?</span>
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#d1d5db' }}>
          Join thousands who have found support, healing, and growth through our platform. Your wellbeing matters, and we're here to help.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/get-started"
            className="text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center"
            style={{ backgroundColor: '#184349' }}
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            to="/schedule-call"
            className="hover:text-white transition-colors"
            style={{ color: '#d1d5db' }}
          >
            Schedule a Call
          </Link>
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-sm pt-4" style={{ color: '#9ca3af' }}>
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-2" style={{ color: '#5eead4' }} />
            No commitment required
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-2" style={{ color: '#5eead4' }} />
            Licensed professionals
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-2" style={{ color: '#5eead4' }} />
            100% confidential
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FooterSection = () => (
  <footer className="text-white py-16" style={{ backgroundColor: '#202a42' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #184349 0%, #0f2027 100%)' }}
            >
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Core Cognitive</span>
          </Link>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Supporting mental health and personal growth through professional guidance and community support.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Platform</h4>
          <div className="space-y-2 text-sm" style={{ color: '#9ca3af' }}>
            <Link to="/find-therapists" className="block hover:text-white transition-colors">Find Therapists</Link>
            <Link to="/community" className="block hover:text-white transition-colors">Join Community</Link>
            <Link to="/ai-tools" className="block hover:text-white transition-colors">AI Tools</Link>
            <Link to="/resources" className="block hover:text-white transition-colors">Resources</Link>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <div className="space-y-2 text-sm" style={{ color: '#9ca3af' }}>
            <Link to="/help-center" className="block hover:text-white transition-colors">Help Center</Link>
            <Link to="/crisis-resources" className="block hover:text-white transition-colors">Crisis Resources</Link>
            <Link to="/contact" className="block hover:text-white transition-colors">Contact Us</Link>
            <Link to="/accessibility" className="block hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <div className="space-y-2 text-sm" style={{ color: '#9ca3af' }}>
            <Link to="/privacy-policy" className="block hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="block hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/hipaa" className="block hover:text-white transition-colors">HIPAA Compliance</Link>
            <Link to="/cookie-policy" className="block hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-8 text-center text-sm" style={{ borderColor: '#374151', color: '#9ca3af' }}>
        <p>&copy; {new Date().getFullYear()} Core Cognitive. All rights reserved.</p>
        <p className="mt-2">If you're experiencing a mental health emergency, please call 988 or your local emergency services.</p>
      </div>
    </div>
  </footer>
);

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="antialiased bg-white font-sans">
      <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;