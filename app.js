/**
 * HelpCorp - Plataforma de Gestão de Chamados Internos Corporativos (IXM)
 * Interactive Application Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSimulator();
  initRoiCalculator();
  initFaqAccordion();
  initDemoModal();
  initToastNotification();
});

/* ==========================================================================
   1. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   2. Interactive HelpCorp Simulator (Camila / Ricardo / Chatbot)
   ========================================================================== */
function initSimulator() {
  // Tab Switcher
  const tabBtns = document.querySelectorAll('[data-sim-tab]');
  const tabContents = document.querySelectorAll('.sim-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-sim-tab');

      // Update tabs active state
      tabBtns.forEach(b => {
        b.classList.remove('sim-tab-active', 'text-sky-400', 'border-sky-400');
        b.classList.add('text-slate-400', 'border-transparent');
      });
      btn.classList.add('sim-tab-active', 'text-sky-400', 'border-sky-400');
      btn.classList.remove('text-slate-400', 'border-transparent');

      // Update views
      tabContents.forEach(content => {
        if (content.id === `sim-${targetTab}`) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });

  // --- Sub-Module 1: Visão da Solicitante (Camila) ---
  const ticketDescInput = document.getElementById('camila-desc');
  const aiTriageBox = document.getElementById('ai-triage-box');
  const aiCategory = document.getElementById('ai-category');
  const aiUrgency = document.getElementById('ai-urgency');
  const aiSla = document.getElementById('ai-sla');
  const aiKbSuggestion = document.getElementById('ai-kb-suggestion');
  const submitTicketBtn = document.getElementById('btn-submit-ticket');
  const ticketSuccessModal = document.getElementById('ticket-success-box');
  const prefillBtns = document.querySelectorAll('[data-prefill]');

  const sampleScenarios = {
    notebook: {
      text: "Meu notebook corporativo Dell travou e não liga mais. Tenho entrega de campanha de marketing hoje às 18h e preciso de substituição urgente.",
      category: "TI > Hardware > Notebooks",
      urgency: "Crítica / Alta",
      sla: "4h úteis (SLA Preditivo)",
      kb: "Tutorial: 3 procedimentos para reinicialização forçada do Dell Latitude 5420"
    },
    reembolso: {
      text: "Gostaria de solicitar o reembolso de despesas de alimentação e transporte da viagem para o evento de inovação em SP.",
      category: "Financeiro > Contas a Pagar > Reembolso",
      urgency: "Média",
      sla: "24h úteis",
      kb: "Política de Reembolso de Viagens e Relatório de Despesas 2026"
    },
    acesso: {
      text: "Preciso de liberação de acesso ao módulo de CRM e SAP para os novos estagiários da equipe comercial que começam na segunda.",
      category: "TI > Sistemas & Acessos > SAP ERP",
      urgency: "Alta",
      sla: "8h úteis",
      kb: "Fluxo de Solicitação de Acessos com Aprovação de Gestor"
    }
  };

  function updateAiTriage(scenarioKey) {
    const data = sampleScenarios[scenarioKey] || sampleScenarios.notebook;
    if (ticketDescInput) ticketDescInput.value = data.text;

    // Simulate AI typing / analysis
    if (aiTriageBox) {
      aiTriageBox.classList.remove('opacity-50');
      aiCategory.innerHTML = `<span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span>${data.category}</span>`;
      aiUrgency.innerHTML = `<span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>${data.urgency}</span>`;
      aiSla.textContent = data.sla;
      aiKbSuggestion.textContent = data.kb;
    }
  }

  prefillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-prefill');
      updateAiTriage(key);
    });
  });

  // Dynamic analysis on input typing
  if (ticketDescInput) {
    ticketDescInput.addEventListener('input', () => {
      const val = ticketDescInput.value.toLowerCase();
      if (val.includes('notebook') || val.includes('computador') || val.includes('tela') || val.includes('travou')) {
        updateAiTriage('notebook');
      } else if (val.includes('reembolso') || val.includes('nota') || val.includes('financeiro') || val.includes('dinheiro')) {
        updateAiTriage('reembolso');
      } else if (val.includes('sap') || val.includes('acesso') || val.includes('login') || val.includes('senha')) {
        updateAiTriage('acesso');
      }
    });
  }

  // Submit Simulated Ticket
  if (submitTicketBtn && ticketSuccessModal) {
    submitTicketBtn.addEventListener('click', () => {
      submitTicketBtn.disabled = true;
      submitTicketBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg> Processando com IA...
      `;

      setTimeout(() => {
        ticketSuccessModal.classList.remove('hidden');
        submitTicketBtn.disabled = false;
        submitTicketBtn.innerHTML = `
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          Chamado Enviado com Sucesso!
        `;
        showToast("🚀 Notificação Push: Chamado #4821 atribuído a Ricardo Mendes (TI) com SLA de 4h.");
      }, 750);
    });
  }

  // --- Sub-Module 2: Visão do Gestor (Ricardo) ---
  const filterBtns = document.querySelectorAll('[data-filter-queue]');
  const queueItems = document.querySelectorAll('.ticket-queue-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-sky-500', 'text-white');
        b.classList.add('bg-slate-800', 'text-slate-400');
      });
      btn.classList.remove('bg-slate-800', 'text-slate-400');
      btn.classList.add('bg-sky-500', 'text-white');

      const filter = btn.getAttribute('data-filter-queue');
      queueItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-sector') === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- Sub-Module 3: Chatbot com IA Generativa ---
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const quickChatPills = document.querySelectorAll('[data-chat-prompt]');

  const chatbotResponses = {
    "como solicitar cracha novo": "Para solicitar a 2ª via ou novo crachá corporativo:\n1. Acesse a categoria **Facilities > Crachás & Acesso Físico**.\n2. Anexe uma foto 3x4 recente em alta resolução.\n3. O prazo de confecção é de **2 dias úteis**. Deseja que eu abra este chamado automaticamente para você agora?",
    "como pedir reembolso de viagem": "A política corporativa de reembolso estabelece:\n• Comprovantes fiscais devem conter o CNPJ da matriz.\n• Limite diário de alimentação: R$ 85,00.\n• Anexe os cupons fiscais no formulário do **Financeiro**.\n\nPosso abrir o chamado e enviar para a aprovação do seu gestor imediato.",
    "notebook travou e nao liga": "Detectei que você está enfrentando problemas de hardware no notebook. Como você possui uma entrega iminente, já classifiquei a solicitação como **Urgência Alta** e pré-aloquei um equipamento reserva de backup com o técnico **Lucas Silva** (Bancada TI, 3º andar).",
    "default": "Compreendido! O HelpCorp IXM processou sua solicitação utilizando nosso modelo de linguagem corporativo. O chamado foi estruturado em conformidade com as regras de governança e encaminhado ao setor competente com SLA garantido."
  };

  function sendChatMessage(text) {
    if (!text.trim() || !chatMessages) return;

    // Add user bubble
    const userBubble = document.createElement('div');
    userBubble.className = "flex items-start justify-end gap-2.5";
    userBubble.innerHTML = `
      <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-3.5 border-gray-200 bg-sky-600 rounded-s-xl rounded-ee-xl text-white text-sm shadow-md">
        <p>${text}</p>
      </div>
      <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-sky-300 shrink-0">CR</div>
    `;
    chatMessages.appendChild(userBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (chatInput) chatInput.value = '';

    // Add typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = "flex items-start gap-2.5";
    typingIndicator.id = "chat-typing";
    typingIndicator.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">IA</div>
      <div class="p-3 bg-slate-800 border border-slate-700 rounded-e-xl rounded-es-xl text-xs text-purple-300 flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></span>
        <span class="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style="animation-delay: 0.2s"></span>
        <span class="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style="animation-delay: 0.4s"></span>
        <span>Consultando Base Curada...</span>
      </div>
    `;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI response
    setTimeout(() => {
      const typing = document.getElementById('chat-typing');
      if (typing) typing.remove();

      let key = "default";
      const clean = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (clean.includes("cracha")) key = "como solicitar cracha novo";
      else if (clean.includes("reembolso") || clean.includes("viagem")) key = "como pedir reembolso de viagem";
      else if (clean.includes("notebook") || clean.includes("computador") || clean.includes("travou")) key = "notebook travou e nao liga";

      const replyText = chatbotResponses[key] || chatbotResponses.default;

      const aiBubble = document.createElement('div');
      aiBubble.className = "flex items-start gap-2.5";
      aiBubble.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg shadow-purple-500/30">IA</div>
        <div class="flex flex-col w-full max-w-[340px] leading-relaxed p-3.5 border border-purple-500/20 bg-slate-800/90 rounded-e-xl rounded-es-xl text-slate-200 text-sm shadow-md">
          <div class="flex items-center gap-2 mb-1.5 pb-1 border-b border-slate-700/60 text-xs text-purple-300">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="font-medium">HelpCorp AI Assistant</span>
            <span class="ml-auto text-[10px] text-slate-400">Autocuradoria ativa</span>
          </div>
          <p class="whitespace-pre-line text-xs sm:text-sm text-slate-300">${replyText}</p>
        </div>
      `;
      chatMessages.appendChild(aiBubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
  }

  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', () => sendChatMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage(chatInput.value);
    });
  }

  quickChatPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const prompt = pill.getAttribute('data-chat-prompt');
      sendChatMessage(prompt);
    });
  });
}

/* ==========================================================================
   3. ROI & Business Impact Calculator (Gartner & SENAC Study Metrics)
   ========================================================================== */
function initRoiCalculator() {
  const empSlider = document.getElementById('roi-employees');
  const empCountDisplay = document.getElementById('roi-employees-count');
  const ticketsPerMonthDisplay = document.getElementById('roi-tickets-month');
  const aiResolvedDisplay = document.getElementById('roi-ai-resolved');
  const hoursSavedDisplay = document.getElementById('roi-hours-saved');
  const moneySavedDisplay = document.getElementById('roi-money-saved');

  if (!empSlider) return;

  function recalculate() {
    const employees = parseInt(empSlider.value, 10);
    if (empCountDisplay) empCountDisplay.textContent = employees.toLocaleString('pt-BR');

    // Model parameters based on HelpCorp SENAC document:
    // Average 1.2 tickets/month per employee across all departments (TI, RH, Fin, Fac)
    const totalTickets = Math.round(employees * 1.2);
    // 35% resolved automatically via Generative AI Chatbot without human intervention
    const aiResolved = Math.round(totalTickets * 0.35);
    // 40% reduction in resolution time (TMR) across all tickets, saving ~1.4h per ticket handled
    const hoursSaved = Math.round((totalTickets * 1.4) * 0.40 + (aiResolved * 1.5));
    // Financial savings based on Brazilian average hourly cost of support analyst (R$ 55/h loaded)
    const annualMoneySaved = Math.round(hoursSaved * 55 * 12);

    if (ticketsPerMonthDisplay) ticketsPerMonthDisplay.textContent = totalTickets.toLocaleString('pt-BR');
    if (aiResolvedDisplay) aiResolvedDisplay.textContent = aiResolved.toLocaleString('pt-BR') + "/mês";
    if (hoursSavedDisplay) hoursSavedDisplay.textContent = hoursSaved.toLocaleString('pt-BR') + "h/mês";
    if (moneySavedDisplay) moneySavedDisplay.textContent = "R$ " + (annualMoneySaved).toLocaleString('pt-BR');
  }

  empSlider.addEventListener('input', recalculate);
  recalculate();
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-trigger');

  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const content = item.nextElementSibling;
      const icon = item.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      // Close other accordions
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ==========================================================================
   5. Modal de Demonstração / Contato
   ========================================================================== */
function initDemoModal() {
  const openModalBtns = document.querySelectorAll('[data-open-demo-modal]');
  const modal = document.getElementById('demo-modal');
  const closeModalBtns = document.querySelectorAll('[data-close-demo-modal]');
  const demoForm = document.getElementById('demo-form');
  const formSuccess = document.getElementById('demo-form-success');

  if (!modal) return;

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      if (demoForm && formSuccess) {
        demoForm.classList.remove('hidden');
        formSuccess.classList.add('hidden');
      }
    });
  });

  // Backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  // Submit
  if (demoForm && formSuccess) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = demoForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Agendando Apresentação...";

      setTimeout(() => {
        demoForm.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Solicitar Apresentação Personalizada";
        showToast("✨ Agendamento confirmado! Enviamos um convite com link de demonstração.");
      }, 700);
    });
  }
}

/* ==========================================================================
   6. Toast Notifications
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 border border-sky-500/40 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 transform translate-y-20 opacity-0 transition-all duration-300 max-w-md text-sm font-medium';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
    <span class="flex-1">${message}</span>
  `;

  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 4500);
}
function initToastNotification() {
  // Toast container is lazily created on demand
}
