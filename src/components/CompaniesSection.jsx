import React from 'react';
import FadeInSection from './FadeInSection';

/**
 * Muestra una sección con empresas/organizaciones que confían en el despacho.
 * Props:
 *  - companies: Array<{logo?: string, name: string, desc?: string}>
 */
const CompaniesSection = ({ companies = [] }) => {
  return (
    <section id="empresas" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 flex justify-center">
        <div className="w-full max-w-7xl">
          <FadeInSection>
            <div className="text-center mb-12 md:mb-16">
              <span className="text-brand-orange font-bold tracking-widest uppercase text-xs mb-2 block">
                Nuestros Clientes
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-teal">
                Empresas que confían en nosotros
              </h2>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8 justify-items-center">
          {companies.map((c, i) => (
            <FadeInSection key={i} delay={`${i * 100}ms`}>
              <div className="group flex flex-col items-center justify-center text-center max-w-[240px] min-h-[180px] p-6 bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
                {c.logo && (
                  <img
                    src={c.logo}
                    alt={`${c.name} logo`}
                    className="h-16 md:h-20 lg:h-24 w-auto object-contain mb-2 filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    loading="lazy"
                  />
                )}
                <p className="text-sm font-semibold text-gray-700 truncate">{c.name}</p>
                {c.desc && (
                  <p className="text-xs text-gray-500 mt-1 text-justify">{c.desc}</p>
                )}
              </div>
            </FadeInSection>
          ))}
        </div>
        </div> {/* end w-full */}
      </div> {/* end container */}
    </section>
  );
};

export default CompaniesSection;
