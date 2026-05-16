

const items = [
  { id: 1, title: 'Hamburgueria Premium', src: '/images/hamburgueria.png' },
  { id: 2, title: 'Clínica de Estética', src: '/images/clinica.png' },
  { id: 3, title: 'Barbearia Moderna', src: '/images/barbearia.png' },
  { id: 4, title: 'Pizzaria Artesanal', src: '/images/pizzaria.png' },
  { id: 5, title: 'Açaí Tropical', src: '/images/acai.png' },
  { id: 6, title: 'Clínica Odontológica', src: '/images/clinica2.png' },
];

export function PortfolioCarousel() {
  // Duplicating items to create the infinite scroll illusion
  const scrollItems = [...items, ...items];

  return (
    <section style={{ padding: '6rem 0', background: 'var(--bg-darker)', overflow: 'hidden' }}>
      <style>
        {`
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          .marquee-track {
            display: flex;
            gap: 2rem;
            width: max-content;
            animation: infinite-scroll 35s linear infinite;
          }
          
          .marquee-track:hover {
            animation-play-state: paused;
          }
          
          .portfolio-card {
            width: 400px;
            height: 250px;
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid var(--border);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            flex-shrink: 0;
            background: #0f172a;
          }
          
          .portfolio-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
            z-index: 10;
          }

          @media (max-width: 768px) {
            .portfolio-card {
              width: 300px;
              height: 190px;
            }
          }
        `}
      </style>

      <div className="container" style={{ paddingBottom: '3rem' }}>
        <div className="text-center">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Sites de <span className="text-gradient">Alto Padrão</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Combinamos a automação do WhatsApp com uma presença digital premium. 
            Nossas páginas de vendas valem facilmente entre R$5.000 e R$10.000 no mercado tradicional.
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
        {/* Gradients to fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '150px', background: 'linear-gradient(to right, var(--bg-darker), transparent)', zIndex: 5, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '150px', background: 'linear-gradient(to left, var(--bg-darker), transparent)', zIndex: 5, pointerEvents: 'none' }}></div>

        <div className="marquee-track">
          {scrollItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="portfolio-card">
              <img 
                src={item.src} 
                alt={item.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} 
              />
              <div style={{ 
                position: 'absolute', 
                bottom: 0, left: 0, right: 0, 
                padding: '1.5rem', 
                background: 'linear-gradient(transparent, rgba(0,0,0,0.95))' 
              }}>
                <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700 }}>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
