import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout, EnhancedFooter } from "../common";
import { submitContactForm } from "../../services/contactService";
import { SAPIGlobe } from "../common/Logo";

// Placeholder components
const FadeIn = ({ children, className = "", delay = 0 }) => (
  <div className={className} style={{ '--animation-delay': `${delay}s`, animationDelay: 'var(--animation-delay)' }}>
    {children}
  </div>
);

const Toast = ({ visible, message, type = 'success' }) => {
  return (
    <div
      className={`fixed top-7 right-7 z-[9999] bg-[#1A1540] border border-[#2A204A] text-[#FBF5E6] px-4 py-3 rounded-lg text-sm flex items-center gap-2.5 shadow-lg transition-all duration-300 pointer-events-none ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${type === 'success' ? 'bg-[#28A868]' : 'bg-[#C03058]'}`} />
      {message}
    </div>
  );
};

const SectionLabel = ({ children, tone = "default", className = "" }) => (
  <div className={`font-sans text-[13px] tracking-[0.22em] uppercase ${
    tone === "accent" || tone === "white" ? "text-sapi-gold" : "text-sapi-muted"
  } ${className}`}>
    {children}
  </div>
);

const PageHero = ({ description, label, title }) => {
  return (
    <div className="space-y-6">
      <SectionLabel tone="accent">{label}</SectionLabel>
      <h1 className="font-sans text-5xl leading-tight text-sapi-parchment max-w-4xl">
        {title}
      </h1>
      <p className="font-sans text-lg leading-8 text-sapi-muted max-w-2xl">
        {description}
      </p>
    </div>
  );
};

const CustomHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#0a0a12] border-b border-sapi-bronze py-2">
      <div className="px-8 py-4 max-w-container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div onClick={() => navigate('/main')} className="cursor-pointer">
            <SAPIGlobe size={180} />
          </div>
          <div 
            className="font-sans text-xl text-[#fbf5e6] cursor-pointer tracking-wide leading-tight"
            onClick={() => navigate('/main')}
          >
            THE SOVEREIGN<br />AI POWER INDEX
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/methodology')}
          >
            Methodology
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/about')}
          >
            About
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/contact')}
          >
            Request Introduction
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm px-6 py-2 bg-sapi-gold text-sapi-void hover:bg-[#B8862A] transition-colors duration-150"
            onClick={() => navigate('/login')}
          >
            Index
          </button>
        </div>
      </div>
    </header>
  );
};

const IntroductionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    interest: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const interestMapping = {
        council: 'Westminster Council Participation',
        assessment: 'Sovereign AI Assessment',
        partnership: 'Strategic Partnership',
        other: 'Other'
      };

      const contactData = {
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        role: formData.role,
        area_of_interest: interestMapping[formData.interest] || formData.interest,
        message: formData.message
      };

      const response = await submitContactForm(contactData);

      if (response.success) {
        setToast({ visible: true, message: 'Thank you for your interest. We will be in touch soon.', type: 'success' });
        setFormData({
          name: '',
          email: '',
          organization: '',
          role: '',
          interest: '',
          message: ''
        });
      } else {
        setError('Failed to submit contact form. Please try again.');
        setToast({ visible: true, message: 'Failed to submit contact form. Please try again.', type: 'error' });
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-sm text-sm">
            {error}
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted">Name</label>
          <input
            type="text"
            required
            className="w-full bg-[#0a0a12] border border-sapi-bronze px-4 py-3 text-sapi-parchment focus:outline-none focus:border-sapi-gold transition-colors [&:-webkit-autofill]:bg-[#0a0a12] [&:-webkit-autofill]:text-sapi-parchment [&:-webkit-autofill:focus:bg-[#0a0a12]"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted">Email</label>
          <input
            type="email"
            required
            className="w-full bg-[#0a0a12] border border-sapi-bronze px-4 py-3 text-sapi-parchment focus:outline-none focus:border-sapi-gold transition-colors [&:-webkit-autofill]:bg-[#0a0a12] [&:-webkit-autofill]:text-sapi-parchment [&:-webkit-autofill:focus:bg-[#0a0a12]"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted">Organization</label>
          <input
            type="text"
            required
            className="w-full bg-[#0a0a12] border border-sapi-bronze px-4 py-3 text-sapi-parchment focus:outline-none focus:border-sapi-gold transition-colors [&:-webkit-autofill]:bg-[#0a0a12] [&:-webkit-autofill]:text-sapi-parchment [&:-webkit-autofill:focus:bg-[#0a0a12]"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted">Role</label>
          <input
            type="text"
            required
            className="w-full bg-[#0a0a12] border border-sapi-bronze px-4 py-3 text-sapi-parchment focus:outline-none focus:border-sapi-gold transition-colors [&:-webkit-autofill]:bg-[#0a0a12] [&:-webkit-autofill]:text-sapi-parchment [&:-webkit-autofill:focus:bg-[#0a0a12]"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted">Area of Interest</label>
        <select
          required
          className="w-full bg-[#0a0a12] border border-sapi-bronze px-4 py-3 text-sapi-parchment focus:outline-none focus:border-sapi-gold transition-colors [&:-webkit-autofill]:bg-[#0a0a12] [&:-webkit-autofill]:text-sapi-parchment [&:-webkit-autofill:focus:bg-[#0a0a12]"
          value={formData.interest}
          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
        >
          <option value="">Select an option</option>
          <option value="council">Westminster Council Participation</option>
          <option value="assessment">Sovereign AI Assessment</option>
          <option value="partnership">Strategic Partnership</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted">Message</label>
        <textarea
          required
          rows={5}
          className="w-full bg-[#0a0a12] border border-sapi-bronze px-4 py-3 text-sapi-parchment focus:outline-none focus:border-sapi-gold transition-colors resize-none [&:-webkit-autofill]:bg-[#0a0a12] [&:-webkit-autofill]:text-sapi-parchment [&:-webkit-autofill:focus:bg-[#0a0a12]"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="font-sans text-[15px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm px-11 py-3.5 bg-sapi-gold text-sapi-void hover:bg-[#B8862A] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
    <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </>
  );
};

export default function ContactPage() {
  return (
    <PageLayout>
      <CustomHeader />
      <section className="bg-[#0a0a12] pt-2 min-h-screen font-sans">
        <style>{`
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus,
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover,
          textarea:-webkit-autofill:focus,
          select:-webkit-autofill,
          select:-webkit-autofill:hover,
          select:-webkit-autofill:focus {
            -webkit-text-fill-color: #fbf5e6;
            -webkit-box-shadow: 0 0 0px 1000px #0a0a12 inset;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}</style>
        <div className="px-8 py-8 max-w-container mx-auto">
          <div className="space-y-14">
            <button
              className="bg-none border-none cursor-pointer font-sans text-[11px] tracking-[0.14em] uppercase flex items-center gap-1.5 p-0 transition-colors duration-150 mb-9 hover:text-sapi-gold text-sapi-muted"
              onClick={() => window.location.href = '/main'}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Main Page
            </button>
            <PageHero
              description="SAPI operates on an introduction basis. Council seats, assessment commissions, and strategic partnerships are reviewed against institutional mandate, timing, and strategic alignment. Provide the context below and the appropriate team will respond directly."
              label="Request an Introduction"
              title="Start the Conversation"
            />

            <FadeIn delay={0.08}>
              <IntroductionForm />
            </FadeIn>
          </div>
        </div>
      </section>
      <EnhancedFooter />
    </PageLayout>
  );
}
