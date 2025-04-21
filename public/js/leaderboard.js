document.addEventListener('DOMContentLoaded', function() {
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const leaderboardModal = document.getElementById('leaderboard-modal');
    const closeBtn = leaderboardModal.querySelector('.close');
    const buttonClickSound = new Audio('./audio/buttonclick.mp3'); // Add button click sound
    
    // Function to play button click sound
    const playButtonSound = () => {
        buttonClickSound.currentTime = 0;
        buttonClickSound.play();
    };
    
    // Open leaderboard modal
    leaderboardBtn.addEventListener('click', function() {
        playButtonSound();
        leaderboardModal.style.display = 'block';
        displayLeaderboard();
    });
    
    // Close leaderboard modal
    closeBtn.addEventListener('click', function() {
        playButtonSound();
        leaderboardModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === leaderboardModal) {
            leaderboardModal.style.display = 'none';
        }
    });

    // Get leaderboard from localStorage or create empty array
    function getLeaderboard() {
        const leaderboard = localStorage.getItem('hk_leaderboard');
        return leaderboard ? JSON.parse(leaderboard) : [];
    }

    // Save leaderboard to localStorage
    function saveLeaderboard(leaderboard) {
        localStorage.setItem('hk_leaderboard', JSON.stringify(leaderboard));
    }

    // Add a score to the leaderboard
    window.addToLeaderboard = function(score) {
        const playerName = document.getElementById('player-name').value.trim() || 'Anonymous';
        const leaderboard = getLeaderboard();
        
        // Add new score
        leaderboard.push({
            name: playerName,
            score: score,
            date: new Date().toISOString()
        });
        
        // Sort by score (highest first)
        leaderboard.sort((a, b) => b.score - a.score);
        
        // Keep only top 10 scores
        const topScores = leaderboard.slice(0, 10);
        
        // Save back to localStorage
        saveLeaderboard(topScores);
        
        return topScores;
    };

    // Display leaderboard in the modal
    function displayLeaderboard() {
        const leaderboard = getLeaderboard();
        const leaderboardBody = document.getElementById('leaderboard-body');
        
        // Clear existing entries
        leaderboardBody.innerHTML = '';
        
        // Add entries to table
        leaderboard.forEach((entry, index) => {
            const row = document.createElement('tr');
            
            // Add rank cell
            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;
            row.appendChild(rankCell);
            
            // Add name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = entry.name;
            row.appendChild(nameCell);
            
            // Add score cell
            const scoreCell = document.createElement('td');
            scoreCell.textContent = entry.score;
            row.appendChild(scoreCell);
            
            // Add special class for top 3
            if (index < 3) {
                row.classList.add(`rank-${index + 1}`);
            }
            
            leaderboardBody.appendChild(row);
        });
        
        // If no entries, show a message
        if (leaderboard.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 3;
            cell.textContent = 'No scores yet. Play the game to set a record!';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            leaderboardBody.appendChild(row);
        }
    }
});