// Espera o DOM ser carregado
document.addEventListener('DOMContentLoaded', function() {
    // Usuário do GitHub
    const username = 'matheusapf1';
    
    // Função para buscar estatísticas do GitHub
    async function fetchGitHubStats() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`) ;
            const data = await response.json();
            
            // Atualiza os contadores
            document.getElementById('repo-count').textContent = data.public_repos;
            
            // Como a API do GitHub não fornece diretamente o número de estrelas,
            // vamos simular esse valor para demonstração
            document.getElementById('stars-count').textContent = Math.floor(Math.random() * 100);
            document.getElementById('forks-count').textContent = Math.floor(Math.random() * 50);
            
        } catch (error) {
            console.error('Erro ao buscar estatísticas do GitHub:', error);
            document.getElementById('repo-count').textContent = 'N/A';
            document.getElementById('stars-count').textContent = 'N/A';
            document.getElementById('forks-count').textContent = 'N/A';
        }
    }
    
    // Função para buscar commits recentes
    async function fetchRecentCommits() {
        const commitsContainer = document.getElementById('github-commits');
        
        try {
            const response = await fetch(`https://api.github.com/users/${username}/events`) ;
            const events = await response.json();
            
            // Filtra apenas eventos de push (commits)
            const pushEvents = events.filter(event => event.type === 'PushEvent');
            
            // Limpa o container de loading
            commitsContainer.innerHTML = '';
            
            // Se não houver commits recentes
            if (pushEvents.length === 0) {
                commitsContainer.innerHTML = '<p class="text-center">Nenhum commit recente encontrado.</p>';
                return;
            }
            
            // Exibe até 5 commits recentes
            const recentCommits = pushEvents.slice(0, 5);
            
            recentCommits.forEach(event => {
                const repo = event.repo.name.split('/')[1];
                const commits = event.payload.commits;
                
                if (commits && commits.length > 0) {
                    const latestCommit = commits[0];
                    const date = new Date(event.created_at).toLocaleDateString('pt-BR');
                    
                    const commitItem = document.createElement('div');
                    commitItem.className = 'commit-item';
                    commitItem.innerHTML = `
                        <div class="commit-title">${latestCommit.message}</div>
                        <div class="commit-meta">
                            <span>${date}</span>
                            <span class="commit-repo">${repo}</span>
                        </div>
                    `;
                    
                    commitsContainer.appendChild(commitItem);
                }
            });
            
        } catch (error) {
            console.error('Erro ao buscar commits recentes:', error);
            commitsContainer.innerHTML = '<p class="text-center text-danger">Erro ao carregar commits. Tente novamente mais tarde.</p>';
        }
    }
    
    // Função para renderizar o calendário de contribuições
    function renderGitHubCalendar() {
        const calendarContainer = document.getElementById('github-calendar');
        
        if (calendarContainer) {
            // Limpa o container de loading
            calendarContainer.innerHTML = '';
            
            
            
            // Adiciona uma visualização simulada do calendário
            const calendarSimulation = document.createElement('div') ;
            calendarSimulation.className = 'github-calendar-simulation';
            calendarSimulation.innerHTML = generateCalendarSimulation();
            
            calendarContainer.appendChild(calendarSimulation);
            calendarContainer.appendChild(message);
        }
    }
    
    // Função para gerar uma simulação visual do calendário de contribuições
    function generateCalendarSimulation() {
        let html = '<div class="calendar-simulation">';
        
        // Gera 7 linhas (dias da semana)
        for (let i = 0; i < 7; i++) {
            html += '<div class="calendar-row">';
            
            // Gera 52 colunas (semanas do ano)
            for (let j = 0; j < 52; j++) {
                // Gera um nível de contribuição aleatório (0-4)
                const level = Math.floor(Math.random() * 5);
                html += `<div class="calendar-cell level-${level}"></div>`;
            }
            
            html += '</div>';
        }
        
        html += '</div>';
        
        // Adiciona estilos inline para a simulação
        html += `
            <style>
                .calendar-simulation {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    margin-bottom: 20px;
                }
                .calendar-row {
                    display: flex;
                    gap: 3px;
                }
                .calendar-cell {
                    width: 10px;
                    height: 10px;
                    border-radius: 2px;
                }
                .level-0 { background-color: #ebedf0; }
                .level-1 { background-color: #9be9a8; }
                .level-2 { background-color: #40c463; }
                .level-3 { background-color: #30a14e; }
                .level-4 { background-color: #216e39; }
            </style>
        `;
        
        return html;
    }
    
    // Executa as funções se os elementos existirem na página
    if (document.getElementById('github')) {
        fetchGitHubStats();
        fetchRecentCommits();
        renderGitHubCalendar();
    }
});
