// NHL Player Tiers Application
class NHLPlayerTiers {

    // Constructor to initialize the NHLPlayerTiers application with default values and start the application
    constructor() {
        // Initialize an empty array to hold player objects
        this.players = [];
        this.tierThresholds = {
            // Define the point thresholds for each tier
            points: {
                elite: 80, // 80+ points - Tier 1 Elite
                high: 60, // 60-79 points - Tier 2 High Performers
                moderate: 40, // 40-59 points - Tier 3 Solid Contributors
                role: 20, // 20-39 points - Tier 4 Role Players
                developing: 0 // 0-19 points - Tier 5 Developing Talent
            }
        };
        // Call the init method to start the application
        this.init();
    }

    // Asynchronous initialization of the application
    // Loads players, categorizes them, renders the UI, and sets up event listeners
    async init() {
        try {
            await this.loadPlayers();
            this.categorizePlayers();
            this.renderPlayers();
            this.setupEventListeners();
            this.hideLoading();
        } catch (error) {
            // Log any errors that occur during initialization
            console.error('Error initializing application:', error);
            // Display an error message to the user
            this.showError('Failed to load player data. Please try again later.');
        }
    }

    // Updates the loading progress message in the UI
    // Displays a message to the user indicating the current loading progress
    updateLoadingProgress(message) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            // Find the spinner and text elements within the loading element
            const spinner = loadingElement.querySelector('.spinner');
            const text = loadingElement.querySelector('p');
            if (text) {
                text.textContent = message;
            }
        }
    }

    // Asynchronously loads player data from a CSV source
    async loadPlayers() {
        try {
            this.updateLoadingProgress('Loading players from dataset...');

            const csv = `Rank,Name,Team,Position,GP,G,A,Pts,PlusMinus\n1,Nikita Kucherov,TBL,RW,78,37,84,121,22\n2,Nathan MacKinnon,COL,C/RW,79,32,84,116,25\n3,Leon Draisaitl,EDM,C/W,71,52,54,106,32\n4,David Pastrnak,BOS,RW/LW,82,43,63,106,0\n5,Mitchell Marner,TOR,RW/C,81,27,75,102,18\n6,Connor McDavid,EDM,C/LW,67,26,74,100,20\n7,Kyle Connor,WPG,LW,82,41,56,97,17\n8,Jack Eichel,VGK,C,77,28,66,94,32\n9,Cale Makar,COL,D,80,30,62,92,28\n10,Sidney Crosby,PIT,C,80,33,58,91,-20\n11,Brandon Hagel,TBL,LW,82,35,55,90,33\n12,Clayton Keller,UTA,RW/LW,81,30,60,90,-12\n13,Artemi Panarin,NYR,LW,80,37,52,89,-9\n14,Nick Suzuki,MTL,C,82,30,59,89,19\n15,Mikko Rantanen,DAL/W,C,82,32,56,88,13\n16,Jesper Bratt,NJD,LW/RW,81,21,67,88,5\n17,Mark Scheifele,WPG,C,82,39,48,87,12\n18,William Nylander,TOR,W/C,82,45,39,84,10\n19,Martin Nečas,C/RW,79,27,56,83,5\n20,Brayden Point,TBL,C,77,42,40,82,17\n21,Matt Duchene,DAL,C/W,82,30,52,82,13\n22,Dylan Strome,WAS,C,82,29,53,82,2\n23,Zach Werenski,CBJ,D,81,23,59,82,12\n24,Sam Reinhart,FLA,C/RW,79,39,42,81,6\n25,Robert Thomas,STL,C/RW,70,21,60,81,20\n26,Jake Guentzel,TBL,LW,80,41,39,80,18\n27,Jason Robertson,DAL/LW/RW,82,35,45,80,10\n28,Lucas Raymond,DET/LW/RW,82,27,53,80,-15\n29,Tim Stützle,OTT,LW/C,82,24,55,79,0\n30,Auston Matthews,TOR,C/LW,67,33,45,78,11\n31,Filip Forsberg,NSH,W/C,82,31,45,76,-27\n32,Travis Konecny,PHI,RW/LW,82,24,52,76,-17\n33,Quinn Hughes,VAN,D,68,16,60,76,2\n34,John Tavares,TOR,C/LW,75,38,36,74,10\n35,Kirill Marchenko,CBJ,RW/LW,79,31,43,74,29\n36,Sebastian Aho, CAR,C/W,79,29,45,74,7\n37,Alexander Ovechkin, WSH, LW,65,44,29,73,15\n38,Adrian Kempe, LAK, W/C,81,35,38,73,22\n39,Matt Boldy, MIN, LW/RW,82,27,46,73,1\n40,Tage Thompson, BUF, C/W,76,44,28,72,-2\n41,Pierre-Luc Dubois, WSH, C/LW,82,20,46,66,27\n42,Victor Hedman, TBL, D,79,15,51,66,18\n43,Lane Hutson, MTL, D,82,6,60,66,-2\n44,Tom Wilson, WSH, RW,81,33,32,65,20\n45,Ryan Donato, CHI, C/W,80,31,31,62,-15\n46,Jonathan Huberdeau, CGY, LW/RW,81,28,34,62,-13\n47,Mika Zibanejad, NYR, C/RW,82,20,42,62,-22\n48,Josh Morrissey, WPG, D,80,14,48,62,17\n49,Mikael Backlund, CGY, C,82,22,39,61,4\n50,William Nylander,TOR,W/C, duplicate entry skip\n51,Andreas Athanasiou, COL, RW,81,25,34,59,5\n52,Anthony Mantha, SJS, LW,82,27,30,57,-5\n53,Jeff Skinner, WPG, LW,82,21,36,57,-16\n54,Charlie Coyle, VGK, C/LW,82,23,32,55,8\n55,Joel Eriksson Ek, MIN, C,82,26,28,54,-19\n56,Kevin Fiala, STL, RW/LW,82,24,30,54,-17\n57,Taylor Hall, CHI, LW/RW,81,23,30,53,0\n58,Steven Stamkos, NSH, C/LW,82,26,26,52,-14\n59,Nick Cousins, LAK, C,81,20,32,52,-7\n60,Tyler Bertuzzi, P/A, CHI/RW,82,29,22,51,5\n61,J.T. Miller, NYR, C/LW,82,24,26,50,-2\n62,Eeli Tolvanen, NSH, RW,82,22,28,50,0\n63,Nico Hischier, NJD, C,82,23,26,49,4\n64,Bo Horvat,VAN,C,82,19,30,49,-15\n65,Patrick Kane, CHI, RW,81,22,26,48,-5\n66,Brendan Gallagher, MTL, RW,82,18,29,47,-9\n67,Connor Brown, OTT,RW,82,18,29,47,-2\n68,Jordan Kyrou, STL,C/RW,82,21,26,47,-10\n69,Sean Monahan, CGY,C,82,19,27,46,-16\n70,Matty Beniers, SEA,C,82,18,28,46,-5\n71,Barclay Goodrow, VGK, C/LW,82,16,29,45,-7\n72,Jake DeBrusk, BOS, LW,82,22,22,44,0\n73,Anthony Duclair, NYI, LW,82,20,24,44,-8\n74,William Karlsson, VGK, C,82,19,24,43,1\n75,Evgeni Malkin, PIT, C,74,19,24,43,-7\n76,Jonas Brodin, MIN, D,80,5,38,43,6\n77,Brayden McNabb, VGK, D,74,6,37,43,42\n78,Joel Hanley, PIT, D,82,4,39,43,14\n79,Max Domi, TOR, C,82,17,25,42,3\n80,Mitchell Stephens, VGK, C,82,21,21,42,14\n81,Sammy Walker, WPG, LW,82,23,18,41,1\n82,Kaapo Kakko, NYR, LW,82,16,25,41,-7\n83,Radko Gudas, PHI, D,81,5,36,41,-16\n84,Connor Garland, VAN, LW/RW,82,19,22,41,-19\n85,Anthony Beauvillier, CGY, LW,82,18,22,40,-19\n86,Josh Anderson, MTL, LW/RW,82,19,20,39,-2\n87,Tyler Toffoli, SJS, RW,82,17,22,39,-2\n88,Andrei Svechnikov, CAR, RW,82,16,23,39,-28\n89,Nick Foligno, CBJ, LW,82,18,20,38,0\n90,Justin Schultz, PIT, D,82,7,30,37,6\n91,Tyson Jost, WPG, LW,82,13,23,36,3\n92,Adam Henrique, NJD, C/W,79,20,15,35,7\n93,Anthony Cirelli, TBL, C,82,10,25,35,6\n94,Boeser, Brock, VAN, LW,82,17,17,34,1\n95,Sam Lafferty, SEA, RW,82,16,18,34,0\n96,Andrew Mangiapane, CGY, LW,81,13,20,33,0\n97,Jordan Greenway, BUF, LW,82,18,15,33,-13\n98,Anthony Cirelli, duplicate skip\n99,Jack Roslovic, MTL, C/W,82,13,19,32,-6\n100,Michael Bunting, TOR, LW,82,15,17,32,0`;

            const lines = csv.split(/\n+/).map(l => l.trim()).filter(Boolean);
            const header = lines.shift();
            const allPlayers = [];
            const seen = new Set(); // to skip duplicates (Name+Team)

            // NHL player IDs mapping (add more as needed)
            const playerIds = {
                'Connor McDavid': '8478402',
                'Leon Draisaitl': '8477934',
                'Nathan MacKinnon': '8477492',
                'Auston Matthews': '8479318',
                'Artemi Panarin': '8478550',
                'Nikita Kucherov': '8476453',
                'David Pastrnak': '8477956',
                'Mitchell Marner': '8478483',
                'Jack Eichel': '8478403',
                'Sidney Crosby': '8471675',
                'Alexander Ovechkin': '8471214',
                'Steven Stamkos': '8474564',
                'Patrick Kane': '8474141',
                'Evgeni Malkin': '8471215',
                'William Nylander': '8477939',
                'Cale Makar': '8480069',
                'Quinn Hughes': '8480800',
                'Tage Thompson': '8479420',
                'Andrei Svechnikov': '8480830',
                'Brock Boeser': '8478444',
                'Kyle Connor': '8478398',
                'Brandon Hagel': '8479542',
                'Clayton Keller': '8479343',
                'Nick Suzuki': '8480018',
                'Mikko Rantanen': '8478420',
                'Jesper Bratt': '8479407',
                'Mark Scheifele': '8476460',
                'Martin Nečas': '8480039',
                'Brayden Point': '8478010',
                'Matt Duchene': '8475168',
                'Dylan Strome': '8478440',
                'Zach Werenski': '8478406',
                'Sam Reinhart': '8477933',
                'Robert Thomas': '8480023',
                'Jake Guentzel': '8477404',
                'Jason Robertson': '8480027',
                'Lucas Raymond': '8482078',
                'Tim Stützle': '8482109',
                'Filip Forsberg': '8476887',
                'Travis Konecny': '8478439',
                'John Tavares': '8475166',
                'Kirill Marchenko': '8480893',
                'Sebastian Aho': '8478427',
                'Adrian Kempe': '8477960',
                'Matt Boldy': '8481557',
                'Pierre-Luc Dubois': '8479400',
                'Victor Hedman': '8475167',
                'Tom Wilson': '8476880',
                'Jonathan Huberdeau': '8476456',
                'Mika Zibanejad': '8476459',
                'Josh Morrissey': '8477504',
                'Mikael Backlund': '8474150',
                'Kevin Fiala': '8477942',
                'Taylor Hall': '8475791',
                'Nico Hischier': '8480002',
                'Bo Horvat': '8477500',
                'Brendan Gallagher': '8475848',
                'Jordan Kyrou': '8479385',
                'Sean Monahan': '8477497',
                'Matty Beniers': '8482666',
                'Jake DeBrusk': '8478498',
                'William Karlsson': '8476448',
                'Jonas Brodin': '8476463',
                'Brayden McNabb': '8475188',
                'Max Domi': '8477503',
                'Kaapo Kakko': '8481554',
                'Radko Gudas': '8475462',
                'Tyler Toffoli': '8475726',
                'Ryan Donato': '8477946',
                'Andreas Athanasiou': '8476891',
                'Anthony Mantha': '8477431',
                'Jeff Skinner': '8475784',
                'Charlie Coyle': '8475745',
                'Joel Eriksson Ek': '8478443',
                'Nick Cousins': '8476332',
                'Tyler Bertuzzi': '8477479',
                'J.T. Miller': '8476468',
                'Eeli Tolvanen': '8479991',
                'Connor Brown': '8476856',
                'Barclay Goodrow': '8476326',
                'Anthony Duclair': '8477412',
                'Mitchell Stephens': '8478832',
                'Sammy Walker': '8480164',
                'Connor Garland': '8478423',
                'Anthony Beauvillier': '8478463',
                'Josh Anderson': '8476879',
                'Nick Foligno': '8473445',
                'Justin Schultz': '8474581',
                'Tyson Jost': '8479361',
                'Adam Henrique': '8474556',
                'Anthony Cirelli': '8478519',
                'Sam Lafferty': '8478056',
                'Andrew Mangiapane': '8478233',
                'Jordan Greenway': '8479532',
                'Jack Roslovic': '8478466',
                'Michael Bunting': '8478875',
                'Lane Hutson': '8483506',
                'Joel Hanley': '8477803'
            };

            for (const rawLine of lines) {
                const line = rawLine.split(' :contentReference')[0].trim();
                if (!line || /duplicate\s+entry\s+skip|duplicate\s+skip/i.test(line)) {
                    continue;
                }

                const parts = line.split(',').map(p => p.trim());
                if (parts.length < 9) {
                    continue;
                }

                let [rankStr, name, team, position, gpStr, gStr, aStr, ptsStr, plusMinusStr] = parts;

                // Fix known data issues
                if (name.includes('Boeser')) {
                    name = 'Brock Boeser';
                }
                 if (name.includes('Stutzle')) {
                    name = 'Tim Stützle';
                }

                const key = `${name}|${team}`;
                if (seen.has(key)) continue;
                seen.add(key);

                const rank = parseInt(rankStr, 10) || allPlayers.length + 1;
                const gamesPlayed = parseInt(gpStr, 10) || 0;
                const goals = parseInt(gStr, 10) || 0;
                const assists = parseInt(aStr, 10) || 0;
                const points = parseInt(ptsStr, 10) || 0;
                const plusMinus = parseInt(plusMinusStr, 10) || 0;

                // Generate a unique ID for players without a known NHL ID
                const playerId = playerIds[name] || `custom${rank}`;
                const photoUrl = playerIds[name]
                    ? `https://assets.nhle.com/mugs/nhl/latest/${playerIds[name]}.png`
                    : `https://assets.nhle.com/mugs/nhl/latest/default.png`;

                allPlayers.push({
                    id: playerId,
                    name: name,
                    position: position,
                    team: team.replace(/\s+/g, ' ').trim(),
                    age: '-',
                    photo: photoUrl,
                    salary: this.generateMockSalary(position, {
                        points
                    }),
                    plusMinus: plusMinus,
                    gamesPlayed: gamesPlayed,
                    goals: goals,
                    assists: assists,
                    points: points,
                    pim: 0,
                    hits: 0,
                    blocked: 0,
                    takeaways: 0,
                    giveaways: 0,
                    currentSeasonPoints: points
                });
            }

            this.players = allPlayers;
            this.updateLoadingProgress(`Loaded ${this.players.length} players from dataset. Categorizing...`);
        } catch (error) {
            console.error('Error loading players from NHL API:', error);
            // Fallback to sample players if API fails
            this.players = this.getSamplePlayers();
        }
    }


    // Generates a mock salary for a player based on their position and stats
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

	// Formats NHL season string like 20232024 -> 2023-24
	formatSeason(seasonStr) {
		if (!seasonStr || String(seasonStr).length !== 8) return seasonStr || '-';
		const start = String(seasonStr).slice(0, 4);
		const endShort = String(seasonStr).slice(6);
		return `${start}-${endShort}`;
	}

	// Get current NHL season (e.g., 20232024)
	getCurrentSeason() {
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth() + 1;
		// NHL season starts in October
		const seasonStart = month >= 10 ? year : year - 1;
		return `${seasonStart}${seasonStart + 1}`;
	}

	// Get previous season (e.g., if current is 20232024, passing 1 returns 20222023)
	getPreviousSeason(yearsBack = 1) {
		const now = new Date();
		const year = now.getFullYear() - yearsBack;
		const month = now.getMonth() + 1;
		const seasonStart = month >= 10 ? year : year - 1;
		return `${seasonStart}${seasonStart + 1}`;
	}

	// Adds ordinal suffix to numbers (1 -> 1st, 2 -> 2nd, 3 -> 3rd)
	ordinal(n) {
		const s = ["th", "st", "nd", "rd"], v = n % 100;
		return n + (s[(v - 20) % 10] || s[v] || s[0]);
	}

	// Fetch and cache detailed info for players with NHL IDs
	async enrichPlayerDetails(player) {
		const id = String(player.id || '');
		if (!/^\d+$/.test(id)) {
			// No NHL id available
			player.detailsLoaded = true;
			return;
		}
		if (player.detailsLoaded) return;
		try {
			// Fetch person info
			const infoResp = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${id}`);
			if (!infoResp.ok) throw new Error(`Failed to fetch player info: ${infoResp.status}`);
			const infoJson = await infoResp.json();
			const person = (infoJson && infoJson.people && infoJson.people[0]) || {};

			// Basic info
			player.nationality = person.nationality || person.birthCountry || player.nationality || '-';
			player.height = person.height || player.height || null;
			player.weight = person.weight ? `${person.weight} lb` : (player.weight || null);
			player.birthDate = person.birthDate || null;
			
			// Draft info
			const draftYear = person.draftYear;
			const draftRound = person.draftRound ? parseInt(person.draftRound, 10) : null;
			const draftOverall = person.draftOverall ? parseInt(person.draftOverall, 10) : null;
			const draftTeam = person.draftTeam && (person.draftTeam.name || person.draftTeam.triCode);
			if (draftYear) {
				const roundTxt = draftRound ? this.ordinal(draftRound) : null;
				const pickTxt = draftOverall ? this.ordinal(draftOverall) : null;
				player.draft = `${draftYear} Draft${roundTxt ? `, ${roundTxt} round` : ''}${pickTxt ? `, ${pickTxt} overall` : ''}${draftTeam ? ` (${draftTeam})` : ''}`;
			}

			// Fetch comprehensive stats
			const statsPromises = [
				// Regular season stats
				fetch(`https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=yearByYear`),
				// Playoff stats
				fetch(`https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=yearByYearPlayoffs`),
				// Advanced stats (last 3 seasons)
				fetch(`https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=statsSingleSeason&season=${this.getCurrentSeason()}`),
				fetch(`https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=statsSingleSeason&season=${this.getPreviousSeason(1)}`),
				fetch(`https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=statsSingleSeason&season=${this.getPreviousSeason(2)}`)
			];

			const responses = await Promise.all(statsPromises);
			const statsData = await Promise.all(responses.map(async (resp) => {
				if (!resp.ok) return null;
				try {
					return await resp.json();
				} catch (e) {
					console.warn('Failed to parse stats response:', e);
					return null;
				}
			}));

			// Process regular season stats
			const regularSeasonStats = statsData[0];
			const splits = (regularSeasonStats && regularSeasonStats.stats && regularSeasonStats.stats[0] && regularSeasonStats.stats[0].splits) || [];
			const nhlSplits = splits.filter(s => s.league && (s.league.abbreviation === 'NHL' || s.league.name === 'National Hockey League'));
			
			// Process playoff stats
			const playoffStats = statsData[1];
			const playoffSplits = (playoffStats && playoffStats.stats && playoffStats.stats[0] && playoffStats.stats[0].splits) || [];
			const nhlPlayoffSplits = playoffSplits.filter(s => s.league && (s.league.abbreviation === 'NHL' || s.league.name === 'National Hockey League'));

			// Combine regular season stats with advanced metrics
			player.seasons = nhlSplits.map(s => {
				const season = s.season;
				const advancedStats = statsData.slice(2).find(data => {
					const splits = data && data.stats && data.stats[0] && data.stats[0].splits;
					return splits && splits[0] && splits[0].season === season;
				});

				const advanced = (advancedStats && advancedStats.stats && advancedStats.stats[0] && advancedStats.stats[0].splits[0]) || {};
				
				// Find matching playoff stats
				const playoffStat = nhlPlayoffSplits.find(p => p.season === season);

				return {
					year: this.formatSeason(season),
					team: (s.team && s.team.name) || '-',
					// Regular season stats
					gp: (s.stat && s.stat.games) || 0,
					g: (s.stat && s.stat.goals) || 0,
					a: (s.stat && s.stat.assists) || 0,
					p: (s.stat && s.stat.points) || 0,
					plusMinus: (s.stat && (s.stat.plusMinus ?? '-')),
					pim: (s.stat && s.stat.pim) || 0,
					ppg: (s.stat && s.stat.powerPlayGoals) || 0,
					shg: (s.stat && s.stat.shortHandedGoals) || 0,
					gwg: (s.stat && s.stat.gameWinningGoals) || 0,
					// Advanced stats
					timeOnIcePerGame: (s.stat && s.stat.timeOnIcePerGame) || '0:00',
					powerPlayTimeOnIce: (s.stat && s.stat.powerPlayTimeOnIce) || '0:00',
					shortHandedTimeOnIce: (s.stat && s.stat.shortHandedTimeOnIce) || '0:00',
					shotPct: (s.stat && s.stat.shotPct) || 0,
					faceOffPct: (s.stat && s.stat.faceOffPct) || 0,
					// Playoff stats
					playoffGP: (playoffStat && playoffStat.stat && playoffStat.stat.games) || 0,
					playoffG: (playoffStat && playoffStat.stat && playoffStat.stat.goals) || 0,
					playoffA: (playoffStat && playoffStat.stat && playoffStat.stat.assists) || 0,
					playoffP: (playoffStat && playoffStat.stat && playoffStat.stat.points) || 0
				};
			});

			// Compute career totals from NHL splits
			if (player.seasons && player.seasons.length) {
				const totals = player.seasons.reduce((acc, s) => {
					acc.games += s.gp || 0;
					acc.goals += s.g || 0;
					acc.assists += s.a || 0;
					acc.points += s.p || 0;
					acc.plusMinus += (typeof s.plusMinus === 'number' ? s.plusMinus : 0);
					acc.pim += s.pim || 0;
					acc.hits += 0;
					acc.blocked += 0;
					acc.takeaways += 0;
					acc.giveaways += 0;
					return acc;
				}, { games: 0, goals: 0, assists: 0, points: 0, plusMinus: 0, pim: 0, hits: 0, blocked: 0, takeaways: 0, giveaways: 0 });
				player.career = totals;
			}
		} catch (e) {
			// Swallow errors silently; keep fallbacks
			console.warn('Failed to enrich player details', player.name, e);
		} finally {
			player.detailsLoaded = true;
		}
    }

    // Calculates a player's age based on their birth date
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
        return [{
            id: 8478402,  // Real NHL ID for Connor McDavid
            name: "Connor McDavid",
            position: "Center",
            team: "Edmonton Oilers",
            age: 27,
            photo: "https://assets.nhle.com/mugs/nhl/latest/8478402.png",
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
        }, {
            id: 8477934,  // Real NHL ID for Leon Draisaitl
            name: "Leon Draisaitl",
            position: "Center",
            team: "Edmonton Oilers",
            age: 28,
            photo: "https://assets.nhle.com/mugs/nhl/latest/8477934.png",
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
        }, {
            id: 8477492,  // Real NHL ID for Nathan MacKinnon
            name: "Nathan MacKinnon",
            position: "Center",
            team: "Colorado Avalanche",
            age: 28,
            photo: "https://assets.nhle.com/mugs/nhl/latest/8477492.png",
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
        }, {
            id: 8479318,  // Real NHL ID for Auston Matthews
            name: "Auston Matthews",
            position: "Center",
            team: "Toronto Maple Leafs",
            age: 26,
            photo: "https://assets.nhle.com/mugs/nhl/latest/8479318.png",
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
        }, {
            id: 8478550,  // Real NHL ID for Artemi Panarin
            name: "Artemi Panarin",
            position: "Left Wing",
            team: "New York Rangers",
            age: 32,
            photo: "https://assets.nhle.com/mugs/nhl/latest/8478550.png",
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
        }];
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

    // Renders player cards for each tier
    renderPlayers() {
        for (let tier = 1; tier <= 5; tier++) {
            const tierPlayers = this.players.filter(player => player.tier === tier);
            const container = document.getElementById(`playersTier${tier}`);

            if (container) {
                container.innerHTML = tierPlayers.map(player => this.createPlayerCard(player)).join('');
            }
        }
    }

    // Creates a player card HTML element
    createPlayerCard(player) {
        const pointsClass = player.currentSeasonPoints >= 40 ? 'positive' : 'negative';
        
        // Get prediction if available
        let predictionHtml = '';
        if (window.predictor) {
            const prediction = window.predictor.predictNextSeason(player);
            const trend = prediction.predictedPoints > player.currentSeasonPoints ? 'up' : 'down';
            const trendIcon = trend === 'up' ? '↑' : '↓';
            const trendClass = trend === 'up' ? 'trend-up' : 'trend-down';
            
            predictionHtml = `
                <div class="prediction-badge ${trendClass}">
                    <span class="prediction-trend">${trendIcon}</span>
                    <span class="prediction-value">${prediction.predictedPoints}</span>
                    <span class="prediction-label">Next Season</span>
                </div>
            `;
        }

        return `
            <div class="player-card" data-player-id="${player.id}">
                <img src="${player.photo}" alt="${player.name}" class="player-photo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjOUI5QjlCIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+PC90ZXh0Pgo8L3N2Zz4K'">
                ${predictionHtml}
                <h3 class="player-name">${player.name}</h3>
                <div class="player-info">
                    <div class="player-salary">$${(player.salary / 1000000).toFixed(1)}M</div>
                    <div class="player-plus-minus ${pointsClass}">${player.currentSeasonPoints} pts</div>
                </div>
            </div>
        `;
    }

    // Displays the player modal with detailed player information
	async showPlayerModal(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) return;

		// Enrich player details (fetch NHL info if available)
		try {
			await this.enrichPlayerDetails(player);
		} catch (_) {}

        // Get prediction if predictor is available
        let prediction = null;
        if (window.predictor) {
            try {
                prediction = window.predictor.predictNextSeason(player);
            } catch (e) {
                console.warn('Failed to generate prediction:', e);
            }
        }

        // Populate basic info
        document.getElementById('modalPlayerName').textContent = player.name;
        document.getElementById('modalPlayerPhoto').src = player.photo;
        document.getElementById('modalPlayerPhoto').onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbGJzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjOUI5QjlCIi8+Cjx0ZXh0IHg9IjYwIiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+PC90ZXh0Pgo8L3N2Zz4K';
        };
        document.getElementById('modalPlayerTeam').textContent = player.team;
        document.getElementById('modalPlayerPosition').textContent = player.position;
        document.getElementById('modalPlayerAge').textContent = player.age;
        document.getElementById('modalPlayerSalary').textContent = `$${(player.salary / 1000000).toFixed(1)}M`;

		// Additional player details
		const playerDetails = {
			'Draft': this.getPlayerDraft(player),
			'Nationality': this.getPlayerNationality(player),
			'Height': this.getPlayerHeight(player),
			'Weight': this.getPlayerWeight(player)
		};

        Object.entries(playerDetails).forEach(([key, value]) => {
            const element = document.getElementById(`modalPlayer${key}`);
            if (element) element.textContent = value;
        });

        // Current Season Stats
        const currentSeasonStats = [{
            label: 'Games Played',
            value: player.gamesPlayed
        }, {
            label: 'Goals',
            value: player.goals
        }, {
            label: 'Assists',
            value: player.assists
        }, {
            label: 'Points',
            value: player.currentSeasonPoints
        }, {
            label: 'Plus/Minus',
            value: player.plusMinus
        }];

        document.getElementById('modalCurrentSeasonStats').innerHTML = currentSeasonStats.map(stat => `
            <div class="stat-item">
                <span class="stat-value">${stat.value}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `).join('');

		// Career Stats (use enriched if available)
		const careerStats = [{
			label: 'Career Games',
			value: (player.career && player.career.games) || player.gamesPlayed
		}, {
			label: 'Career Goals',
			value: (player.career && player.career.goals) || player.goals
		}, {
			label: 'Career Assists',
			value: (player.career && player.career.assists) || player.assists
		}, {
			label: 'Career Points',
			value: (player.career && player.career.points) || player.points
		}, {
			label: 'Career Plus/Minus',
			value: (player.career && player.career.plusMinus) || player.plusMinus
        }, {
            label: 'PIM',
			value: (player.career && player.career.pim) || player.pim
        }, {
            label: 'Hits',
			value: (player.career && player.career.hits) || player.hits
        }, {
            label: 'Blocked Shots',
			value: (player.career && player.career.blocked) || player.blocked
        }, {
            label: 'Takeaways',
			value: (player.career && player.career.takeaways) || player.takeaways
        }, {
            label: 'Giveaways',
			value: (player.career && player.career.giveaways) || player.giveaways
		}];

        document.getElementById('modalPlayerStats').innerHTML = careerStats.map(stat => `
            <div class="stat-item">
                <span class="stat-value">${stat.value}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `).join('');

        // Prediction Details
        if (prediction) {
            // Predicted points
            document.getElementById('modalPredictedPoints').textContent = prediction.predictedPoints;
            
            // Prediction range
            document.getElementById('modalPredictionRange').textContent = 
                `${prediction.range.low}-${prediction.range.high}`;
            
            // Confidence meter
            const confidenceMeter = document.getElementById('modalConfidenceMeter');
            confidenceMeter.style.width = `${prediction.confidence * 100}%`;
            confidenceMeter.className = `confidence-level confidence-${
                prediction.confidence >= 0.7 ? 'high' :
                prediction.confidence >= 0.4 ? 'medium' : 'low'
            }`;
            
            // Prediction factors
            const factorsHtml = Object.entries(prediction.factors).map(([key, value]) => `
                <div class="factor-item">
                    <span class="factor-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span class="factor-value">${value.toFixed(2)}x</span>
                </div>
            `).join('');
            document.getElementById('modalPredictionFactors').innerHTML = factorsHtml;

            // Populate prediction history visualization
            const historyChart = document.getElementById('modalPredictionHistory');
            const predictions = window.predictor.historicalPredictions[player.id] || [];
            
            if (predictions.length > 0) {
                // Find max value for scaling
                const maxPredicted = Math.max(...predictions.map(p => p.predictedPoints));
                const maxActual = Math.max(...predictions.map(p => p.actualPoints || 0));
                const maxValue = Math.max(maxPredicted, maxActual, player.currentSeasonPoints);
                
                // Create bars for each prediction
                const barWidth = Math.min(40, (historyChart.offsetWidth - 40) / (predictions.length * 2));
                const spacing = barWidth * 0.5;
                
                const barsHtml = predictions.map((pred, index) => {
                    const predictedHeight = (pred.predictedPoints / maxValue) * 160;
                    const actualHeight = ((pred.actualPoints || player.currentSeasonPoints) / maxValue) * 160;
                    const x = index * (barWidth * 2 + spacing);
                    
                    return `
                        <div class="history-bar predicted" style="
                            left: ${x}px;
                            width: ${barWidth}px;
                            height: ${predictedHeight}px;
                        " title="Predicted: ${pred.predictedPoints}"></div>
                        <div class="history-bar actual" style="
                            left: ${x + barWidth + 2}px;
                            width: ${barWidth}px;
                            height: ${actualHeight}px;
                        " title="Actual: ${pred.actualPoints || 'Current: ' + player.currentSeasonPoints}"></div>
                    `;
                }).join('');
                
                historyChart.innerHTML = barsHtml;
            } else {
                historyChart.innerHTML = '<div class="no-prediction">No prediction history available</div>';
            }
        } else {
            // Hide or show default state for prediction elements
            document.getElementById('modalPredictedPoints').textContent = '-';
            document.getElementById('modalPredictionRange').textContent = '-';
            document.getElementById('modalConfidenceMeter').style.width = '0%';
            document.getElementById('modalPredictionFactors').innerHTML = 
                '<div class="no-prediction">Prediction not available</div>';
            document.getElementById('modalPredictionHistory').innerHTML = 
                '<div class="no-prediction">No prediction history available</div>';
        }

        // Career Milestones
        const milestones = this.getPlayerMilestones(player);
        document.getElementById('modalPlayerMilestones').innerHTML = milestones.map(milestone => `
            <div class="milestone-item">
                <div class="milestone-date">${milestone.date}</div>
                <div class="milestone-description">${milestone.description}</div>
            </div>
        `).join('');

        // Awards & Achievements
        const awards = this.getPlayerAwards(player);
        document.getElementById('modalPlayerAwards').innerHTML = awards.map(award => `
            <div class="award-item">
                <div class="award-year">${award.year}</div>
                <div class="award-name">${award.name}</div>
            </div>
        `).join('');

		// Season by Season
		const seasonTable = document.getElementById('modalPlayerSeasons');
        if (!seasonTable) return;

        // Sort seasons by year in descending order (most recent first)
        const sortedSeasons = player.seasons ? 
            [...player.seasons].sort((a, b) => {
                const yearA = parseInt(a.year.split('-')[0]);
                const yearB = parseInt(b.year.split('-')[0]);
                return yearB - yearA;
            }) : [];

        // Create the season rows
        const seasonRows = sortedSeasons.map(season => {
            const isPlayoffSeason = season.playoffGP > 0;
            const regularSeasonRow = `
                <tr class="regular-season">
                    <td>${season.year}</td>
                    <td>${season.team}</td>
                    <td>${season.gp}</td>
                    <td>${season.g}</td>
                    <td>${season.a}</td>
                    <td>${season.p}</td>
                    <td>${season.plusMinus}</td>
                    <td>${season.timeOnIcePerGame || '-'}</td>
                    <td>${season.ppg || 0}</td>
                    <td>${season.shg || 0}</td>
                    <td>${season.faceOffPct ? season.faceOffPct + '%' : '-'}</td>
                </tr>`;

            const playoffRow = isPlayoffSeason ? `
                <tr class="playoff-season">
                    <td>${season.year} Playoffs</td>
                    <td>${season.team}</td>
                    <td>${season.playoffGP}</td>
                    <td>${season.playoffG}</td>
                    <td>${season.playoffA}</td>
                    <td>${season.playoffP}</td>
                    <td>${season.playoffPlusMinus || '-'}</td>
                    <td>${season.playoffTimeOnIcePerGame || '-'}</td>
                    <td>${season.playoffPPG || 0}</td>
                    <td>${season.playoffSHG || 0}</td>
                    <td>${season.playoffFaceOffPct ? season.playoffFaceOffPct + '%' : '-'}</td>
                </tr>` : '';

            return regularSeasonRow + playoffRow;
        }).join('');

        // Add career totals if available
        let careerRow = '';
        if (player.career) {
            const career = player.career;
            careerRow = `
                <tr class="career-totals">
                    <td>Career Totals</td>
                    <td>-</td>
                    <td>${career.games}</td>
                    <td>${career.goals}</td>
                    <td>${career.assists}</td>
                    <td>${career.points}</td>
                    <td>${career.plusMinus}</td>
                    <td>-</td>
                    <td>${career.ppg || 0}</td>
                    <td>${career.shg || 0}</td>
                    <td>-</td>
                </tr>`;
        }

        // Update the table
        seasonTable.querySelector('tbody').innerHTML = seasonRows + careerRow;

        // Show modal
        document.getElementById('playerModal').style.display = 'block';
    }

    // Helper methods for player data
    getPlayerDraft(player) {
        if (player.draft) return player.draft;
        return '-';
    }

    getPlayerNationality(player) {
        return player.nationality || '-';
    }

    getPlayerHeight(player) {
        return player.height || '-';
    }

    getPlayerWeight(player) {
        return player.weight || '-';
    }

    getPlayerMilestones(player) {
        // Example milestones - in a real app, this would come from API data
        return [{
            date: '2023-24 Season',
            description: `Reached ${player.currentSeasonPoints} points`
        }];
    }

    getPlayerAwards(player) {
        // Example awards - in a real app, this would come from API data
        return [];
    }

    getPlayerSeasons(player) {
        if (player.seasons && player.seasons.length) return player.seasons;
        // fallback to a single-line summary if no seasons available
        return [{
            year: 'Career',
            team: player.team,
            gp: player.gamesPlayed,
            g: player.goals,
            a: player.assists,
            p: player.points,
            plusMinus: player.plusMinus,
            pim: player.pim || 0,
            ppg: 0,
            shg: 0,
            gwg: 0
        }];
    }

    // Hides the player modal
    hidePlayerModal() {
        document.getElementById('playerModal').style.display = 'none';
    }

    // Sets up event listeners for the search input, clear search button, and modal
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

        // Player card click handlers
        document.addEventListener('click', (e) => {
            const playerCard = e.target.closest('.player-card');
            if (playerCard) {
                const playerId = playerCard.dataset.playerId;
                if (playerId) {
                    this.showPlayerModal(playerId);
                }
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

    // Handles the search functionality, filtering players based on the query
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

    // Hides the loading screen and displays the tiers and search container
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('searchContainer').style.display = 'block';
        document.getElementById('tiersContainer').style.display = 'flex';
    }

    // Displays an error message on the loading screen
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

// Player Prediction System
class PlayerPredictor {
    constructor() {
        this.historicalPredictions = this.loadHistoricalPredictions();
        this.ageFactors = {
            young: { min: 18, max: 23, multiplier: 1.1 },    // Young players likely to improve
            prime: { min: 24, max: 28, multiplier: 1.05 },   // Prime years, slight improvement
            peak: { min: 29, max: 31, multiplier: 1.0 },     // Peak performance years
            decline: { min: 32, max: 35, multiplier: 0.95 }, // Slight decline
            veteran: { min: 36, max: 99, multiplier: 0.9 }   // Veteran decline
        };
        this.positionFactors = {
            'C': 1.1,      // Centers typically get more points
            'LW': 1.0,     // Wingers standard scoring
            'RW': 1.0,     // Wingers standard scoring
            'D': 0.8,      // Defensemen typically score less
            'G': 0.0       // Goalies don't score
        };
    }

    // Load historical predictions from localStorage with data cleanup
    loadHistoricalPredictions() {
        try {
            const saved = localStorage.getItem('playerPredictions');
            const predictions = saved ? JSON.parse(saved) : {};
            
            // Clean up old predictions (older than 365 days)
            const now = Date.now();
            const oneYearMs = 365 * 24 * 60 * 60 * 1000;
            
            for (const playerId in predictions) {
                predictions[playerId] = predictions[playerId].filter(pred => {
                    return (now - pred.timestamp) <= oneYearMs;
                });
                
                // Remove empty arrays
                if (predictions[playerId].length === 0) {
                    delete predictions[playerId];
                }
            }
            
            return predictions;
        } catch (e) {
            console.warn('Failed to load historical predictions:', e);
            return {};
        }
    }

    // Save predictions to localStorage with size management
    saveHistoricalPredictions() {
        try {
            // Keep only last 10 predictions per player to manage storage size
            for (const playerId in this.historicalPredictions) {
                if (this.historicalPredictions[playerId].length > 10) {
                    this.historicalPredictions[playerId] = 
                        this.historicalPredictions[playerId]
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .slice(0, 10);
                }
            }
            
            localStorage.setItem('playerPredictions', 
                JSON.stringify(this.historicalPredictions)
            );
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                // If storage is full, remove oldest predictions
                this.cleanupOldPredictions();
                try {
                    localStorage.setItem('playerPredictions', 
                        JSON.stringify(this.historicalPredictions)
                    );
                } catch (retryError) {
                    console.warn('Failed to save predictions after cleanup:', retryError);
                }
            } else {
                console.warn('Failed to save predictions:', e);
            }
        }
    }

    // Cleanup old predictions when storage is full
    cleanupOldPredictions() {
        for (const playerId in this.historicalPredictions) {
            // Keep only the 5 most recent predictions when storage is full
            if (this.historicalPredictions[playerId].length > 5) {
                this.historicalPredictions[playerId] = 
                    this.historicalPredictions[playerId]
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .slice(0, 5);
            }
        }
    }

    // Get age factor for prediction
    getAgeFactor(age) {
        for (const [_, range] of Object.entries(this.ageFactors)) {
            if (age >= range.min && age <= range.max) {
                return range.multiplier;
            }
        }
        return 1.0; // Default multiplier if age is out of all ranges
    }

    // Get position factor for prediction
    getPositionFactor(position) {
        // Extract primary position from combined positions (e.g., "C/LW" -> "C")
        const primaryPosition = position.split('/')[0].trim();
        return this.positionFactors[primaryPosition] || 1.0;
    }

    // Calculate games played factor
    getGamesPlayedFactor(gamesPlayed) {
        const fullSeason = 82;
        // Cap the adjustment at 1.25x to prevent unrealistic projections
        return Math.min(1.25, gamesPlayed >= fullSeason ? 1.0 : (fullSeason / Math.max(1, gamesPlayed)));
    }

    // Calculate points per game with minimum games threshold
    calculatePointsPerGame(points, gamesPlayed, minGames = 20) {
        if (gamesPlayed < minGames) return null;
        return gamesPlayed > 0 ? points / gamesPlayed : 0;
    }

    // Calculate weighted points per game trend
    calculatePointsPerGameTrend(seasons, maxSeasons = 3) {
        if (!seasons || seasons.length === 0) return null;

        // Get recent seasons, sorted by year
        const recentSeasons = seasons
            .slice(-maxSeasons)
            .sort((a, b) => parseInt(a.year) - parseInt(b.year));

        // Calculate weighted ppg for each season
        const weightedTrends = recentSeasons.map((season, index) => {
            const ppg = this.calculatePointsPerGame(season.p, season.gp);
            if (ppg === null) return null;
            
            const weight = (index + 1) / recentSeasons.length; // More recent seasons weighted higher
            const playoffPpg = this.calculatePointsPerGame(season.playoffP, season.playoffGP, 5); // Lower minimum for playoffs
            
            return {
                ppg,
                weight,
                gp: season.gp,
                playoffPpg
            };
        });

        // Calculate trend
        let totalWeight = 0;
        let weightedPpg = 0;
        let playoffImpact = 0;

        weightedTrends.forEach(({ppg, weight, gp, playoffPpg}) => {
            // Weight regular season performance
            if (gp >= 20) { // Minimum games threshold
                weightedPpg += ppg * weight;
                totalWeight += weight;
            }
            // Add playoff performance boost
            if (playoffPpg > ppg) {
                playoffImpact += (playoffPpg - ppg) * 0.1; // 10% boost for playoff overperformance
            }
        });

        return totalWeight > 0 ? (weightedPpg / totalWeight) + playoffImpact : null;
    }

    // Calculate performance trend factor
    getTrendFactor(player) {
        const trend = this.calculatePointsPerGameTrend(player.seasons);
        if (!trend) return 1.0;

        // Current season ppg
        const currentPpg = player.gamesPlayed > 0 ? 
            player.currentSeasonPoints / player.gamesPlayed : 0;

        // Calculate trend direction and strength
        const trendDiff = trend - currentPpg;
        const trendStrength = Math.abs(trendDiff) / Math.max(0.5, currentPpg);
        
        // Limit trend impact
        const maxTrendImpact = 0.15; // Maximum 15% adjustment
        return 1 + Math.max(-maxTrendImpact, Math.min(maxTrendImpact, trendStrength * Math.sign(trendDiff)));
    }

    // Calculate consistency factor based on recent performance
    getConsistencyFactor(player) {
        if (!player.seasons || player.seasons.length < 2) return 1.0;
        
        // Look at last three seasons
        const recentSeasons = player.seasons.slice(-3);
        const pointsPerGame = recentSeasons.map(s => (s.p / Math.max(1, s.gp)));
        
        // Calculate variance in points per game
        const avg = pointsPerGame.reduce((a, b) => a + b, 0) / pointsPerGame.length;
        const variance = pointsPerGame.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / pointsPerGame.length;
        
        // Calculate consistency score (0-1)
        const consistencyScore = Math.max(0, 1 - Math.min(1, variance * 2));
        
        // Weight consistency more heavily for established players
        const experienceFactor = Math.min(1, recentSeasons.reduce((sum, s) => sum + s.gp, 0) / 200);
        
        // More consistent players get a higher factor
        return 1 + (0.15 * consistencyScore * experienceFactor);
    }

    // Main prediction method
    predictNextSeason(player) {
        // Base prediction from current season
        const basePoints = player.currentSeasonPoints;
        const gamesPlayed = player.gamesPlayed;

        // Calculate points per game trend first (used by multiple factors)
        const trend = this.calculatePointsPerGameTrend(player.seasons);
        const trendPoints = trend ? Math.round(trend * 82) : null;

        // Calculate various factors
        const ageFactor = this.getAgeFactor(parseInt(player.age) || 25);
        const positionFactor = this.getPositionFactor(player.position);
        const gamesPlayedFactor = this.getGamesPlayedFactor(gamesPlayed);
        const consistencyFactor = this.getConsistencyFactor(player);
        const trendFactor = trend ? this.getTrendFactor(player) : 1.0;

        // Calculate base prediction adjusted for 82 games
        let adjustedBasePoints;
        if (trendPoints && player.seasons && player.seasons.length >= 2) {
            // Use weighted average of trend and current season
            const trendWeight = Math.min(0.4, player.seasons.length * 0.1); // Max 40% weight for trend
            adjustedBasePoints = (basePoints * gamesPlayedFactor * (1 - trendWeight)) + 
                               (trendPoints * trendWeight);
        } else {
            adjustedBasePoints = basePoints * gamesPlayedFactor;
        }

        // Apply all factors to get final prediction
        let predictedPoints = Math.round(
            adjustedBasePoints * ageFactor * positionFactor * consistencyFactor * trendFactor
        );
        
        // Sanity check: cap prediction at reasonable limits
        const maxIncrease = Math.max(basePoints * 0.5, 40); // Allow 50% increase or 40 points, whichever is higher
        const maxPrediction = basePoints + maxIncrease;
        predictedPoints = Math.min(predictedPoints, maxPrediction);

        // Calculate confidence and range
        const confidence = this.calculateConfidence(player);
        const range = this.calculatePredictionRange(predictedPoints, confidence);

        // Store prediction
        const prediction = {
            predictedPoints,
            confidence,
            range,
            factors: {
                age: ageFactor,
                position: positionFactor,
                gamesPlayed: gamesPlayedFactor,
                consistency: consistencyFactor
            },
            timestamp: Date.now()
        };

        // Save to historical data
        if (!this.historicalPredictions[player.id]) {
            this.historicalPredictions[player.id] = [];
        }
        this.historicalPredictions[player.id].push(prediction);
        this.saveHistoricalPredictions();

        return prediction;
    }

    // Calculate prediction confidence (0-1)
    calculateConfidence(player) {
        let confidence = 0.4; // Start at 40%

        // Age factor (0-15%)
        if (player.age) {
            const age = parseInt(player.age);
            if (age >= 23 && age <= 32) {
                confidence += 0.15; // Prime age range
            } else if (age >= 21 && age <= 34) {
                confidence += 0.1; // Near prime
            } else {
                confidence += 0.05; // Outside prime
            }
        }

        // Games played factor (0-15%)
        const gamesPlayedConfidence = Math.min(0.15, player.gamesPlayed / 550);
        confidence += gamesPlayedConfidence;

        // Historical data factor (0-15%)
        if (player.seasons) {
            const seasonCount = Math.min(5, player.seasons.length);
            confidence += (seasonCount * 0.03); // 3% per season up to 15%
        }

        // Consistency factor (0-15%)
        const consistencyScore = this.getConsistencyFactor(player) - 1; // Normalize to 0-0.15
        confidence += consistencyScore;

        // Trend confidence (0-10%)
        const trend = this.calculatePointsPerGameTrend(player.seasons);
        if (trend !== null) {
            const currentPpg = player.gamesPlayed > 0 ? 
                player.currentSeasonPoints / player.gamesPlayed : 0;
            const trendDiff = Math.abs(trend - currentPpg);
            const trendConfidence = Math.max(0, 0.1 - (trendDiff / Math.max(0.5, currentPpg)) * 0.1);
            confidence += trendConfidence;
        }

        return Math.min(1, Math.max(0, confidence));
    }

    // Calculate prediction range based on confidence
    calculatePredictionRange(predictedPoints, confidence) {
        const varianceFactor = 1 - confidence;
        const range = Math.round(predictedPoints * varianceFactor);
        
        return {
            low: Math.max(0, predictedPoints - range),
            high: predictedPoints + range
        };
    }

    // Get prediction accuracy for a player
    getPredictionAccuracy(playerId) {
        const predictions = this.historicalPredictions[playerId];
        if (!predictions || predictions.length === 0) return null;

        // Calculate accuracy metrics
        const accuracies = predictions.map(pred => {
            const actual = pred.actualPoints;
            if (typeof actual !== 'number') return null;

            const error = Math.abs(actual - pred.predictedPoints);
            const accuracy = Math.max(0, 100 - (error / actual * 100));
            return accuracy;
        }).filter(acc => acc !== null);

        if (accuracies.length === 0) return null;

        // Return average accuracy
        return accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    }
}

// Initialize the application when DOM is loaded
window.nhlApp = null;
window.predictor = null;
document.addEventListener('DOMContentLoaded', () => {
    window.nhlApp = new NHLPlayerTiers();
    window.predictor = new PlayerPredictor();

    // Apply saved theme preference
    try {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') document.documentElement.classList.add('dark');
    } catch (_) {}

    // Theme toggle
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const root = document.documentElement;
            const isDark = root.classList.toggle('dark');
            try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (_) {}
        });
    }
});
