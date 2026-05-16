import { useEffect, useState } from 'react';
import { Bot, Zap, ArrowRight, CheckCircle2, Smartphone, Users, MessageSquare, Activity } from 'lucide-react';

type ActivationStep = 'idle' | 'form' | 'loading' | 'qr' | 'connected' | 'manual-chat';

const chatSimulations = [
  {
    niche: 'Clínica de Estética',
    name: 'Sofia (Robô)',
    client: 'Vocês tem horário pra hoje a tarde?',
    ai: 'Olá! Temos sim. Tenho disponibilidade às 15:00 ou às 16:30. Qual fica melhor pra você? 😊'
  },
  {
    niche: 'Pizzaria Delivery',
    name: 'Mariana (Robô)',
    client: 'Queria pedir meia calabresa meia mussarela, entrega no centro?',
    ai: 'Claro! Entregamos sim. Fica R$ 45,90 com a taxa. O pagamento é no cartão ou PIX? 🍕'
  },
  {
    niche: 'Barbearia Premium',
    name: 'Carlos (Robô)',
    client: 'Quanto tá o corte disfarçado com barba?',
    ai: 'Opa chefe! O corte + barba sai por R$ 60,00. Quer que eu já deixe seu horário marcado pra hoje? ✂️'
  }
];

export function Simulator({ onCheckout }: { onCheckout?: () => void }) {
  const [activationStep, setActivationStep] = useState<ActivationStep>('idle');
  
  const [formData, setFormData] = useState({
    businessName: '',
    niche: '',
    agentName: '',
    style: 'Informal'
  });
  
  const [instanceName, setInstanceName] = useState('');
  const [qrCodeBase64, setQrCodeBase64] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [currentSimIndex, setCurrentSimIndex] = useState(0);

  // Manual chat states
  const [manualMessages, setManualMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Olá! Como posso te ajudar hoje?' }
  ]);
  const [manualInput, setManualInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Rotate fake chats in idle mode
  useEffect(() => {
    if (activationStep === 'idle') {
      const interval = setInterval(() => {
        setCurrentSimIndex(prev => (prev + 1) % chatSimulations.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activationStep]);

  // Listen to global event from Hero CTA
  useEffect(() => {
    const handleActivate = () => {
      if (activationStep === 'idle') setActivationStep('form');
    };
    window.addEventListener('activateSimulator', handleActivate);
    return () => window.removeEventListener('activateSimulator', handleActivate);
  }, [activationStep]);

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivationStep('loading');
    
    const newInstanceName = `demo-${Date.now()}`;
    setInstanceName(newInstanceName);
    
    try {
      setLoadingText('Treinando atendimento...');
      
      await fetch('https://wpp-api-gabriel.fly.dev/instance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'PH9e2DFBUCiEaQ3SWgohGLupjsnkAv1f'
        },
        body: JSON.stringify({
          instanceName: newInstanceName,
          webhook: "https://n8n-stack-n8n.29xxar.easypanel.host/webhook/api_mensagens",
          businessName: formData.businessName,
          niche: formData.niche,
          agentName: formData.agentName,
          style: formData.style
        })
      });

      setLoadingText('Configurando WhatsApp...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoadingText('Gerando QR Code...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActivationStep('qr');
    } catch (error) {
      console.error("Erro na criação da instância:", error);
      alert("Houve um erro ao conectar com o servidor. Tente novamente.");
      setActivationStep('idle');
    }
  };

  // Passo 2 - Buscar QR Code (polling a cada 2.5s)
  useEffect(() => {
    if (activationStep !== 'qr' || !instanceName) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`https://wpp-api-gabriel.fly.dev/instance/connect/${instanceName}`, {
          headers: {
            'apikey': 'PH9e2DFBUCiEaQ3SWgohGLupjsnkAv1f'
          }
        });
        const data = await response.json();

        if (data.status === 'qr' && data.qrcode?.base64) {
          setQrCodeBase64(data.qrcode.base64);
        } else if (data.status === 'open') {
          setActivationStep('connected');
        }
      } catch (error) {
        console.error("Erro ao buscar QR code:", error);
      }
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, 2500);

    return () => clearInterval(intervalId);
  }, [activationStep, instanceName]);

  const handleManualSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const userMsg = manualInput;
    setManualMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setManualInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://n8n-stack-n8n.29xxar.easypanel.host/webhook/a-sonho-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          sessionId: instanceName || 'manual-session',
          ...formData
        })
      });
      const data = await response.json();
      setManualMessages(prev => [...prev, { role: 'bot', text: data.resposta || "Mensagem simulada." }]);
    } catch (error) {
      console.error("Erro no chat manual:", error);
      setTimeout(() => {
        setManualMessages(prev => [...prev, { role: 'bot', text: "Sistema temporariamente indisponível." }]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const simData = chatSimulations[currentSimIndex];

  return (
    <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      {activationStep === 'idle' && (
        <div style={{ position: 'absolute', top: '-25px', right: '-30px', background: 'var(--success)', color: '#000', fontWeight: 'bold', padding: '8px 16px', borderRadius: '12px', transform: 'rotate(5deg)', zIndex: 20, boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)', animation: 'fadeIn 0.5s ease-out' }}>
          Crie seu atendente agora 👇
        </div>
      )}
      {activationStep === 'qr' && (
        <div style={{ position: 'absolute', top: '-25px', right: '-30px', background: 'var(--success)', color: '#000', fontWeight: 'bold', padding: '8px 16px', borderRadius: '12px', transform: 'rotate(5deg)', zIndex: 20, boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)', animation: 'fadeIn 0.5s ease-out' }}>
          Conecte para ver funcionando! 🚀
        </div>
      )}
      
      <div 
        className="glass-card" 
        style={{ 
          padding: 0, 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column', 
          height: '650px', 
          cursor: activationStep === 'idle' ? 'pointer' : 'default',
          transition: 'all 0.3s ease'
        }}
        onClick={() => activationStep === 'idle' && setActivationStep('form')}
      >
        
        {/* IDLE / FORM / LOADING share the chat background look partially */}
        {(activationStep === 'idle' || activationStep === 'form' || activationStep === 'loading') && (
          <>
            <div style={{ background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px var(--primary-glow)' }}>
                  <Bot size={24} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                    {simData.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block', boxShadow: '0 0 8px var(--success)' }}></span> 
                    {simData.niche}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, padding: '1.5rem', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              
              {/* Fake Chat Background */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: activationStep === 'idle' ? 1 : 0.2, transition: 'opacity 0.3s', animation: 'fadeIn 0.5s ease-out' }} key={currentSimIndex}>
                <div style={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg, var(--primary), rgba(139, 92, 246, 0.8))', borderRadius: '18px 18px 4px 18px', padding: '12px 16px', color: 'white', maxWidth: '85%', fontSize: '0.95rem' }}>
                  {simData.client}
                </div>
                <div style={{ alignSelf: 'flex-start', background: 'rgba(51, 65, 85, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', color: 'white', maxWidth: '85%', fontSize: '0.95rem' }}>
                  {simData.ai}
                </div>
              </div>

              {activationStep === 'idle' && (
                <div style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0, textAlign: 'center' }}>
                  <div className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', pointerEvents: 'none', animation: 'simPulse 2s infinite' }}>
                    Clique para testar no seu WhatsApp
                  </div>
                </div>
              )}

              {/* Overlays */}
              {activationStep === 'form' && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', animation: 'fadeInUp 0.3s ease-out' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
                    Configure seu Atendente
                  </h3>
                  <form onSubmit={handleSetupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nome do negócio</label>
                      <input type="text" required placeholder="Ex: Barbearia Elite" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nome do Atendente (IA)</label>
                      <input type="text" required placeholder="Ex: Ana, Carlos..." value={formData.agentName} onChange={e => setFormData({...formData, agentName: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nicho</label>
                      <input type="text" required placeholder="Ex: Estética, Delivery..." value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estilo do atendente</label>
                      <select value={formData.style} onChange={e => setFormData({...formData, style: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}>
                        <option value="Informal">Informal (Emojis, descontraído)</option>
                        <option value="Elegante">Elegante (Formal, polido)</option>
                        <option value="Direto">Direto (Focado em conversão)</option>
                      </select>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ marginTop: 'auto', padding: '1rem', width: '100%', borderRadius: '12px' }}>
                      Criar meu atendente <ArrowRight size={18} />
                    </button>
                  </form>
                </div>
              )}

              {activationStep === 'loading' && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid rgba(139, 92, 246, 0.2)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite', marginBottom: '2rem' }}></div>
                  <h3 style={{ fontSize: '1.2rem', color: 'white', fontWeight: 600, textAlign: 'center', animation: 'pulse 1.5s infinite' }}>
                    {loadingText}
                  </h3>
                </div>
              )}
            </div>
          </>
        )}

        {/* QR CODE STEP */}
        {activationStep === 'qr' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', marginBottom: '1rem' }}>
                <Smartphone size={28} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
                Teste no seu próprio WhatsApp
              </h2>
            </div>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', margin: '0 auto 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)' }}>
              {/* QR Code visual representation */}
              {qrCodeBase64 ? (
                <img src={qrCodeBase64} alt="QR Code do WhatsApp" style={{ width: '200px', height: '200px', borderRadius: '8px' }} />
              ) : (
                <div style={{ width: '200px', height: '200px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '3px solid #cbd5e1', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gerando QR...</span>
                </div>
              )}
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Escaneie o QR Code e converse com seu atendente IA gratuitamente por 10 minutos.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>
                <CheckCircle2 size={18} color="var(--success)" /> responde clientes
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>
                <CheckCircle2 size={18} color="var(--success)" /> agenda automaticamente
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>
                <CheckCircle2 size={18} color="var(--success)" /> funciona 24h
              </div>
            </div>

            <button 
              onClick={() => setActivationStep('manual-chat')}
              style={{ marginTop: 'auto', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Testar por aqui mesmo
            </button>
          </div>
        )}

        {/* MANUAL CHAT STEP */}
        {activationStep === 'manual-chat' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f172a', animation: 'fadeIn 0.5s ease-out', height: '100%' }}>
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="white" />
              </div>
              <div>
                <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem', margin: 0 }}>
                  {formData.agentName || 'Seu Atendente'}
                </h3>
                <div style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 500 }}>
                  Online
                </div>
              </div>
            </div>

            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {manualMessages.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary), rgba(139, 92, 246, 0.8))' : 'rgba(51, 65, 85, 0.6)', border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '12px 16px', color: 'white', maxWidth: '85%', fontSize: '0.95rem' }}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(51, 65, 85, 0.6)', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', color: 'white', maxWidth: '85%', fontSize: '0.95rem', display: 'flex', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1s infinite' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1s infinite 0.2s' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1s infinite 0.4s' }} />
                </div>
              )}
            </div>

            <form onSubmit={handleManualSend} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={manualInput} 
                onChange={e => setManualInput(e.target.value)} 
                placeholder="Digite sua mensagem..." 
                style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} 
              />
              <button type="submit" disabled={isTyping} style={{ background: 'var(--primary)', border: 'none', borderRadius: '12px', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isTyping ? 'default' : 'pointer', opacity: isTyping ? 0.5 : 1 }}>
                <ArrowRight size={20} color="white" />
              </button>
            </form>
          </div>
        )}

        {/* CONNECTED / DASHBOARD STEP */}
        {activationStep === 'connected' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f172a', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Dashboard Header */}
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={28} color="white" />
                </div>
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '18px', height: '18px', background: 'var(--success)', borderRadius: '50%', border: '3px solid #0f172a' }}></div>
              </div>
              <div>
                <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>Cliente Conectado</h3>
                <div style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Activity size={14} /> Sistema operando
                </div>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={14} /> Msg Recebidas
                </div>
                <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800 }}>12</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} /> Leads Ativos
                </div>
                <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800 }}>3</div>
              </div>
            </div>

            {/* Live Feed */}
            <div style={{ flex: 1, padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                Feed em tempo real
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', animation: 'fadeInUp 0.4s ease-out' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }}></div>
                  <div>
                    <div style={{ color: 'white', fontSize: '0.95rem', fontWeight: 500 }}>Novo contato recebido</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>IA iniciou o atendimento de qualificação.</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '4px' }}>Agora mesmo</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', animation: 'fadeInUp 0.4s ease-out 0.2s backwards' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginTop: '6px' }}></div>
                  <div>
                    <div style={{ color: 'white', fontSize: '0.95rem', fontWeight: 500 }}>Agendamento Confirmado</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Cliente aceitou o horário sugerido.</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '4px' }}>Há 2 min</div>
                  </div>
                </div>
              </div>

              <button onClick={onCheckout} className="btn btn-primary" style={{ marginTop: 'auto', padding: '1rem', width: '100%', borderRadius: '12px', fontWeight: 700, display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <Zap size={20} /> Assinar e Manter Ativo
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
