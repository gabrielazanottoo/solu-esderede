const scenariosData = {
    1: {
        title: "Computador Sem Acesso à Internet",
        status: "Falha de Conectividade Externa (WAN)",
        description: "O computador está conectado à rede local (LAN), consegue se comunicar com outros dispositivos locais, mas não consegue carregar páginas da Web ou acessar serviços fora da rede local.",
        causes: [
            "Gateway Padrão (Roteador) incorreto ou não configurado.",
            "Roteador/Modem da operadora desconectado da internet.",
            "Regras de Firewall/Proxy bloqueando o tráfego de saída.",
            "Problema de rota na operadora de telecomunicações (ISP)."
        ],
        diagnostics: [
            "Execute 'ipconfig' para verificar se o campo Gateway Padrão possui um IP válido (ex: 192.168.1.1).",
            "Execute 'ping 127.0.0.1' para testar a pilha de protocolos TCP/IP local.",
            "Execute 'ping <IP_DO_GATEWAY>' para verificar a comunicação local com o roteador.",
            "Execute 'ping 8.8.8.8' para testar o acesso direto por IP à internet.",
            "Execute 'tracert 8.8.8.8' para identificar em qual salto a conexão é interrompida."
        ],
        solutions: [
            "Configurar o IP correto do Gateway Padrão nas propriedades da placa de rede ou DHCP.",
            "Reiniciar o Modem/Roteador de borda.",
            "Verificar as tabelas de roteamento do roteador e status junto ao Provedor de Internet."
        ]
    },
    2: {
        title: "Endereço IP Incorreto (APIPA / Máscara Invalida)",
        status: "Falha de Endereçamento IP",
        description: "A placa de rede do computador exibe um endereço IP na faixa 169.254.X.X (APIPA) ou possui um IP fixo em uma sub-rede diferente da rede local (ex: IP 10.0.0.15 numa rede 192.168.1.X).",
        causes: [
            "Servidor DHCP indisponível, desligado ou com o pool de IPs esgotado.",
            "Configuração de IP estático manual incorreta inserida pelo usuário.",
            "Máscara de sub-rede incompatível com o Gateway Padrão."
        ],
        diagnostics: [
            "Execute 'ipconfig' e observe o campo Endereço IPv4. Se começar com 169.254, o DHCP falhou.",
            "Execute 'ipconfig /release' seguido de 'ipconfig /renew' para solicitar um novo IP ao DHCP."
        ],
        solutions: [
            "Verificar a conectividade e o serviço do Servidor DHCP no roteador/servidor.",
            "Alterar a interface de rede para 'Obter um endereço IP automaticamente' (DHCP).",
            "Definir manualmente um IP válido dentro do mesmo segmento da rede (ex: 192.168.1.50/24)."
        ]
    },
    3: {
        title: "Problema de Resolução de DNS",
        status: "Falha de Resolução de Nomes",
        description: "O computador consegue pingar endereços IP numéricos na internet (ex: 'ping 8.8.8.8' funciona), mas falha ao tentar acessar sites pelo nome de domínio (ex: 'ping google.com' resulta em erro).",
        causes: [
            "Servidores DNS configurados na placa de rede estão offline ou inacessíveis.",
            "Cache de DNS local no sistema operacional corrompido.",
            "Bloqueio na porta 53 (UDP/TCP) pelo firewall."
        ],
        diagnostics: [
            "Execute 'ping 8.8.8.8' (Se responder, a internet está funcionando).",
            "Execute 'ping google.com' (Se falhar, o problema é DNS).",
            "Execute 'nslookup google.com' para identificar qual servidor DNS está respondendo e qual erro ocorre."
        ],
        solutions: [
            "Limpar o cache DNS com o comando 'ipconfig /flushdns'.",
            "Alterar os servidores DNS para endereços públicos confiáveis (Ex: Google 8.8.8.8 / 8.8.4.4 ou Cloudflare 1.1.1.1).",
            "Reiniciar o serviço de cliente DNS da máquina."
        ]
    },
    4: {
        title: "Cabo de Rede Desconectado ou com Defeito",
        status: "Falha na Camada Física (Camada 1 OSI)",
        description: "O sistema operacional indica 'Cabo de Rede Desconectado' (Media State: Media disconnected) ou a conexão fica oscilando caindo constantemente.",
        causes: [
            "Cabo UTP/RJ45 desconectado do computador ou da tomada de parede/switch.",
            "Trava do conector RJ45 quebrada ou pinos oxidados.",
            "Cabo quebrado internamente (defeito de crimpagem ou dobra excessiva).",
            "Porta do Switch ou da Placa de Rede queimada/danificada."
        ],
        diagnostics: [
            "Execute 'ipconfig' (exibirá 'Mídia desconectada' / 'Media disconnected').",
            "Verificar visualmente os LEDs de Link (Luz verde/laranja) na porta RJ45 do computador e do Switch.",
            "Utilizar um testador de cabos de rede (Cable Tester) para verificar os 8 vias."
        ],
        solutions: [
            "Reencaixar o cabo com firmeza até ouvir o estalo do conector.",
            "Substituir o cabo de rede por um patch cord novo (Cat5e ou Cat6).",
            "Conectar o cabo em outra porta do Switch/Roteador.",
            "Refazer a crimpagem do cabo seguindo o padrão T568B."
        ]
    },
    5: {
        title: "Conflito de Endereço IP",
        status: "Duplicidade de Endereçamento (Camada 3 OSI)",
        description: "O Windows exibe um alerta pop-up informando 'Um conflito de endereço IP foi detectado na rede'. Ambos os computadores afetados perdem a conectividade de forma intermitente.",
        causes: [
            "Dois dispositivos configurados manualmente com o mesmo IP estático.",
            "Um dispositivo possui IP fixo configurado dentro do escopo dinâmico atribuído pelo servidor DHCP."
        ],
        diagnostics: [
            "Execute 'arp -a' no terminal para visualizar a tabela ARP e identificar o endereço MAC conflitante.",
            "Verificar os Logs de Eventos do Windows (Event Viewer) sob o ID de Evento 4199."
        ],
        solutions: [
            "Em uma das máquinas, execute 'ipconfig /release' e 'ipconfig /renew' para obter um IP livre do DHCP.",
            "Ajustar a faixa de IP estático para fora do intervalo reservado ao DHCP no roteador.",
            "Mapear e documentar os IPs fixos da rede local para evitar duplicidade."
        ]
    }
};


const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 45;
const maxDistance = 120;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = 2.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(6, 182, 212, ${1 - dist / maxDistance})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateCanvas);
}
animateCanvas();


const detailsContainer = document.getElementById('scenario-details');
const scenarioButtons = document.querySelectorAll('.scenario-btn');

function renderScenario(id) {
    const data = scenariosData[id];
    if (!data) return;

    detailsContainer.innerHTML = `
        <div class="detail-block">
            <h3>📌 ${data.title}</h3>
            <p><strong>Status:</strong> <span class="code-badge">${data.status}</span></p>
        </div>
        <div class="detail-block">
            <h3>📝 O que está acontecendo?</h3>
            <p>${data.description}</p>
        </div>
        <div class="detail-block">
            <h3>❓ Causas Prováveis:</h3>
            <ul>
                ${data.causes.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </div>
        <div class="detail-block">
            <h3>🛠️ Procedimentos e Comandos para Identificar:</h3>
            <ul>
                ${data.diagnostics.map(d => `<li>${d}</li>`).join('')}
            </ul>
        </div>
        <div class="detail-block">
            <h3>✅ Como Resolver o Problema:</h3>
            <ul>
                ${data.solutions.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </div>
    `;
}

scenarioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        scenarioButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderScenario(btn.dataset.scenario);
    });
});


renderScenario(1);


const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

terminalInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const cmd = this.value.trim().toLowerCase();
        if (cmd !== "") {
            printTerminalLine(`C:\\Users\\SuporteNetwork> ${this.value}`, 'color: #38bdf8;');
            executeCommand(cmd);
            this.value = '';
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }
});

function printTerminalLine(text, style = '') {
    const p = document.createElement('p');
    p.textContent = text;
    if (style) p.style.cssText = style;
    terminalOutput.appendChild(p);
}

function executeCommand(cmd) {
    switch (cmd) {
        case 'help':
            printTerminalLine("Comandos disponíveis:");
            printTerminalLine("  ipconfig        - Exibe configurações de IP das interfaces");
            printTerminalLine("  ipconfig /renew - Solicita nova concessão de IP ao DHCP");
            printTerminalLine("  ipconfig /flushdns - Limpa o cache DNS local");
            printTerminalLine("  ping 8.8.8.8    - Testa conectividade com o DNS externo do Google");
            printTerminalLine("  ping google.com - Testa resolução de nomes e conectividade");
            printTerminalLine("  nslookup google.com - Consulta o servidor DNS por um domínio");
            printTerminalLine("  arp -a          - Exibe a tabela ARP da interface");
            printTerminalLine("  netstat -an     - Lista conexões ativas e portas abertas");
            printTerminalLine("  clear           - Limpa a tela do terminal");
            break;

        case 'ipconfig':
            printTerminalLine("\nConfiguração de IP do Windows\n");
            printTerminalLine("Adaptador de Rede Ethernet:");
            printTerminalLine("   Sufixo DNS específico da conexão . . : localdomain");
            printTerminalLine("   Endereço IPv4. . . . . . . . . . . . : 192.168.1.105");
            printTerminalLine("   Máscara de Sub-rede . . . . . . . . . : 255.255.255.0");
            printTerminalLine("   Gateway Padrão . . . . . . . . . . . : 192.168.1.1\n");
            break;

        case 'ipconfig /renew':
            printTerminalLine("Solicitando novo endereço do servidor DHCP...");
            printTerminalLine("Endereço IPv4 atualizado com sucesso: 192.168.1.110", "color: #10b981;");
            break;

        case 'ipconfig /flushdns':
            printTerminalLine("Configuração do IP do Windows");
            printTerminalLine("Esvaziado com êxito o Cache do DNS Resolver.", "color: #10b981;");
            break;

        case 'ping 8.8.8.8':
            printTerminalLine("Disparando 8.8.8.8 com 32 bytes de dados:");
            printTerminalLine("Resposta de 8.8.8.8: bytes=32 tempo=14ms TTL=117");
            printTerminalLine("Resposta de 8.8.8.8: bytes=32 tempo=12ms TTL=117");
            printTerminalLine("Estatísticas do Ping para 8.8.8.8:");
            printTerminalLine("    Pacotes: Enviados = 2, Recebidos = 2, Perdidos = 0 (0% de perda)", "color: #10b981;");
            break;

        case 'ping google.com':
            printTerminalLine("Disparando google.com [142.250.190.46] com 32 bytes de dados:");
            printTerminalLine("Resposta de 142.250.190.46: bytes=32 tempo=18ms TTL=115");
            printTerminalLine("Resposta de 142.250.190.46: bytes=32 tempo=16ms TTL=115");
            printTerminalLine("Pacotes: Enviados = 2, Recebidos = 2, Perdidos = 0 (0% de perda)", "color: #10b981;");
            break;

        case 'nslookup google.com':
            printTerminalLine("Servidor:  dns.google");
            printTerminalLine("Address:  8.8.8.8\n");
            printTerminalLine("Nome:    google.com");
            printTerminalLine("Addresses: 142.250.190.46", "color: #10b981;");
            break;

        case 'arp -a':
            printTerminalLine("Interface: 192.168.1.105 --- 0x3");
            printTerminalLine("  Endereço Internet   Endereço Físico       Tipo");
            printTerminalLine("  192.168.1.1         00-11-32-4a-5b-6c     dinâmico");
            printTerminalLine("  192.168.1.100       a4-b1-c2-d3-e4-f5     dinâmico");
            break;

        case 'netstat -an':
            printTerminalLine("Conexões ativas\n");
            printTerminalLine("  Proto  Endereço local        Endereço externo      Estado");
            printTerminalLine("  TCP    192.168.1.105:49678   142.250.190.46:443    ESTABLISHED");
            printTerminalLine("  TCP    192.168.1.105:50112   157.240.22.35:443     ESTABLISHED");
            break;

        case 'clear':
            terminalOutput.innerHTML = '';
            break;

        default:
            printTerminalLine(`'${cmd}' não é reconhecido como um comando interno ou externo. Digite 'help' para comandos de apoio.`, "color: #ef4444;");
            break;
    }
}


const btnCheckQuiz = document.getElementById('btn-check-quiz');
const quizResult = document.getElementById('quiz-result');

btnCheckQuiz.addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="q1"]:checked');

    if (!selectedOption) {
        quizResult.textContent = "Por favor, selecione uma alternativa.";
        quizResult.className = "quiz-result-message error";
        return;
    }

    if (selectedOption.value === 'C') {
        quizResult.textContent = " Correcto! Se o IP responde ao ping, a camada de rede (IP/roteamento) está OK. A falha ao usar o nome do domínio indica que o DNS não está resolvendo o nome em IP.";
        quizResult.className = "quiz-result-message success";
    } else {
        quizResult.textContent = "❌ Incorreto. Dica: Se o ping por endereço IP (8.8.8.8) funciona, a conectividade de rede e o cabo estão operacionais.";
        quizResult.className = "quiz-result-message error";
    }
});
