// NHL Player Tiers Application
class NHLPlayerTiers {
    constructor() {
        this.players = [];
        this.tierThresholds = {
            salary: {
                high: 8000000,    // $8M+
                moderate: 4000000, // $4M - $8M
                low: 2000000      // $2M - $4M
            },
            plusMinus: {
                high: 20,         // +20 or better
                moderate: 5,      // +5 to +19
                low: -5           // -5 to +4
            }
        };
        this.init();
    }

    async init() {
        try {
            await this.loadPlayers();
            this.categorizePlayers();
            this.renderPlayers();
            this.setupEventListeners();
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing application:', error);
            this.showError('Failed to load player data. Please try again later.');
        }
    }

    async loadPlayers() {
        // Since NHL Stats API doesn't provide salary data, we'll use a combination
        // of the official NHL API for stats and mock salary data for demonstration
        const currentSeason = new Date().getFullYear();
        const seasonId = `${currentSeason}${currentSeason + 1}`;
        
        try {
            // First, fetch current season point leaders to identify 80+ point players
            const leadersResponse = await fetch(`https://statsapi.web.nhl.com/api/v1/statTypes`);
            const currentSeasonStatsResponse = await fetch(`https://statsapi.web.nhl.com/api/v1/stats/leaders?season=${seasonId}&leaderCategories=points&limit=100`);
            const currentSeasonData = await currentSeasonStatsResponse.json();
            
            // Create a set of player IDs who have 80+ points this season
            const elitePlayerIds = new Set();
            if (currentSeasonData.data && currentSeasonData.data[0] && currentSeasonData.data[0].leaders) {
                currentSeasonData.data[0].leaders.forEach(leader => {
                    if (leader.value >= 80) {
                        elitePlayerIds.add(leader.person.id);
                    }
                });
            }
            
            // Fetch current season player stats
            const statsResponse = await fetch(`https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster`);
            const teamsData = await statsResponse.json();
            
            // Collect all players
            const allPlayers = [];
            
            for (const team of teamsData.teams) {
                if (team.roster && team.roster.roster) {
                    for (const rosterPlayer of team.roster.roster) {
                        const player = rosterPlayer.person;
                        
                        // Fetch detailed player stats
                        try {
                            const playerStatsResponse = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${player.id}/stats?stats=careerRegularSeason`);
                            const playerStatsData = await playerStatsResponse.json();
                            
                            if (playerStatsData.stats && playerStatsData.stats[0] && playerStatsData.stats[0].splits) {
                                const careerStats = playerStatsData.stats[0].splits[0].stat;
                                
                                // Generate mock salary data (in real app, you'd use a salary API)
                                const mockSalary = this.generateMockSalary(player.position.name, careerStats);
                                
                                // Check if this player has 80+ points this season
                                const isElitePoints = elitePlayerIds.has(player.id);
                                
                                allPlayers.push({
                                    id: player.id,
                                    name: player.fullName,
                                    position: player.position.name,
                                    team: team.name,
                                    age: this.calculateAge(player.birthDate),
                                    photo: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.id}.jpg`,
                                    salary: mockSalary,
                                    plusMinus: careerStats.plusMinus || 0,
                                    gamesPlayed: careerStats.games || 0,
                                    goals: careerStats.goals || 0,
                                    assists: careerStats.assists || 0,
                                    points: careerStats.points || 0,
                                    pim: careerStats.pim || 0,
                                    hits: careerStats.hits || 0,
                                    blocked: careerStats.blocked || 0,
                                    takeaways: careerStats.takeaways || 0,
                                    giveaways: careerStats.giveaways || 0,
                                    isElitePoints: isElitePoints,
                                    currentSeasonPoints: isElitePoints ? this.getCurrentSeasonPoints(player.id, currentSeasonData) : 0
                                });
                            }
                        } catch (error) {
                            console.warn(`Failed to fetch stats for player ${player.fullName}:`, error);
                        }
                    }
                }
            }
            
            this.players = allPlayers;
            console.log(`Loaded ${this.players.length} players`);
            console.log(`Found ${elitePlayerIds.size} players with 80+ points this season`);
            
        } catch (error) {
            console.error('Error fetching player data:', error);
            // Fallback to sample data if API fails
            this.players = this.getSamplePlayers();
        }
    }

    getCurrentSeasonPoints(playerId, currentSeasonData) {
        if (currentSeasonData.data && currentSeasonData.data[0] && currentSeasonData.data[0].leaders) {
            const player = currentSeasonData.data[0].leaders.find(leader => leader.person.id === playerId);
            return player ? player.value : 0;
        }
        return 0;
    }

    generateMockSalary(position, stats) {
        // Generate realistic salary based on position and performance
        const baseSalary = {
            'Goalie': 3000000,
            'Defenseman': 2500000,
            'Left Wing': 2000000,
            'Right Wing': 2000000,
            'Center': 2500000
        };
        
        const positionBase = baseSalary[position] || 2000000;
        const performanceMultiplier = Math.max(0.5, Math.min(2.0, (stats.points || 0) / 50 + 1));
        const randomFactor = 0.8 + Math.random() * 0.4; // ±20% variation
        
        return Math.round(positionBase * performanceMultiplier * randomFactor);
    }

    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    getSamplePlayers() {
        // Sample data for demonstration when API is unavailable
        return [
            {
                id: 1,
                name: "Connor McDavid",
                position: "Center",
                team: "Edmonton Oilers",
                age: 27,
                photo: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8478402.jpg",
                salary: 12500000,
                plusMinus: 45,
                gamesPlayed: 500,
                goals: 200,
                assists: 350,
                points: 550,
                pim: 120,
                hits: 300,
                blocked: 50,
                takeaways: 200,
                giveaways: 150
            },
            {
                id: 2,
                name: "Leon Draisaitl",
                position: "Center",
                team: "Edmonton Oilers",
                age: 28,
                photo: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8477934.jpg",
                salary: 8500000,
                plusMinus: 35,
                gamesPlayed: 480,
                goals: 180,
                assists: 320,
                points: 500,
                pim: 100,
                hits: 250,
                blocked: 40,
                takeaways: 180,
                giveaways: 120
            },
            {
                id: 3,
                name: "Nathan MacKinnon",
                position: "Center",
                team: "Colorado Avalanche",
                age: 28,
                photo: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8477492.jpg",
                salary: 12500000,
                plusMinus: 40,
                gamesPlayed: 520,
                goals: 190,
                assists: 310,
                points: 500,
                pim: 80,
                hits: 200,
                blocked: 60,
                takeaways: 220,
                giveaways: 100
            }
        ];
    }

    categorizePlayers() {
        this.players.forEach(player => {
            // Priority 1: Players with 80+ points this season go to Tier 1 Elite
            if (player.isElitePoints && player.currentSeasonPoints >= 80) {
                player.tier = 1; // Elite - 80+ points this season
                return;
            }
            
            // For all other players, use the original salary + plus/minus logic
            const salaryTier = this.getSalaryTier(player.salary);
            const plusMinusTier = this.getPlusMinusTier(player.plusMinus);
            
            // Determine final tier based on combination
            if (salaryTier === 'high' && plusMinusTier === 'high') {
                player.tier = 2; // High Performers (moved down since Tier 1 is now 80+ points)
            } else if (salaryTier === 'high' && plusMinusTier === 'moderate') {
                player.tier = 2; // High Performers
            } else if (salaryTier === 'moderate' && plusMinusTier === 'high') {
                player.tier = 3; // Solid Contributors
            } else if (salaryTier === 'moderate' && plusMinusTier === 'moderate') {
                player.tier = 4; // Role Players
            } else {
                player.tier = 5; // Developing Talent
            }
        });
    }

    getSalaryTier(salary) {
        if (salary >= this.tierThresholds.salary.high) return 'high';
        if (salary >= this.tierThresholds.salary.moderate) return 'moderate';
        return 'low';
    }

    getPlusMinusTier(plusMinus) {
        if (plusMinus >= this.tierThresholds.plusMinus.high) return 'high';
        if (plusMinus >= this.tierThresholds.plusMinus.moderate) return 'moderate';
        return 'low';
    }

    renderPlayers() {
        for (let tier = 1; tier <= 5; tier++) {
            const tierPlayers = this.players.filter(player => player.tier === tier);
            const container = document.getElementById(`playersTier${tier}`);
            
            if (container) {
                container.innerHTML = tierPlayers.map(player => this.createPlayerCard(player)).join('');
            }
        }
    }

    createPlayerCard(player) {
        const plusMinusClass = player.plusMinus >= 0 ? 'positive' : 'negative';
        const plusMinusSign = player.plusMinus >= 0 ? '+' : '';
        
        // For Tier 1 players, show current season points instead of plus/minus
        const displayInfo = player.tier === 1 && player.currentSeasonPoints > 0 
            ? `<div class="player-salary">$${(player.salary / 1000000).toFixed(1)}M</div>
               <div class="player-plus-minus positive">${player.currentSeasonPoints} pts</div>`
            : `<div class="player-salary">$${(player.salary / 1000000).toFixed(1)}M</div>
               <div class="player-plus-minus ${plusMinusClass}">${plusMinusSign}${player.plusMinus}</div>`;
        
        return `
            <div class="player-card" onclick="nhlApp.showPlayerModal(${player.id})">
                <img src="${player.photo}" alt="${player.name}" class="player-photo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjOUI5QjlCIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+PC90ZXh0Pgo8L3N2Zz4K'">
                <h3 class="player-name">${player.name}</h3>
                <div class="player-info">
                    ${displayInfo}
                </div>
            </div>
        `;
    }

    showPlayerModal(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) return;

        // Populate modal with player data
        document.getElementById('modalPlayerName').textContent = player.name;
        document.getElementById('modalPlayerPhoto').src = player.photo;
        document.getElementById('modalPlayerPhoto').onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjOUI5QjlCIi8+Cjx0ZXh0IHg9IjYwIiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+PC90ZXh0Pgo8L3N2Zz4K';
        };
        document.getElementById('modalPlayerTeam').textContent = player.team;
        document.getElementById('modalPlayerPosition').textContent = player.position;
        document.getElementById('modalPlayerAge').textContent = player.age;
        document.getElementById('modalPlayerSalary').textContent = `$${(player.salary / 1000000).toFixed(1)}M`;

        // Populate stats
        const statsContainer = document.getElementById('modalPlayerStats');
        const stats = [
            { label: 'Games Played', value: player.gamesPlayed },
            { label: 'Goals', value: player.goals },
            { label: 'Assists', value: player.assists },
            { label: 'Points', value: player.points },
            { label: 'Plus/Minus', value: player.plusMinus },
            { label: 'PIM', value: player.pim },
            { label: 'Hits', value: player.hits },
            { label: 'Blocked Shots', value: player.blocked },
            { label: 'Takeaways', value: player.takeaways },
            { label: 'Giveaways', value: player.giveaways }
        ];

        // Add current season points for Tier 1 players
        if (player.tier === 1 && player.currentSeasonPoints > 0) {
            stats.unshift({ label: 'Current Season Points', value: player.currentSeasonPoints });
        }

        statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-item">
                <span class="stat-value">${stat.value}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `).join('');

        // Show modal
        document.getElementById('playerModal').style.display = 'block';
    }

    hidePlayerModal() {
        document.getElementById('playerModal').style.display = 'none';
    }

    setupEventListeners() {
        // Close modal when clicking X
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hidePlayerModal();
        });

        // Close modal when clicking outside
        document.getElementById('playerModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('playerModal')) {
                this.hidePlayerModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hidePlayerModal();
            }
        });
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('tiersContainer').style.display = 'block';
    }

    showError(message) {
        document.getElementById('loading').innerHTML = `
            <div style="color: #e53e3e; text-align: center; padding: 2rem;">
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button>
            </div>
        `;
    }
}

// Initialize the application when DOM is loaded
let nhlApp;
document.addEventListener('DOMContentLoaded', () => {
    nhlApp = new NHLPlayerTiers();
});

// Make showPlayerModal globally accessible
window.showPlayerModal = (playerId) => {
    if (nhlApp) {
        nhlApp.showPlayerModal(playerId);
    }
};
