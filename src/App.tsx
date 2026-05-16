import { useState } from 'react';
import { Simulator } from './components/Simulator';
import { Testimonials } from './components/Testimonials';
import { PortfolioCarousel } from './components/PortfolioCarousel';
import { CheckoutPage } from './components/CheckoutPage';
import { Sparkles, TrendingUp, Zap, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

function App() {
  const [showCheckout, setShowCheckout] = useState(false);
  const handleTestClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new Event('activateSimulator'));
  };

  if (showCheckout) {
    return <CheckoutPage onBack={() => setShowCheckout(false)} />;
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            
            {/* Texto Hero */}
            <div className="animate-fade-in-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '6px 16px', borderRadius: '99px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <Sparkles size={16} /> A Revolução do Atendimento
              </div>
              
              <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                Um atendente que <span className="text-gradient">vende por você</span> 24h por dia.
              </h1>
              
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '480px' }}>
                Pare de perder clientes porque demorou para responder. Nosso sistema atende, qualifica e fecha vendas automaticamente no seu WhatsApp.
              </p>

              <div className="btn-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <a href="#simulator" onClick={handleTestClick} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                  Testar Atendente Agora <ChevronRight size={20} />
                </a>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={18} color="var(--success)" /> Configuração Rápida
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={18} color="var(--success)" /> Atendimento Humanizado
                </div>
              </div>
            </div>

            {/* Simulador Appears Next to Hero */}
            <div className="animate-fade-in-up delay-200" id="simulator">
              <div style={{ position: 'relative' }}>
                <Simulator onCheckout={() => setShowCheckout(true)} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Social Proof / Numbers */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-dark)', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>+68</div>
              <div style={{ color: 'var(--text-muted)' }}>Negócios Automatizados</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>24/7</div>
              <div style={{ color: 'var(--text-muted)' }}>Disponibilidade</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>2x</div>
              <div style={{ color: 'var(--text-muted)' }}>Mais Agendamentos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Por que sua empresa <span className="text-gradient">precisa disso?</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>O segredo das empresas que escalam é a automação inteligente.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Clock size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Responde na hora mesmo com a loja cheia</h3>
            <p style={{ color: 'var(--text-muted)' }}>O cliente de hoje não tem paciência. Se você demora 5 minutos para responder, ele já comprou com o concorrente. O sistema responde em 2 segundos.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <TrendingUp size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Fecha pedidos enquanto você trabalha</h3>
            <p style={{ color: 'var(--text-muted)' }}>Nosso robô não apenas responde dúvidas, ele é treinado com gatilhos mentais para contornar objeções e fechar a venda por você.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              <Zap size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Agenda clientes sem você tocar no celular</h3>
            <p style={{ color: 'var(--text-muted)' }}>Esqueça os robôs engessados (Pressione 1 para X). O sistema conversa de forma natural como um atendente de verdade, com empatia e persuasão.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Portfolio Carousel */}
      <PortfolioCarousel />

      {/* CTA Final */}
      <section style={{ padding: '6rem 0', background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 60%)' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white' }}>
            Pronto para transformar seu WhatsApp em uma <span className="text-gradient">Máquina de Vendas?</span>
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Junte-se às empresas que já estão economizando tempo e dobrando o faturamento com nossa automação.
          </p>
          <button onClick={() => setShowCheckout(true)} className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '1.25rem 3rem', borderRadius: '99px' }}>
            <Zap size={24} /> Quero isso no meu WhatsApp
          </button>
          
          <div style={{ marginTop: '2.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              Ficou com alguma dúvida?
            </p>
            <a href="https://wa.me/5535984295953?text=Oi,%20estou%20na%20página%20e%20fiquei%20com%20uma%20dúvida." 
               style={{ 
                 display: 'inline-flex', 
                 alignItems: 'center', 
                 background: 'transparent', 
                 border: '1px solid rgba(255,255,255,0.2)', 
                 padding: '8px 20px', 
                 borderRadius: '99px', 
                 color: 'var(--text-light)', 
                 fontSize: '0.9rem',
                 textDecoration: 'none'
               }}>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>&copy; 2026 Atendente Automático. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default App;
