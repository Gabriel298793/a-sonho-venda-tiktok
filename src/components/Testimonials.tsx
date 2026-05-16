import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Carlos Oliveira',
    role: 'Dono de Barbearia',
    text: 'Antes do sistema, eu perdia agendamentos todo fim de semana porque estava cortando cabelo e não conseguia responder o WhatsApp. Agora acordo de manhã com a agenda lotada para o dia. Mudou meu negócio!',
    rating: 5,
  },
  {
    name: 'Mariana Silva',
    role: 'Gestora de Clínica de Estética',
    text: 'A automação não só marca as consultas, como já faz a triagem das pacientes, tira dúvidas sobre os procedimentos e manda até o link de pagamento. Economizamos muito com atendimento e o retorno foi absurdo.',
    rating: 5,
  },
  {
    name: 'Roberto Nunes',
    role: 'Proprietário de Pizzaria',
    text: 'No fim de semana a pizzaria virava um caos de mensagens. O robô consegue anotar o pedido, calcular a taxa de entrega e mandar pra cozinha sem errar nada. Os clientes adoram a rapidez.',
    rating: 5,
  }
];

export function Testimonials() {
  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>
            Quem usa, <span className="text-gradient">recomenda.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Resultados reais de donos de negócios que automatizaram suas vendas.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem', position: 'relative', borderRadius: '16px' }}>
              <Quote size={40} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1, color: 'var(--primary)' }} />
              <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} size={18} fill="var(--success)" color="var(--success)" />
                ))}
              </div>
              <p style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div>
                <h4 style={{ fontWeight: 700, color: 'white', marginBottom: '2px' }}>{t.name}</h4>
                <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
