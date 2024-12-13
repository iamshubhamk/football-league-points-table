// Initialize league data
let leagueData = {
    'Lezter': { mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, points: 0 },
    'Jessi': { mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, points: 0 },
    'Kumar': { mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, points: 0 }
};

let matchHistory = [];

// Handle form submission
document.getElementById('matchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;
    const score1 = parseInt(document.getElementById('score1').value);
    const score2 = parseInt(document.getElementById('score2').value);
    
    // Validate input
    if (player1 === player2) {
        alert('Please select different players');
        return;
    }
    
    // Update match history
    matchHistory.push({
        player1,
        player2,
        score1,
        score2,
        date: new Date().toLocaleDateString()
    });
    
    // Update statistics
    updateStats(player1, player2, Number(score1), Number(score2));
    updateTable();
    updateMatchHistory();
    
    // Reset form
    this.reset();
});

function updateStats(player1, player2, score1, score2) {
    // Update matches played
    leagueData[player1].mp++;
    leagueData[player2].mp++;
    
    // Update goals
    leagueData[player1].gf += score1;
    leagueData[player1].ga += score2;
    leagueData[player2].gf += score2;
    leagueData[player2].ga += score1;
    
    // Update wins/draws/losses and points
    if (score1 > score2) {
        leagueData[player1].w++;
        leagueData[player1].points += 3;
        leagueData[player2].l++;
    } else if (score2 > score1) {
        leagueData[player2].w++;
        leagueData[player2].points += 3;
        leagueData[player1].l++;
    } else {
        leagueData[player1].d++;
        leagueData[player2].d++;
        leagueData[player1].points += 1;
        leagueData[player2].points += 1;
    }
}

function updateTable() {
    const tableBody = document.getElementById('leagueTableBody');
    tableBody.innerHTML = '';
    
    // Sort players by points and goal difference
    const sortedPlayers = Object.entries(leagueData)
        .sort(([,a], [,b]) => {
            if (a.points !== b.points) {
                return b.points - a.points;
            }
            return (b.gf - b.ga) - (a.gf - a.ga);
        });
    
    // Check if league is complete
    const totalMatches = sortedPlayers.reduce((sum, [,stats]) => sum + stats.mp, 0);
    const isLeagueComplete = totalMatches === 30; // 10 matches each = 30 total
    
    sortedPlayers.forEach(([player, stats], index) => {
        const row = document.createElement('tr');
        if (isLeagueComplete && index === 0) {
            row.classList.add('winner');
        }
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player}</td>
            <td>${stats.mp}</td>
            <td>${stats.w}</td>
            <td>${stats.d}</td>
            <td>${stats.l}</td>
            <td>${stats.gf}</td>
            <td>${stats.ga}</td>
            <td>${stats.gf - stats.ga}</td>
            <td>${stats.points}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

function updateMatchHistory() {
    const historyDiv = document.getElementById('matchHistory');
    historyDiv.innerHTML = '';
    
    matchHistory.reverse().forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match-record';
        matchDiv.innerHTML = `
            <span>${match.date}</span>
            <span>${match.player1} ${match.score1} - ${match.score2} ${match.player2}</span>
        `;
        historyDiv.appendChild(matchDiv);
    });
}

// Initial table update
updateTable();