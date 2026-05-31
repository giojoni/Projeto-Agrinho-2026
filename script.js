const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contrastToggle = document.querySelector("#contrast-toggle");
const readingToggle = document.querySelector("#reading-toggle");
const scrollProgressBar = document.querySelector("#scroll-progress-bar");
const topButton = document.querySelector("#top-button");

const savedContrast = localStorage.getItem("highContrast") === "true";
const savedReading = localStorage.getItem("readingMode") === "true";

document.body.classList.toggle("high-contrast", savedContrast);
document.body.classList.toggle("reading-mode", savedReading);
contrastToggle.setAttribute("aria-pressed", String(savedContrast));
readingToggle.setAttribute("aria-pressed", String(savedReading));

// Controla o menu mobile sem usar eventos inline no HTML.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

// Recursos simples de acessibilidade: contraste alto e modo leitura.
contrastToggle.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("high-contrast");
  contrastToggle.setAttribute("aria-pressed", String(enabled));
  localStorage.setItem("highContrast", String(enabled));
});

readingToggle.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("reading-mode");
  readingToggle.setAttribute("aria-pressed", String(enabled));
  localStorage.setItem("readingMode", String(enabled));
});

// Atualiza a barra de progresso e mostra o botão de voltar ao topo.
function updateScrollEffects() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;
  topButton.classList.toggle("is-visible", window.scrollY > 460);
}

window.addEventListener("scroll", updateScrollEffects);
window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Revela seções gradualmente conforme entram na tela.
const revealItems = document.querySelectorAll("main > section, .project-file");
revealItems.forEach((item) => item.classList.add("reveal-on-scroll"));

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Destaca o link da seção atual enquanto a página é percorrida.
const navAnchors = document.querySelectorAll(".nav-links a");
const linkedSections = [...navAnchors]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  linkedSections.forEach((section) => navObserver.observe(section));
}

const supportCases = {
  "Falta de dinheiro para investir": {
    diagnostic: "A família identifica melhorias importantes, mas não tem capital seguro para investir sem colocar a renda em risco.",
    policy: "Crédito rural orientado com acompanhamento técnico.",
    steps: [
      "levantar custos reais da melhoria desejada",
      "priorizar investimentos que aumentem produção ou reduzam perdas",
      "buscar orientação técnica antes de assumir financiamento",
      "comparar prazos, juros e capacidade de pagamento"
    ],
    result: "A propriedade ganha estrutura, produtividade e mais segurança para planejar a próxima safra.",
    impact: "Com renda mais estável, a família compra na região, abastece a feira e fortalece a economia local.",
    priority: "Alta",
    tags: ["Renda", "Estrutura", "Comunidade"]
  },
  "Dificuldade para vender": {
    diagnostic: "O alimento é produzido, mas a família não encontra canais de venda justos, constantes e próximos.",
    policy: "Compra pública, feiras locais, cooperativas e circuitos curtos de comercialização.",
    steps: [
      "mapear escolas, feiras e instituições compradoras",
      "organizar calendário de produção e entrega",
      "participar de associação para vender em conjunto",
      "mostrar origem e qualidade dos produtos"
    ],
    result: "As vendas ficam menos dependentes de atravessadores e o preço tende a ser mais justo.",
    impact: "A cidade passa a consumir alimentos locais e reconhece melhor quem produz.",
    priority: "Alta",
    tags: ["Mercado", "Renda", "Comunidade"]
  },
  "Falta de orientação técnica": {
    diagnostic: "Sem apoio especializado, problemas de solo, pragas, gestão e produtividade podem se repetir.",
    policy: "Assistência técnica e extensão rural.",
    steps: [
      "registrar dificuldades observadas na produção",
      "procurar serviço municipal, estadual ou cooperativo de assistência",
      "participar de oficinas e dias de campo",
      "testar mudanças em pequena escala antes de ampliar"
    ],
    result: "A família toma decisões com mais informação e reduz erros caros.",
    impact: "A comunidade ganha produção mais qualificada e produtores mais autônomos.",
    priority: "Média",
    tags: ["Conhecimento", "Tecnologia", "Sustentabilidade"]
  },
  "Perdas por desperdício": {
    diagnostic: "Parte da produção se perde por falta de armazenamento, processamento, venda rápida ou logística.",
    policy: "Apoio à agroindústria familiar, logística curta e gestão de pós-colheita.",
    steps: [
      "identificar em qual etapa a perda acontece",
      "melhorar seleção, embalagem e armazenamento",
      "planejar produção conforme demanda",
      "transformar excedentes em produtos com maior duração"
    ],
    result: "Mais alimento é aproveitado e a renda melhora sem aumentar a área plantada.",
    impact: "Escolas, feiras e famílias recebem mais alimentos, com menor desperdício.",
    priority: "Média",
    tags: ["Renda", "Sustentabilidade", "Mercado"]
  },
  "Pouco acesso à tecnologia": {
    diagnostic: "A falta de conexão, ferramentas digitais e dados limita vendas, previsão climática e gestão.",
    policy: "Inclusão digital rural, internet no campo e inovação acessível.",
    steps: [
      "começar com controle simples de custos e estoque",
      "usar previsão climática e comunicação digital com compradores",
      "buscar cursos de tecnologia rural",
      "defender projetos de conectividade para a comunidade"
    ],
    result: "A família passa a planejar melhor, divulgar produtos e responder mais rápido a problemas.",
    impact: "Campo, escola e cidade ficam mais conectados por informação e comércio local.",
    priority: "Média",
    tags: ["Tecnologia", "Mercado", "Comunidade"]
  },
  "Produção afetada pelo clima": {
    diagnostic: "Seca, chuva forte e calor extremo tornam a produção instável e ameaçam a renda familiar.",
    policy: "Seguro ou apoio climático, assistência técnica e práticas de adaptação.",
    steps: [
      "diversificar cultivos para reduzir risco",
      "proteger o solo com cobertura e rotação",
      "usar água com mais eficiência",
      "acompanhar alertas climáticos e buscar seguro quando disponível"
    ],
    result: "A propriedade fica mais preparada para períodos difíceis e reduz perdas.",
    impact: "A comunidade mantém abastecimento local mesmo em cenários climáticos instáveis.",
    priority: "Urgente",
    tags: ["Sustentabilidade", "Segurança", "Comunidade"]
  },
  "Baixa valorização do produto local": {
    diagnostic: "O alimento local chega à cidade, mas seu valor social, cultural e ambiental nem sempre é reconhecido.",
    policy: "Educação alimentar, campanhas locais, venda direta e identidade territorial.",
    steps: [
      "contar a história da família produtora",
      "identificar produtos com origem local",
      "aproximar escolas de feiras e produtores",
      "promover campanhas contra desperdício e compra sem origem"
    ],
    result: "Os produtos ganham reconhecimento e podem alcançar preços mais justos.",
    impact: "Consumidores passam a entender que comprar local também é uma decisão de cidadania.",
    priority: "Baixa",
    tags: ["Comunidade", "Mercado", "Cultura"]
  }
};

const productionNotes = {
  "Horta familiar": "Na horta, pequenas melhorias em irrigação, compostagem e venda rápida costumam ter impacto direto.",
  "Alimentos variados": "Na produção diversificada, o apoio precisa respeitar várias culturas e organizar prioridades.",
  "Leite e derivados": "No leite e derivados, qualidade, resfriamento, higiene e regularidade são pontos decisivos.",
  "Agroindústria familiar": "Na agroindústria, embalagem, boas práticas e regularização aumentam valor agregado.",
  "Produção agroecológica": "Na agroecologia, práticas ambientais e confiança do consumidor devem caminhar juntas.",
  "Venda em feira": "Na feira, apresentação, regularidade e relação direta com consumidores fortalecem renda."
};

const goalNotes = {
  "Aumentar renda": "O plano deve priorizar preço justo, produtividade e canais de venda mais estáveis.",
  "Reduzir perdas": "O foco precisa estar em armazenamento, planejamento, logística e aproveitamento de excedentes.",
  "Vender direto": "A estratégia deve aproximar produtor e consumidor, reduzindo intermediários.",
  "Produzir de forma sustentável": "O caminho deve proteger solo, água e biodiversidade sem abandonar a renda.",
  "Melhorar estrutura": "A prioridade é investir com segurança em equipamentos, irrigação, transporte ou beneficiamento.",
  "Acessar novos mercados": "O plano precisa combinar organização, qualidade, divulgação e parcerias."
};

const priorityOrder = ["Baixa", "Média", "Alta", "Urgente"];
const planParts = ["Diagnóstico", "Política", "Primeiros passos", "Resultado", "Impacto social"];

const caseForm = document.querySelector("#case-form");
const planOutput = document.querySelector("#plan-output");

// Gera o plano de apoio com base nas três escolhas do usuário.
caseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const difficulty = document.querySelector("#difficulty").value;
  const production = document.querySelector("#production").value;
  const goal = document.querySelector("#goal").value;

  if (!difficulty || !production || !goal) {
    planOutput.innerHTML = `<div class="waiting-plan"><span>Dados incompletos</span><p>Preencha as três escolhas para gerar o plano.</p></div>`;
    return;
  }

  renderPlan(difficulty, production, goal);
});

// Monta o resultado visual do painel e controla as abas internas.
function renderPlan(difficulty, production, goal) {
  const data = supportCases[difficulty];
  const tags = [...new Set([...data.tags, goal.includes("sustentável") ? "Sustentabilidade" : "", production.includes("feira") ? "Mercado" : ""])].filter(Boolean);
  const tabs = planParts.map((part, index) => `<button type="button" role="tab" aria-selected="${index === 0}" data-tab="${index}">${part}</button>`).join("");
  const priorityItems = priorityOrder.map((item) => `<span class="${item === data.priority ? "active" : ""}">${item}</span>`).join("");

  planOutput.innerHTML = `
    <div class="plan-shell">
      <div class="plan-topline">
        <div>
          <strong>Caso montado</strong>
          <p>${production} com foco em ${goal.toLowerCase()}.</p>
        </div>
        <div class="tag-row">${tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </div>
      <div class="priority-ruler" aria-label="Prioridade do caso: ${data.priority}">
        <strong>Régua de prioridade</strong>
        <div class="ruler-track">${priorityItems}</div>
      </div>
      <div class="plan-tabs" role="tablist" aria-label="Partes do plano de apoio">${tabs}</div>
      <article class="plan-stage" id="plan-stage"></article>
    </div>
  `;

  const stageData = [
    {
      title: "1. Diagnóstico",
      body: `${data.diagnostic} ${productionNotes[production]} ${goalNotes[goal]}`
    },
    {
      title: "2. Política de incentivo indicada",
      body: data.policy
    },
    {
      title: "3. Primeiros passos",
      list: data.steps
    },
    {
      title: "4. Resultado esperado",
      body: data.result
    },
    {
      title: "5. Impacto social",
      body: data.impact
    }
  ];

  const stage = document.querySelector("#plan-stage");
  const tabButtons = planOutput.querySelectorAll("[role='tab']");

  function activateTab(index) {
    tabButtons.forEach((button, buttonIndex) => {
      button.setAttribute("aria-selected", String(buttonIndex === index));
    });

    const current = stageData[index];
    const content = current.list
      ? `<ul>${current.list.map((item) => `<li>${item}</li>`).join("")}</ul>`
      : `<p>${current.body}</p>`;

    stage.innerHTML = `<h3>${current.title}</h3>${content}`;
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => activateTab(Number(button.dataset.tab)));
  });

  activateTab(0);
}

// Abre e fecha as gavetas de políticas públicas com aria-expanded.
document.querySelectorAll(".drawer button").forEach((button) => {
  button.addEventListener("click", () => {
    const drawer = button.closest(".drawer");
    const isOpen = drawer.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const decisions = [
  {
    situation: "Uma família produz verduras, mas perde parte da produção porque não consegue vender a tempo.",
    options: ["Compra pública e feira local", "Retirar apoio técnico", "Aumentar atravessadores"],
    answer: 0
  },
  {
    situation: "Um produtor quer melhorar a irrigação, mas não tem dinheiro para investir.",
    options: ["Crédito orientado + assistência técnica", "Esperar a próxima seca passar", "Comprar equipamentos sem planejamento"],
    answer: 0
  },
  {
    situation: "Uma comunidade rural não tem orientação sobre solo e pragas.",
    options: ["Assistência técnica", "Abandonar a produção local", "Vender por preço menor sem investigar o problema"],
    answer: 0
  },
  {
    situation: "Produtos locais são pouco valorizados na cidade.",
    options: ["Campanhas, feiras, venda direta e educação alimentar", "Esconder a origem dos alimentos", "Reduzir a relação entre escola e campo"],
    answer: 0
  }
];

const decisionQuestions = document.querySelector("#decision-questions");
const decisionForm = document.querySelector("#decision-form");
const decisionResult = document.querySelector("#decision-result");

// Renderiza a simulação de decisões públicas a partir do array de situações.
decisionQuestions.innerHTML = decisions.map((item, questionIndex) => {
  const options = item.options.map((option, optionIndex) => `
    <label>
      <input type="radio" name="decision-${questionIndex}" value="${optionIndex}" required>
      <span>${option}</span>
    </label>
  `).join("");

  return `
    <article class="decision-case">
      <fieldset>
        <legend>Situação ${questionIndex + 1}: ${item.situation}</legend>
        ${options}
      </fieldset>
    </article>
  `;
}).join("");

// Calcula a pontuação e apresenta um perfil educativo ao usuário.
decisionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let score = 0;
  decisions.forEach((item, index) => {
    const selected = decisionForm.querySelector(`input[name="decision-${index}"]:checked`);
    if (selected && Number(selected.value) === item.answer) {
      score += 1;
    }
  });

  let profile = "Precisa revisar os caminhos de apoio";
  if (score === decisions.length) {
    profile = "Gestor consciente";
  } else if (score >= 2) {
    profile = "Aprendiz de políticas públicas";
  }

  const message = score >= 3
    ? "Suas escolhas mostram atenção aos caminhos que fortalecem renda, mercado e comunidade."
    : "Revise as políticas do painel e observe como cada apoio resolve um tipo diferente de problema.";

  decisionResult.textContent = `Pontuação: ${score}/${decisions.length}. Perfil: ${profile}. ${message}`;
});
