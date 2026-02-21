import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './config/supabaseClient';
import { useAuthGuard } from './hooks/useAuthGuard';
import logoAdFinem from '../LOGO AD FINEM.png';
import { 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Briefcase, 
  FileText, 
  Gavel, 
  Phone, 
  MapPin, 
  Mail, 
  Menu, 
  X, 
  CheckCircle,
  Clock,
  Award,
  ChevronRight,
  Scale,
  Star,
  ArrowUpRight
} from 'lucide-react';
import NoticiasSection from './components/NoticiasSection';
import NoticiasSidebar from './components/NoticiasSidebar';
import NoticiasDashboard from './components/NoticiasDashboard';

// --- COMPONENTES AUXILIARES ---

// Icono Oficial de WhatsApp (SVG)
const WhatsAppIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

// Componente para secciones animadas (OPTIMIZADO)
const FadeInSection = ({ children, delay = "0" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) observer.unobserve(domRef.current);
        }
      });
    });

    const currentElement = domRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL APP ---

const App = ({ adminMode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(adminMode);

    // Guard de autenticación para /admin
    useEffect(() => {
      if (adminMode) {
        setLoadingUser(true);
        supabase.auth.getSession().then(({ data }) => {
          if (!data.session) {
            navigate('/login');
          } else {
            setUser(data.session.user);
          }
          setLoadingUser(false);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
          if (!session) {
            navigate('/login');
          } else {
            setUser(session.user);
          }
        });
        return () => listener.subscription.unsubscribe();
      }
    }, [adminMode, navigate]);

    // Logout handler
    const handleLogout = async () => {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
    };
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const whatsappNumber = "573043765364";
  const whatsappMessage = "Hola Ad Finem, quisiera más información sobre sus servicios jurídicos.";


  if (adminMode) {
    if (loadingUser) {
      return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }
    if (!user) {
      return null;
    }
    // Renderiza el panel dedicado de noticias
    return (
      <div className="min-h-screen bg-slate-50 text-justified">
        <NoticiasSidebar />
        <NoticiasDashboard />
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-800 bg-gray-50 min-h-screen flex flex-col overflow-x-hidden text-justified">
      
      {/* --- BOTÓN FLOTANTE WHATSAPP --- */}
      <a 
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all duration-300 hover:scale-110 group flex items-center gap-2 animate-bounce"
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon className="h-6 w-6 md:h-8 md:w-8" />
        <span className="hidden group-hover:block font-bold pr-2 text-xs md:text-sm whitespace-nowrap">
          ¡Hablemos Ahora!
        </span>
        <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white animate-ping"></span>
      </a>

      {/* --- NAVEGACIÓN --- */}
      {adminMode && user && (
        <nav className="w-full bg-slate-900 text-white p-4 flex justify-between items-center">
          <span className="font-bold">Panel Administrativo</span>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-bold">Cerrar sesión</button>
        </nav>
      )}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg py-2' 
            : 'bg-white/90 backdrop-blur-md py-4 shadow-sm'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => window.scrollTo(0,0)}>
            <div
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 md:p-3 flex items-center justify-center"
              style={{ minWidth: '90px', minHeight: '56px' }}
            >
              <img
                src="https://i.imgur.com/ZqwnsAN.png"
                alt="Ad Finem Logo"
                className="h-12 md:h-16 w-auto object-contain transition-transform duration-200"
                style={{ background: 'white', borderRadius: '0.75rem' }}
              />
            </div>
          </div>

          {/* Menú Escritorio */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            {['Nosotros', 'Servicios', 'Metodología', 'Equipo', 'Contacto'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm font-bold text-brand-teal hover:text-brand-orange transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-orange after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contacto')}
              className="bg-brand-orange hover:bg-orange-600 text-white px-5 py-2 lg:px-6 lg:py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2 hover:-translate-y-1"
            >
              Consulta Inicial <ChevronRight size={16}/>
            </button>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-brand-teal focus:outline-none p-2"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white absolute w-full border-t border-gray-100 shadow-2xl h-screen z-40">
            <div className="flex flex-col px-8 py-8 space-y-6">
              {['Nosotros', 'Servicios', 'Metodología', 'Equipo', 'Contacto'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-brand-teal text-xl font-bold hover:text-brand-orange text-left border-b border-gray-100 pb-4 flex justify-between items-center"
                >
                  {item}
                  <ChevronRight size={20} className="text-gray-300"/>
                </button>
              ))}
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                className="mt-4 bg-[#25D366] text-white py-4 rounded-xl font-bold text-center flex justify-center items-center gap-2 shadow-lg"
              >
                <WhatsAppIcon className="h-6 w-6" /> Contactar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-[95vh] flex items-center justify-center bg-brand-teal overflow-hidden pt-28 pb-10">
        {/* Fondo Abstracto */}
        <div className="absolute top-0 right-0 w-3/4 h-full bg-white opacity-[0.03] rounded-l-[200px] transform translate-x-1/4 skew-x-12 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-brand-orange opacity-[0.08] rounded-tr-full blur-2xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Texto Hero */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <FadeInSection>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 border border-brand-orange/40 rounded-full bg-brand-orange/10 backdrop-blur-md shadow-lg shadow-brand-orange/10">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange"></span>
                  </span>
                  <span className="text-brand-orange text-[10px] md:text-sm font-bold tracking-widest uppercase">
                    Consultoría Jurídica de Alto Nivel
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                  Seguridad Jurídica <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-300 to-yellow-200">
                    Hasta el Final.
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-blue-100/90 mb-8 md:mb-10 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Firma liderada por <strong>Exjueces y Exmagistrados</strong>. Transformamos la incertidumbre legal en estabilidad empresarial con estrategias preventivas y defensa robusta.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => scrollToSection('contacto')}
                    className="group bg-brand-orange hover:bg-orange-600 text-white px-8 py-3 md:py-4 rounded-xl font-bold shadow-xl shadow-brand-orange/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-base md:text-lg"
                  >
                    Agendar Diagnóstico <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => scrollToSection('servicios')}
                    className="bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white hover:text-brand-teal text-white px-8 py-3 md:py-4 rounded-xl font-bold transition-all text-base md:text-lg"
                  >
                    Explorar Servicios
                  </button>
                </div>
              </FadeInSection>
            </div>
            
            {/* Tarjeta Flotante (RESPONSIVE FIX) */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end relative w-full mt-8 lg:mt-0">
              <div className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-md aspect-square mx-auto lg:mx-0">
                {/* Círculo fondo */}
                <div className="absolute inset-0 bg-brand-orange opacity-20 blur-[60px] md:blur-[80px] rounded-full"></div>
                
                {/* Tarjeta Principal */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                  <FadeInSection delay="200ms">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-brand-orange/30 transition-colors">
                      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16"></div>
                      
                      <div className="space-y-5 md:space-y-8 relative z-10">
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="bg-brand-orange p-2.5 md:p-3 rounded-2xl shadow-lg shadow-brand-orange/20 flex-shrink-0">
                            <Gavel className="text-white w-6 h-6 md:w-8 md:h-8"/>
                          </div>
                          <div>
                            <p className="font-bold text-white text-base md:text-lg leading-tight">Experiencia Judicial</p>
                            <p className="text-xs md:text-sm text-blue-100 mt-1">Conocimiento interno del sistema legal.</p>
                          </div>
                        </div>
                        
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="bg-brand-teal p-2.5 md:p-3 rounded-2xl shadow-lg border border-white/20 flex-shrink-0">
                            <ShieldCheck className="text-white w-6 h-6 md:w-8 md:h-8"/>
                          </div>
                          <div>
                            <p className="font-bold text-white text-base md:text-lg leading-tight">Blindaje Corporativo</p>
                            <p className="text-xs md:text-sm text-blue-100 mt-1">Prevención de riesgos laborales.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeInSection>
                </div>

                {/* Tarjeta Pequeña */}
                <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-4 animate-bounce delay-700 z-20">
                   <div className="bg-white p-3 md:p-4 rounded-2xl shadow-xl flex items-center gap-3 transform scale-90 md:scale-100 origin-bottom-right">
                     <div className="bg-green-100 p-2 rounded-full">
                       <CheckCircle className="text-green-600 h-5 w-5 md:h-6 md:w-6" />
                     </div>
                     <div>
                       <p className="font-bold text-slate-800 text-xs md:text-sm">Resultados Reales</p>
                       <p className="text-[10px] md:text-xs text-gray-500">Casos exitosos</p>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- BARRA DE CONFIANZA (STATS) --- */}
      <div className="bg-white border-b border-gray-100 py-6 md:py-8 relative z-20 -mt-8 mx-4 md:mx-auto md:max-w-6xl rounded-xl shadow-lg grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-center">
        {[
          { label: "Años Experiencia", value: "+15", icon: Clock },
          { label: "Casos Gestionados", value: "+500", icon: FileText },
          { label: "Tasa de Éxito", value: "98%", icon: Star },
          { label: "Cobertura", value: "Nacional e Internacional", icon: MapPin },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 px-2 text-center md:text-left">
            <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-brand-orange opacity-80" />
            <div>
              <p className="text-xl md:text-2xl font-black text-brand-teal leading-none">{stat.value}</p>
              <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wide">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- SOBRE NOSOTROS --- */}
      <section id="nosotros" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <FadeInSection>
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <span className="text-brand-orange font-bold tracking-widest uppercase text-xs mb-2 block">Nuestra Filosofía</span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-teal mb-4 md:mb-6">La Diferencia Ad Finem</h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed text-justify">
                <span className="font-bold text-brand-orange">Ad Finem</span> significa "Hasta el final". No abandonamos el proceso. Nuestra fortaleza radica en un equipo de profesionales que han servido como Jueces, Secretarios y Auxiliares de Magistrados, aportando una visión técnica, realista y profundamente humana del Derecho en Colombia.
              </p>
            </div>
          </FadeInSection>
              
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: "Calidad Técnica", desc: "Estándares de la alta magistratura aplicados a su empresa." },
              { icon: ShieldCheck, title: "Seguridad", desc: "Auditorías preventivas que identifican y cierran brechas legales antes de una eventual demanda, reduciendo riesgos y evitando conflictos jurídicos prolongados, onerosos y desgastantes." },
              { icon: Users, title: "Lealtad", desc: "Construimos relaciones duraderas fundamentadas en la integridad, la transparencia y un compromiso inquebrantable con la defensa de los intereses de nuestros clientes, pilares esenciales de Ad Finem Consultores Jurídicos." },
              { icon: Gavel, title: "Representación", desc: "Defensa sólida en estrados judiciales, respaldada por una amplia experiencia en litigio y un enfoque estratégico orientado a la protección integral de los intereses de nuestros clientes." }
            ].map((item, index) => (
              <FadeInSection key={index} delay={`${index * 100}ms`}>
                <div className="p-6 md:p-8 bg-slate-50 rounded-2xl border border-transparent hover:border-brand-orange/30 hover:bg-white hover:shadow-xl transition-all duration-300 group h-full">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 md:mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors border border-gray-100">
                    <item.icon className="h-6 w-6 md:h-7 md:w-7 text-brand-teal group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-teal mb-2 md:mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICIOS --- */}
      <section id="servicios" className="py-16 md:py-24 bg-brand-teal/5 relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16">
            <div className="md:w-2/3">
              <FadeInSection>
                <span className="text-brand-orange font-bold tracking-wider uppercase text-sm">Portafolio de Servicios</span>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-teal mt-2">
                  <span className="block text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-teal leading-tight">Ad Finem</span>
                  <span className="block text-lg md:text-2xl font-semibold text-brand-teal/80 mt-1">consultores jurídicos</span>
                </h2>
                <p className="mt-4 text-gray-600 text-base md:text-lg max-w-2xl text-justify">
                  Especialistas en Derecho Laboral y Seguridad Social para el sector empresarial. Cubrimos todas las aristas legales.
                </p>
              </FadeInSection>
            </div>
            <div className="hidden md:block">
              <button 
                onClick={() => scrollToSection('contacto')} 
                className="text-brand-teal font-bold hover:text-brand-orange flex items-center gap-2 group border-b-2 border-transparent hover:border-brand-orange transition-all pb-1"
              >
                Solicitar cotización <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                icon: FileText, 
                title: "Gestión Contractual", 
                text: "Redacción y actualización de contratos a la nueva ley. Cláusulas de confidencialidad y 'otros sí'." 
              },
              { 
                icon: Briefcase, 
                title: "Procesos Disciplinarios", 
                text: "De diligencias de descargo, actas, terminación del contrato de trabajo con justa causa para evitar reintegro laboral." 
              },
              // Tarjeta "Litigio y Defensa" eliminada según solicitud
              { 
                icon: BookOpen, 
                title: "Reglamento Interno", 
                text: "Actualización del RIT conforme a las últimas sentencias de la Corte Constitucional y CSJ." 
              },
              { 
                icon: ShieldCheck, 
                title: "Seguridad Social Integral", 
                text: "Defensa y gestión completa en seguridad social: acciones de tutela, obtención de incapacidades, reconocimiento y protección de derechos pensionales. Acompañamiento experto ante cualquier entidad del sistema." 
              },
                            { 
                              icon: Briefcase, 
                              title: "Reintegros Laborales", 
                              text: "Brindamos defensa jurídica especializada orientada a prevenir y gestionar procesos de reintegro laboral y sus implicaciones económicas, tales como el pago de salarios, prestaciones sociales, aportes a seguridad social e indemnizaciones. Nuestro enfoque estratégico protege los intereses de la empresa mediante soluciones legales sólidas, oportunas y efectivas." 
                            },
              { 
                icon: Users, 
                title: "Respuestas a PQR", 
                text: "Contestación técnica a derechos de petición y requerimientos del Ministerio de Trabajo." 
              },

              { 
                icon: Scale, 
                title: "Matrices de Riesgo y Blindaje Jurídico", 
                text: "Diagnóstico estratégico y diseño de matrices personalizadas para identificar peligros legales latentes. Blindamos su operación corporativa para minimizar contingencias y proteger el patrimonio de la empresa." 
              },
              { 
                icon: ShieldCheck, 
                title: "Gestión Estratégica del SG-SST", 
                text: "Auditoría, diseño e implementación del Sistema de Gestión de Seguridad y Salud en el Trabajo. Transformamos el cumplimiento normativo en un activo de productividad, evitando sanciones y reduciendo la siniestralidad laboral." 
              },
              { 
                icon: Gavel, 
                title: "Defensa Técnica en Culpa Patronal", 
                text: "Asumimos el proceso con abogados especializados y con alta experiencia en la rama del derecho laboral, protegiendo a la empresa de condenas millonarias por indemnización de perjuicios." 
              },
              { 
                icon: BookOpen, 
                title: "Responsabilidad Médica", 
                text: "Representación en procesos de responsabilidad médica desde el ámbito civil, con enfoque técnico, probatorio y estratégico." 
              },
              { 
                icon: BookOpen, 
                title: "Recurso Extraordinario de Casación Laboral", 
                text: "Representación jurídica altamente especializada en la interposición y sustentación del recurso extraordinario de casación laboral ante la Sala de Casación Laboral de la Corte Suprema de Justicia. Brindamos un servicio de excelencia, fundamentado en técnica casacional rigurosa, análisis jurisprudencial profundo y una estrategia procesal personalizada, enfocados en maximizar las posibilidades de éxito y proteger integralmente los intereses de nuestros clientes." 
              }
            ].map((service, idx) => (
              <FadeInSection key={idx} delay={`${idx * 50}ms`}>
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:border-brand-orange/20 relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-brand-light rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-teal/5 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                      <service.icon className="h-6 w-6 md:h-7 md:w-7 text-brand-teal group-hover:text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-brand-teal mb-2 md:mb-3 group-hover:text-brand-orange transition-colors">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed text-justify">
                      {service.text}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <NoticiasSection />

      {/* --- TARIFAS / METODOLOGÍA --- */}
      <section id="metodología" className="py-16 md:py-24 bg-brand-teal text-white relative overflow-hidden">
        {/* Fondo patrón */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <FadeInSection>
                <div className="inline-block px-3 py-1 border border-brand-orange text-brand-orange rounded-full text-xs font-bold mb-4 uppercase tracking-wide">Transparencia</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Modelos de Contratación Claros y Justos</h2>
                <p className="text-blue-100 mb-8 md:mb-10 text-base md:text-lg leading-relaxed">
                  Olvídese de las tarifas ocultas o la facturación por hora sorpresa. En Ad Finem ofrecemos claridad desde el primer día para que usted controle su presupuesto.
                </p>
                
                <div className="space-y-6 md:space-y-8">
                  <div className="flex gap-4 md:gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-brand-orange flex items-center justify-center font-bold text-xl md:text-2xl shadow-lg group-hover:scale-110 transition-transform">1</div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">Por Evento (Consulta)</h3>
                      <p className="text-blue-200 text-xs md:text-sm leading-relaxed">
                        Pago único por servicio específico. Ideal para segundas opiniones, revisión de un contrato puntual o problemas aislados.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 md:gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xl md:text-2xl shadow-lg group-hover:bg-white group-hover:text-brand-teal transition-all">2</div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">Iguala Mensual (Retainer)</h3>
                      <p className="text-blue-200 text-xs md:text-sm leading-relaxed">
                        Su propio departamento jurídico externo por una tarifa fija. Acompañamiento ilimitado en los temas pactados. <span className="text-brand-orange font-bold">¡La opción preferida por Pymes!</span>
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            </div>

            <div className="relative mt-8 md:mt-0">
              <FadeInSection delay="200ms">
                <div className="bg-white text-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute top-0 right-0 bg-brand-orange text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-bl-2xl shadow-md">VIGENCIA 2026</div>
                  <h3 className="text-xl md:text-2xl font-bold text-brand-teal mb-6 md:mb-8 border-b border-gray-100 pb-4">Tarifas de Referencia</h3>
                  
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex justify-between items-center p-4 md:p-5 bg-gray-50 rounded-xl hover:bg-brand-light transition-colors cursor-default">
                      <div>
                         <span className="font-bold text-gray-700 block mb-1 text-sm md:text-base">Consulta Especializada</span>
                         <span className="text-xs text-gray-500">Pago único</span>
                      </div>
                      <div className="text-right">
                         <span className="font-bold text-brand-orange text-lg md:text-2xl">$300.000</span>
                         <span className="block text-[10px] text-gray-400 font-normal">+ IVA</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 md:p-5 bg-brand-teal/5 border border-brand-teal/20 rounded-xl relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-teal"></div>
                      <div>
                        <span className="font-bold text-brand-teal block mb-1 text-sm md:text-lg">Asesoría Mensual Pyme</span>
                        <span className="text-[10px] md:text-xs text-brand-teal/70 font-medium bg-brand-teal/10 px-2 py-0.5 rounded-full">Recomendado</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-brand-teal text-lg md:text-2xl">$2.000.000</span>
                        <span className="block text-[10px] text-gray-400 uppercase">+ IVA / Mes</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs text-center text-gray-400 mt-6 md:mt-8 italic">
                    * Valores referenciales sujetos a análisis de complejidad y volumen.
                  </p>
                  
                  <div className="mt-6 md:mt-8 text-center">
                    <a 
                      href={`https://wa.me/${whatsappNumber}`}
                      className="inline-flex items-center gap-2 text-brand-teal font-bold hover:text-brand-orange transition-colors"
                    >
                      <WhatsAppIcon className="w-5 h-5"/> Cotizar mi caso
                    </a>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* --- EQUIPO (FOTO REAL MEJORADA) --- */}
      <section id="equipo" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
           <FadeInSection>
             <div className="text-center mb-12 md:mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-brand-teal">Liderazgo Legal</h2>
               <p className="text-gray-600 mt-4 text-base md:text-lg">Experiencia probada en la Rama Judicial al servicio de su empresa.</p>
             </div>
           </FadeInSection>
           
           <FadeInSection delay="200ms">
             <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-500">
               
               {/* --- FOTO (LINK ACTUALIZADO) --- */}
               <div className="md:w-5/12 relative min-h-[300px] md:min-h-[400px] group">
                 <img 
                   src="https://i.imgur.com/rjcPaNt.jpg" 
                   alt="Dra. Narda Marcela Cabezas Vargas" 
                   className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/90 via-transparent to-transparent opacity-80"></div>
                 <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                   <p className="text-white font-bold text-base md:text-lg mb-1">Socia Fundadora</p>
                   <div className="h-1 w-12 bg-brand-orange rounded-full"></div>
                 </div>
               </div>

               {/* --- INFO --- */}
               <div className="md:w-7/12 p-6 md:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                 <h3 className="text-2xl md:text-3xl font-bold text-brand-teal mb-2 whitespace-nowrap tracking-tight uppercase">Narda Marcela Cabezas Vargas</h3>
                 <p className="text-brand-orange font-bold mb-6 md:mb-8 uppercase text-xs md:text-sm tracking-widest flex items-center gap-2">
                   Directora Jurídica <span className="h-px w-8 bg-brand-orange/50"></span>
                 </p>
                 
                 <div className="space-y-4 mb-8">
                   <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all">
                     <div className="bg-brand-teal/10 p-2 rounded-lg">
                       <Award className="h-5 w-5 text-brand-teal flex-shrink-0" />
                     </div>
                     <p className="text-gray-600 text-sm leading-snug text-justify">Abogada conciliadora de la <strong>Pontificia Universidad Javeriana, sede Cali</strong>, y especialista en Derecho Laboral de la <strong>Universidad Libre</strong>.</p>
                   </div>
                   <div className="flex gap-4 items-start p-3 rounded-lg bg-orange-50 border border-orange-100">
                     <div className="bg-brand-orange/20 p-2 rounded-lg">
                       <Gavel className="h-5 w-5 text-brand-orange flex-shrink-0" />
                     </div>
                     <p className="text-gray-800 text-sm font-bold leading-snug">Ex Juez Laboral y Penal.</p>
                   </div>
                   <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all">
                     <div className="bg-brand-teal/10 p-2 rounded-lg">
                       <Briefcase className="h-5 w-5 text-brand-teal flex-shrink-0" />
                     </div>
                     <p className="text-gray-600 text-sm leading-snug text-justify">Ex auxiliar de magistrado en la Sala Laboral del Tribunal Superior de Cali y del Tribunal Superior de Sincelejo.</p>
                   </div>
                   <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all">
                     <div className="bg-brand-teal/10 p-2 rounded-lg">
                       <BookOpen className="h-5 w-5 text-brand-teal flex-shrink-0" />
                     </div>
                     <p className="text-gray-600 text-sm leading-snug text-justify">Diplomada en Conciliación y Docencia Universitaria.</p>
                   </div>
                 </div>

                 <div className="pt-6 md:pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <a href="mailto:nardamcabezas11@hotmail.com" className="group flex items-center gap-2 text-gray-400 hover:text-brand-teal transition-colors text-sm font-medium">
                      <Mail size={18} className="group-hover:animate-bounce"/> Email Directo
                    </a>
                    <a href={`https://wa.me/${whatsappNumber}`} className="group flex items-center gap-2 text-gray-400 hover:text-brand-orange transition-colors text-sm font-medium">
                      <Phone size={18} className="group-hover:animate-pulse"/> Agendar Cita
                    </a>
                 </div>
               </div>
             </div>
           </FadeInSection>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-16 md:py-20 bg-brand-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">¿Su empresa está realmente protegida?</h2>
          <p className="text-blue-200 mb-6 md:mb-8 max-w-2xl mx-auto text-base md:text-lg">
            No espere a recibir una demanda. Una auditoría preventiva hoy cuesta una fracción de lo que cuesta un litigio mañana.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}`}
            className="inline-block bg-white text-brand-teal hover:bg-brand-orange hover:text-white px-8 py-3 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg shadow-2xl transition-all transform hover:scale-105"
          >
            Solicitar Diagnóstico
          </a>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="contacto" className="bg-slate-950 text-white pt-16 md:pt-20 pb-10 border-t border-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
            
            {/* Columna 1: Marca */}
            <div>
              <div className="mb-6 bg-white p-3 rounded-xl inline-block shadow-lg shadow-white/5">
                <div className="flex items-center gap-3">
                  <img 
                    src={logoAdFinem} 
                    alt="Ad Finem Logo" 
                    className="h-10 md:h-12 w-auto drop-shadow-md"
                  />
                  <div className="flex flex-col">
                    <span className="font-extrabold text-brand-teal text-lg md:text-xl leading-tight">Ad Finem</span>
                    <span className="text-xs text-slate-500 font-semibold tracking-wide">Consultores Jurídicos</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                <span className="block text-slate-300 font-semibold mb-1">¿Por qué <span className="text-brand-orange font-bold">Ad Finem</span>?</span>
                <span className="block mb-1">"Ad Finem" significa <span className="italic text-brand-teal">acompañamiento con honestidad, seriedad y compromiso hasta el final</span>.</span>
                <span className="block">Consultores Jurídicos especializados en blindar empresas con experiencia desde la rama judicial.</span>
                <span className="block mt-2 text-xs text-slate-400">Honestidad, Lealtad y Resultados.</span>
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-orange text-slate-400 hover:text-white transition-all cursor-pointer">
                  <Briefcase size={18}/>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#25D366] text-slate-400 hover:text-white transition-all cursor-pointer">
                  <WhatsAppIcon className="h-5 w-5"/>
                </div>
              </div>
            </div>

            {/* Columna 2: Contacto */}
            <div className="col-span-1 lg:col-span-2 lg:pl-10">
              <h4 className="text-lg font-bold text-white mb-6 md:mb-8 border-b border-slate-800 pb-4 inline-block">Información de Contacto</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-800 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Cali, Valle del Cauca</p>
                    <p className="text-slate-400 text-sm">CALLE 18 # 66-50, OF 203B, EL PARQUE 2, B/LA HACIENDA CALI.</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-slate-800 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-1">Teléfono & WhatsApp</p>
                      <span className="text-slate-400 text-sm">304 376 5364</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-slate-800 p-2 rounded-lg">
                       <Mail className="h-5 w-5 text-brand-orange" />
                    </div>
                    <div>
                       <p className="font-bold text-white mb-1">Correo Electrónico</p>
                       <span className="text-slate-400 text-sm break-all">nardamcabezas11@hotmail.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 3: Horario */}
            <div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h5 className="font-bold mb-4 text-brand-orange flex items-center gap-2">
                  <Clock size={16}/> Horario de Atención
                </h5>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex justify-between border-b border-slate-800 pb-2">
                    <span>Lunes - Viernes</span>
                    <span className="font-bold">8am - 6pm</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-800 pb-2">
                    <span>Sábados</span>
                    <span className="font-bold">Con Cita</span>
                  </li>
                </ul>
                <a 
                  href={`https://wa.me/${whatsappNumber}`}
                  className="mt-6 block w-full text-center bg-brand-orange text-white hover:bg-white hover:text-brand-orange py-3 rounded-lg text-sm font-bold transition-all"
                >
                  Agendar Cita
                </a>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4 md:gap-0">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} Ad Finem Consultores Jurídicos S.A.S. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 md:space-x-8">
              <span className="hover:text-white cursor-pointer transition-colors">Política de Privacidad</span>
              <span className="hover:text-white cursor-pointer transition-colors">Términos Legales</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;