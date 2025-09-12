// NHL Player Tiers Application
class NHLPlayerTiers {
    constructor() {
        this.players = [];
        this.tierThresholds = {
            points: {
                elite: 80,        // 80+ points - Tier 1 Elite
                high: 60,         // 60-79 points - Tier 2 High Performers
                moderate: 40,     // 40-59 points - Tier 3 Solid Contributors
                role: 20,         // 20-39 points - Tier 4 Role Players
                developing: 0     // 0-19 points - Tier 5 Developing Talent
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

    updateLoadingProgress(message) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            const spinner = loadingElement.querySelector('.spinner');
            const text = loadingElement.querySelector('p');
            if (text) {
                text.textContent = message;
            }
        }
    }

    async loadPlayers() {
        const currentSeason = new Date().getFullYear();
        const seasonId = `${currentSeason}${currentSeason + 1}`;
        
        try {
            // First, get all team IDs from the NHL API
            const teamsResponse = await fetch('https://api-web.nhle.com/v1/teams');
            const teamsData = await teamsResponse.json();
            
            if (!teamsData || !teamsData.data) {
                throw new Error('Failed to fetch teams data');
            }
            
            const allPlayers = [];
            const playerIds = new Set(); // To avoid duplicates
            
            console.log(`Fetching players from ${teamsData.data.length} teams...`);
            this.updateLoadingProgress(`Loading players from ${teamsData.data.length} NHL teams...`);
            
            // Fetch roster and stats for each team
            for (let i = 0; i < teamsData.data.length; i++) {
                const team = teamsData.data[i];
                console.log(`Loading team ${i + 1}/${teamsData.data.length}: ${team.name?.default || 'Unknown'}`);
                this.updateLoadingProgress(`Loading team ${i + 1}/${teamsData.data.length}: ${team.name?.default || 'Unknown'}`);
                
                try {
                    // Get team roster
                    const rosterResponse = await fetch(`https://api-web.nhle.com/v1/roster/${team.id}`);
                    const rosterData = await rosterResponse.json();
                    
                    if (rosterData && rosterData.data) {
                        console.log(`Found ${rosterData.data.length} players in ${team.name?.default || 'Unknown'}`);
                        
                        for (const player of rosterData.data) {
                            // Skip if we've already processed this player
                            if (playerIds.has(player.id)) {
                                continue;
                            }
                            playerIds.add(player.id);
                            
                            try {
                                // Get player stats for current season
                                const playerStatsResponse = await fetch(`https://api-web.nhle.com/v1/player/${player.id}/stats`);
                                const playerStatsData = await playerStatsResponse.json();
                                
                                if (playerStatsData && playerStatsData.data) {
                                    // Find current season stats
                                    let currentSeasonStats = null;
                                    let currentSeasonPoints = 0;
                                    
                                    if (playerStatsData.data.seasons) {
                                        const currentSeasonData = playerStatsData.data.seasons.find(season => 
                                            season.seasonId === seasonId || season.seasonId === seasonId.toString()
                                        );
                                        
                                        if (currentSeasonData && currentSeasonData.stat) {
                                            currentSeasonStats = currentSeasonData.stat;
                                            currentSeasonPoints = currentSeasonStats.points || 0;
                                        }
                                    }
                                    
                                    // Get career stats for additional data
                                    const careerStats = playerStatsData.data.careerTotals || {};
                                    
                                    // Generate mock salary data
                                    const mockSalary = this.generateMockSalary(player.position, careerStats);
                                    
                                    // Create player object with all available data
                                    const playerObj = {
                                        id: player.id,
                                        name: (player.firstName?.default || '') + ' ' + (player.lastName?.default || ''),
                                        position: player.position || 'Unknown',
                                        team: team.name?.default || 'Unknown',
                                        age: this.calculateAge(player.birthDate),
                                        photo: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.id}.jpg`,
                                        salary: mockSalary,
                                        plusMinus: currentSeasonStats?.plusMinus || careerStats.plusMinus || 0,
                                        gamesPlayed: currentSeasonStats?.gamesPlayed || careerStats.gamesPlayed || 0,
                                        goals: currentSeasonStats?.goals || careerStats.goals || 0,
                                        assists: currentSeasonStats?.assists || careerStats.assists || 0,
                                        points: currentSeasonStats?.points || careerStats.points || 0,
                                        pim: currentSeasonStats?.pim || careerStats.pim || 0,
                                        hits: currentSeasonStats?.hits || careerStats.hits || 0,
                                        blocked: currentSeasonStats?.blockedShots || careerStats.blockedShots || 0,
                                        takeaways: currentSeasonStats?.takeaways || careerStats.takeaways || 0,
                                        giveaways: currentSeasonStats?.giveaways || careerStats.giveaways || 0,
                                        currentSeasonPoints: currentSeasonPoints
                                    };
                                    
                                    allPlayers.push(playerObj);
                                } else {
                                    // Even if no stats, still add the player with basic info
                                    const playerObj = {
                                        id: player.id,
                                        name: (player.firstName?.default || '') + ' ' + (player.lastName?.default || ''),
                                        position: player.position || 'Unknown',
                                        team: team.name?.default || 'Unknown',
                                        age: this.calculateAge(player.birthDate),
                                        photo: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.id}.jpg`,
                                        salary: this.generateMockSalary(player.position, {}),
                                        plusMinus: 0,
                                        gamesPlayed: 0,
                                        goals: 0,
                                        assists: 0,
                                        points: 0,
                                        pim: 0,
                                        hits: 0,
                                        blocked: 0,
                                        takeaways: 0,
                                        giveaways: 0,
                                        currentSeasonPoints: 0
                                    };
                                    
                                    allPlayers.push(playerObj);
                                }
                            } catch (error) {
                                console.warn(`Failed to fetch stats for player ${player.firstName?.default} ${player.lastName?.default}:`, error);
                                
                                // Add player even without stats
                                const playerObj = {
                                    id: player.id,
                                    name: (player.firstName?.default || '') + ' ' + (player.lastName?.default || ''),
                                    position: player.position || 'Unknown',
                                    team: team.name?.default || 'Unknown',
                                    age: this.calculateAge(player.birthDate),
                                    photo: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.id}.jpg`,
                                    salary: this.generateMockSalary(player.position, {}),
                                    plusMinus: 0,
                                    gamesPlayed: 0,
                                    goals: 0,
                                    assists: 0,
                                    points: 0,
                                    pim: 0,
                                    hits: 0,
                                    blocked: 0,
                                    takeaways: 0,
                                    giveaways: 0,
                                    currentSeasonPoints: 0
                                };
                                
                                allPlayers.push(playerObj);
                            }
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to fetch roster for team ${team.name?.default}:`, error);
                }
            }
            
            this.players = allPlayers;
            console.log(`Successfully loaded ${this.players.length} NHL players from all teams`);
            this.updateLoadingProgress(`Successfully loaded ${this.players.length} NHL players! Categorizing into tiers...`);
            
        } catch (error) {
            console.error('Error fetching player data from NHL API:', error);
            // Fallback to sample data if API fails
            this.players = this.getSamplePlayers();
        }
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
                giveaways: 150,
                currentSeasonPoints: 132
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
                giveaways: 120,
                currentSeasonPoints: 106
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
                giveaways: 100,
                currentSeasonPoints: 140
            },
            {
                id: 4,
                name: "Auston Matthews",
                position: "Center",
                team: "Toronto Maple Leafs",
                age: 26,
                photo: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8479318.jpg",
                salary: 11625000,
                plusMinus: 25,
                gamesPlayed: 450,
                goals: 250,
                assists: 200,
                points: 450,
                pim: 60,
                hits: 150,
                blocked: 30,
                takeaways: 150,
                giveaways: 80,
                currentSeasonPoints: 69
            },
            {
                id: 5,
                name: "Artemi Panarin",
                position: "Left Wing",
                team: "New York Rangers",
                age: 32,
                photo: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8478550.jpg",
                salary: 11625000,
                plusMinus: 30,
                gamesPlayed: 480,
                goals: 180,
                assists: 280,
                points: 460,
                pim: 40,
                hits: 100,
                blocked: 20,
                takeaways: 120,
                giveaways: 90,
                currentSeasonPoints: 71
            }
        ];
    }

    categorizePlayers() {
        this.players.forEach(player => {
            const points = player.currentSeasonPoints;
            
            // Categorize based on current season points
            if (points >= this.tierThresholds.points.elite) {
                player.tier = 1; // Elite - 80+ points
            } else if (points >= this.tierThresholds.points.high) {
                player.tier = 2; // High Performers - 60-79 points
            } else if (points >= this.tierThresholds.points.moderate) {
                player.tier = 3; // Solid Contributors - 40-59 points
            } else if (points >= this.tierThresholds.points.role) {
                player.tier = 4; // Role Players - 20-39 points
            } else {
                player.tier = 5; // Developing Talent - 0-19 points
            }
        });
    }

    getPointsTier(points) {
        if (points >= this.tierThresholds.points.elite) return 'elite';
        if (points >= this.tierThresholds.points.high) return 'high';
        if (points >= this.tierThresholds.points.moderate) return 'moderate';
        if (points >= this.tierThresholds.points.role) return 'role';
        return 'developing';
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
        const pointsClass = player.currentSeasonPoints >= 40 ? 'positive' : 'negative';
        
        return `
            <div class="player-card" onclick="nhlApp.showPlayerModal(${player.id})">
                <img src="${player.photo}" alt="${player.name}" class="player-photo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjOUI5QjlCIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+PC90ZXh0Pgo8L3N2Zz4K'">
                <h3 class="player-name">${player.name}</h3>
                <div class="player-info">
                    <div class="player-salary">$${(player.salary / 1000000).toFixed(1)}M</div>
                    <div class="player-plus-minus ${pointsClass}">${player.currentSeasonPoints} pts</div>
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

        // Add current season points for all players
        if (player.currentSeasonPoints > 0) {
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

        // Search functionality
        const searchInput = document.getElementById('playerSearch');
        const clearSearchBtn = document.getElementById('clearSearch');
        const searchContainer = document.getElementById('searchContainer');
        const tiersContainer = document.getElementById('tiersContainer');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.handleSearch('');
            });
        }
    }

    handleSearch(query) {
        const searchContainer = document.getElementById('searchContainer');
        const tiersContainer = document.getElementById('tiersContainer');
        const searchResults = document.getElementById('searchResults');

        if (!query.trim()) {
            // Show tiers, hide search results
            searchContainer.style.display = 'none';
            tiersContainer.style.display = 'flex';
            return;
        }

        // Show search results, hide tiers
        searchContainer.style.display = 'block';
        tiersContainer.style.display = 'none';

        // Filter players based on search query
        const filteredPlayers = this.players.filter(player => 
            player.name.toLowerCase().includes(query.toLowerCase()) ||
            player.team.toLowerCase().includes(query.toLowerCase()) ||
            player.position.toLowerCase().includes(query.toLowerCase())
        );

        // Display search results
        if (searchResults) {
            if (filteredPlayers.length === 0) {
                searchResults.innerHTML = '<p style="text-align: center; color: #718096; padding: 2rem;">No players found matching your search.</p>';
            } else {
                searchResults.innerHTML = filteredPlayers.map(player => this.createPlayerCard(player)).join('');
            }
        }
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('searchContainer').style.display = 'block';
        document.getElementById('tiersContainer').style.display = 'flex';
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
