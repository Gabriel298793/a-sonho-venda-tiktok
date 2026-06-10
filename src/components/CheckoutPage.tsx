import { useEffect } from 'react';
import { Check, ChevronLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface CheckoutPageProps {
  onBack?: () => void;
}

export function CheckoutPage({ onBack }: CheckoutPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const simulou = location.state?.simulou === true;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const phone = "5535984295953";

  const plans = [
    {
      id: 'simples',
      name: 'Simples',
      tag: 'MAIS BARATO',
      price: '147',
      originalPrice: '247',
      setup: '147',
      target: 'Ideal pra você se: atende sozinho ou tem só 1 ajudante',
      features: [
        'Atendente automático no seu WhatsApp 24h',
        'Agendamento automático em planilha',
        'Lembrete de horário pro cliente',
        'Implementação em 7 dias',
        'Suporte por 30 dias'
      ],
      link: `https://wa.me/${phone}?text=Oi!%20Acabei%20de%20testar%20o%20atendente%20no%20site%20e%20quero%20o%20plano%20Simples%20(R%24147)`
    },
    {
      id: 'medio',
      name: 'Médio',
      tag: 'RECOMENDADO',
      price: '247',
      originalPrice: '397',
      setup: '297',
      target: 'Ideal pra você se: tem recepção e agenda cheia todo dia',
      isPopular: true,
      scarcity: '⚡ Atendo só 5 implementações por mês pra garantir qualidade',
      features: [
        'Tudo do Simples',
        'Integração com Google Calendar',
        'Email automático pra você dos leads quentes',
        'Lógica condicional (qualifica cliente)',
        'Relatório mensal de atendimentos'
      ],
      link: `https://wa.me/${phone}?text=Oi!%20Acabei%20de%20testar%20o%20atendente%20no%20site%20e%20quero%20o%20plano%20Médio%20(R%24247)`
    },
    {
      id: 'avancado',
      name: 'Avançado',
      tag: 'PRO',
      price: '397',
      originalPrice: '597',
      setup: '497',
      target: 'Ideal pra você se: tem volume alto e mais de 1 atendente',
      features: [
        'Tudo do Médio',
        'Sub-atendentes especializados',
        'Integração customizada com sistema próprio',
        'Suporte prioritário',
        'Otimização contínua'
      ],
      link: `https://wa.me/${phone}?text=Oi!%20Acabei%20de%20testar%20o%20atendente%20no%20site%20e%20quero%20o%20plano%20Avançado%20(R%24397)`
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* CSS Styles */}
      <style>
        {`
          .plans-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
            align-items: center;
          }
          
          .plan-card {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 24px;
            padding: 2.5rem 1.5rem;
            position: relative;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          
          .plan-card:hover {
            transform: translateY(-4px);
            border-color: var(--primary);
            box-shadow: 0 10px 40px rgba(139, 92, 246, 0.15);
          }
          
          .plan-card.popular {
            background: rgba(15, 23, 42, 0.9);
            border: 2px solid var(--primary);
            transform: scale(1.05);
            box-shadow: 0 10px 40px rgba(139, 92, 246, 0.2);
            z-index: 10;
          }
          
          .plan-card.popular:hover {
            transform: scale(1.05) translateY(-4px);
          }
          
          .plan-tag {
            position: absolute;
            top: -14px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255,255,255,0.1);
            color: var(--text-light);
            padding: 6px 16px;
            border-radius: 99px;
            font-size: 0.8rem;
            font-weight: 800;
            letter-spacing: 1px;
            white-space: nowrap;
          }
          
          .plan-card.popular .plan-tag {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
          }

          .scarcity-line {
            color: #fbbf24; /* amber-400 */
            font-size: 0.85rem;
            font-weight: 700;
            margin: 1rem 0;
            padding: 8px;
            background: rgba(251, 191, 36, 0.1);
            border-radius: 8px;
            display: inline-block;
          }

          @media (max-width: 900px) {
            .plans-grid {
              grid-template-columns: 1fr;
              max-width: 450px;
              gap: 3.5rem;
            }
            .plan-card.popular {
              transform: scale(1);
              order: -1;
            }
            .plan-card.popular:hover {
              transform: translateY(-4px);
            }
          }
        `}
      </style>

      <button onClick={() => onBack ? onBack() : navigate('/')} style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '99px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s', zIndex: 20 }}>
        <ChevronLeft size={16} /> Voltar
      </button>

      <div style={{ width: '100%', marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {simulou ? (
          <>
            {/* Intro Text */}
            <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '650px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                Você acabou de testar.
              </h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)' }}>
                Imagina isso rodando no seu negócio 24h por dia. Escolhe o plano que mais combina:
              </p>
            </div>

            {/* Reforço da Experiência */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2.5rem', maxWidth: '650px', width: '100%', marginBottom: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.5px' }}>
                VOCÊ ACABOU DE:
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto 2rem auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', maxWidth: 'max-content' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '1.1rem', fontWeight: 500 }}>
                  <div style={{ color: 'var(--success)' }}>
                    <Check size={22} strokeWidth={3} />
                  </div>
                  Conversar com um atendente automático real
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '1.1rem', fontWeight: 500 }}>
                  <div style={{ color: 'var(--success)' }}>
                    <Check size={22} strokeWidth={3} />
                  </div>
                  Ver ele entender o que você queria
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '1.1rem', fontWeight: 500 }}>
                  <div style={{ color: 'var(--success)' }}>
                    <Check size={22} strokeWidth={3} />
                  </div>
                  Economizar tempo do seu atendimento
                </li>
              </ul>
              <p style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 600, maxWidth: '500px', margin: '0 auto', lineHeight: 1.4 }}>
                "Imagina isso 24h por dia, 30 dias por mês, no SEU WhatsApp, atendendo SEUS clientes."
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Intro Text */}
            <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '650px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                Escolha o Plano Ideal para seu Negócio
              </h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)' }}>
                Automatize seu atendimento, qualifique leads e venda 24 horas por dia no WhatsApp.
              </p>
            </div>
          </>
        )}

        {/* Banner de Urgência / Preço Promocional */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          maxWidth: '650px',
          width: '100%',
          marginBottom: '3rem',
          textAlign: 'left',
          color: '#fca5a5',
          fontSize: '0.95rem',
          lineHeight: 1.5,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.05)',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🚨</span>
          <div>
            <strong style={{ color: 'white', display: 'block', marginBottom: '4px', fontSize: '1rem' }}>
              CONDIÇÃO PROMOCIONAL ATIVA (VERSÃO 2.0)
            </strong>
            Estes valores são válidos temporariamente devido ao lançamento da nossa <strong>versão 2.0 com novos sub-atendentes automáticos</strong>. Garantimos o desconto mensal vitalício apenas para as próximas <strong>3 ativações</strong> desta semana. Após isso, as assinaturas retornarão ao valor de tabela (reajuste de +R$ 100/mês).
          </div>
        </div>

        {/* Filtro de Escolha */}
        <div style={{ maxWidth: '650px', width: '100%', marginBottom: '4rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', letterSpacing: '0.5px' }}>
            QUAL O TAMANHO DO SEU NEGÓCIO?
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> 
              Atendo sozinho ou com 1 pessoa? <strong style={{ color: 'white' }}>PLANO SIMPLES</strong>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> 
              Tenho recepção e agenda cheia? <strong style={{ color: 'var(--primary)' }}>PLANO MÉDIO</strong>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> 
              Volume alto e multi-atendentes? <strong style={{ color: 'white' }}>PLANO AVANÇADO</strong>
            </div>
          </div>
        </div>

        {/* Planos */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.isPopular ? 'popular' : ''}`}>
              <div className="plan-tag">{plan.tag}</div>
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
                  {plan.name}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginBottom: '0.5rem' }}>
                  <span style={{ textDecoration: 'line-through', color: 'rgba(239, 68, 68, 0.7)', fontSize: '0.9rem', fontWeight: 600 }}>
                    De R$ {plan.originalPrice}/mês
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--success)' }}>Por R$</span>
                    <span style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', lineHeight: 1, fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-1px' }}>{plan.price}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>/mês</span>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px', display: 'inline-block' }}>
                  Setup: + R${plan.setup} (única vez)
                </div>

                {plan.scarcity && (
                  <div>
                    <div className="scarcity-line">
                      {plan.scarcity}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-light)', textAlign: 'center', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {plan.target}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'white', fontSize: '0.95rem', paddingBottom: '1rem', borderBottom: i < plan.features.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ color: plan.isPopular ? 'var(--primary)' : 'var(--success)', marginTop: '2px' }}>
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <span style={{ lineHeight: 1.4 }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 'auto' }}>
                <a href={plan.link} className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', padding: '1.25rem 1rem', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', display: 'block' }}>
                  Quero Esse
                </a>
                <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Sem fidelidade. Cancela quando quiser.
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3.5rem', maxWidth: '500px', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Não sabe qual escolher? Clica no que mais parece com seu caso e a gente alinha em 5 minutos no WhatsApp.
        </div>

        {/* HELP SECTION */}
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
            Ficou com alguma dúvida?
          </p>
          <a href={`https://wa.me/${phone}?text=Oi,%20estou%20na%20página%20de%20planos%20e%20fiquei%20com%20uma%20dúvida.`} 
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
    </div>
  );
}
