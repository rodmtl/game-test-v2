/**
 * Poop in My Hands - Jeu JavaScript Rétro
 * Architecte DevOps: Rodrigo
 * Version: 1.0.0
 */

class PoopInMyHandsGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.gameSpeed = 1;
        
        // Configuration du jeu
        this.config = {
            player: {
                width: 60,
                height: 80,
                speed: 5,
                headHeight: 20,
                handWidth: 15,
                handHeight: 15
            },
            poop: {
                width: 25,
                height: 30,
                minSpeed: 2,
                maxSpeed: 6,
                spawnRate: 0.02
            },
            canvas: {
                width: 800,
                height: 600
            }
        };
        
        // État du joueur
        this.player = {
            x: this.config.canvas.width / 2 - this.config.player.width / 2,
            y: this.config.canvas.height - this.config.player.height - 20,
            leftHandX: 0,
            leftHandY: 0,
            rightHandX: 0,
            rightHandY: 0,
            headX: 0,
            headY: 0
        };
        
        // Tableaux de jeu
        this.poops = [];
        this.particles = [];
        
        // Contrôles
        this.keys = {
            left: false,
            right: false
        };
        
        // Système de score
        this.highScores = this.loadHighScores();
        
        this.init();
    }
    
    /**
     * Initialisation du jeu
     */
    init() {
        this.setupEventListeners();
        this.updatePlayerHitboxes();
        this.updateScoreDisplay();
        this.displayLeaderboard();
        
        // Configuration du canvas pour le rendu pixelisé
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
    }
    
    /**
     * Configuration des événements
     */
    setupEventListeners() {
        // Contrôles clavier
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Boutons de l'interface
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('submit-score').addEventListener('click', () => this.submitScore());
        
        // Prévenir le défilement avec les flèches
        document.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    /**
     * Gestion des touches pressées
     */
    handleKeyDown(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.keys.left = true;
                break;
            case 'ArrowRight':
                this.keys.right = true;
                break;
            case ' ':
                if (this.gameRunning) this.togglePause();
                break;
        }
    }
    
    /**
     * Gestion des touches relâchées
     */
    handleKeyUp(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'ArrowRight':
                this.keys.right = false;
                break;
        }
    }
    
    /**
     * Démarrage du jeu
     */
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.score = 0;
        this.gameSpeed = 1;
        this.poops = [];
        this.particles = [];
        
        // Reset de la position du joueur
        this.player.x = this.config.canvas.width / 2 - this.config.player.width / 2;
        
        // Interface
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('gameOverModal').style.display = 'none';
        
        this.gameLoop();
    }
    
    /**
     * Pause/Reprendre le jeu
     */
    togglePause() {
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Reprendre' : 'Pause';
        
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }
    
    /**
     * Redémarrer le jeu
     */
    restartGame() {
        this.startGame();
    }
    
    /**
     * Boucle principale du jeu
     */
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Mise à jour de la logique du jeu
     */
    update() {
        this.updatePlayer();
        this.updatePoops();
        this.updateParticles();
        this.spawnPoops();
        this.checkCollisions();
        this.updateGameSpeed();
        this.updateScoreDisplay();
    }
    
    /**
     * Mise à jour du joueur
     */
    updatePlayer() {
        // Mouvement horizontal
        if (this.keys.left && this.player.x > 0) {
            this.player.x -= this.config.player.speed;
        }
        if (this.keys.right && this.player.x < this.config.canvas.width - this.config.player.width) {
            this.player.x += this.config.player.speed;
        }
        
        this.updatePlayerHitboxes();
    }
    
    /**
     * Mise à jour des hitboxes du joueur
     */
    updatePlayerHitboxes() {
        const playerCenterX = this.player.x + this.config.player.width / 2;
        
        // Position de la tête
        this.player.headX = playerCenterX - 15;
        this.player.headY = this.player.y;
        
        // Position des mains
        this.player.leftHandX = this.player.x - 10;
        this.player.leftHandY = this.player.y + 30;
        
        this.player.rightHandX = this.player.x + this.config.player.width - 5;
        this.player.rightHandY = this.player.y + 30;
    }
    
    /**
     * Mise à jour des cacas qui tombent
     */
    updatePoops() {
        for (let i = this.poops.length - 1; i >= 0; i--) {
            const poop = this.poops[i];
            poop.y += poop.speed;
            
            // Rotation pour l'effet visuel
            poop.rotation += 0.1;
            
            // Supprimer les cacas qui sont sortis de l'écran
            if (poop.y > this.config.canvas.height) {
                this.poops.splice(i, 1);
            }
        }
    }
    
    /**
     * Mise à jour des particules d'effet
     */
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    /**
     * Génération de nouveaux cacas
     */
    spawnPoops() {
        if (Math.random() < this.config.poop.spawnRate * this.gameSpeed) {
            this.poops.push({
                x: Math.random() * (this.config.canvas.width - this.config.poop.width),
                y: -this.config.poop.height,
                speed: (Math.random() * (this.config.poop.maxSpeed - this.config.poop.minSpeed) + this.config.poop.minSpeed) * this.gameSpeed,
                rotation: 0
            });
        }
    }
    
    /**
     * Vérification des collisions
     */
    checkCollisions() {
        for (let i = this.poops.length - 1; i >= 0; i--) {
            const poop = this.poops[i];
            
            // Collision avec la tête = Game Over
            if (this.isColliding(poop, {
                x: this.player.headX,
                y: this.player.headY,
                width: 30,
                height: this.config.player.headHeight
            })) {
                this.gameOver();
                return;
            }
            
            // Collision avec les mains = Points
            const leftHandHit = this.isColliding(poop, {
                x: this.player.leftHandX,
                y: this.player.leftHandY,
                width: this.config.player.handWidth,
                height: this.config.player.handHeight
            });
            
            const rightHandHit = this.isColliding(poop, {
                x: this.player.rightHandX,
                y: this.player.rightHandY,
                width: this.config.player.handWidth,
                height: this.config.player.handHeight
            });
            
            if (leftHandHit || rightHandHit) {
                this.score += 10;
                this.createParticles(poop.x, poop.y, '#ffff00');
                this.poops.splice(i, 1);
            }
        }
    }
    
    /**
     * Détection de collision entre deux rectangles
     */
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + this.config.poop.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + this.config.poop.height > rect2.y;
    }
    
    /**
     * Création d'effet de particules
     */
    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x + this.config.poop.width / 2,
                y: y + this.config.poop.height / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: color,
                life: 30
            });
        }
    }
    
    /**
     * Augmentation de la difficulté
     */
    updateGameSpeed() {
        this.gameSpeed = 1 + (this.score / 500);
    }
    
    /**
     * Fin de partie
     */
    gameOver() {
        this.gameRunning = false;
        
        // Interface
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('final-score').textContent = this.score;
        
        // Vérifier si c'est un nouveau record
        const isHighScore = this.score > 0 && (this.highScores.length < 5 || this.score > this.highScores[this.highScores.length - 1].score);
        
        if (isHighScore) {
            document.getElementById('high-score-form').style.display = 'block';
            document.getElementById('player-name').focus();
        } else {
            document.getElementById('high-score-form').style.display = 'none';
        }
        
        document.getElementById('gameOverModal').style.display = 'block';
        this.displayLeaderboard();
    }
    
    /**
     * Soumission du score
     */
    submitScore() {
        const playerName = document.getElementById('player-name').value.trim() || 'Anonyme';
        
        this.highScores.push({
            name: playerName,
            score: this.score,
            date: new Date().toLocaleDateString('fr-FR')
        });
        
        // Trier et garder seulement les 5 meilleurs
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 5);
        
        this.saveHighScores();
        this.updateScoreDisplay();
        this.displayLeaderboard();
        
        document.getElementById('high-score-form').style.display = 'none';
        document.getElementById('player-name').value = '';
    }
    
    /**
     * Affichage du tableau des scores
     */
    displayLeaderboard() {
        const scoreList = document.getElementById('score-list');
        scoreList.innerHTML = '';
        
        this.highScores.forEach((score, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${index + 1}. ${score.name} - ${score.score} pts (${score.date})`;
            scoreList.appendChild(li);
        });
    }
    
    /**
     * Mise à jour de l'affichage du score
     */
    updateScoreDisplay() {
        document.getElementById('current-score').textContent = this.score;
        const highScore = this.highScores.length > 0 ? this.highScores[0].score : 0;
        document.getElementById('high-score').textContent = highScore;
    }
    
    /**
     * Sauvegarde des scores
     */
    saveHighScores() {
        localStorage.setItem('poopGameHighScores', JSON.stringify(this.highScores));
    }
    
    /**
     * Chargement des scores
     */
    loadHighScores() {
        const saved = localStorage.getItem('poopGameHighScores');
        return saved ? JSON.parse(saved) : [];
    }
    
    /**
     * Rendu du jeu
     */
    render() {
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.config.canvas.width, this.config.canvas.height);
        
        // Fond dégradé (ciel vers sol)
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.config.canvas.height);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(0.6, '#87ceeb');
        gradient.addColorStop(0.6, '#90ee90');
        gradient.addColorStop(1, '#90ee90');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.config.canvas.width, this.config.canvas.height);
        
        // Rendu des cacas
        this.renderPoops();
        
        // Rendu du joueur
        this.renderPlayer();
        
        // Rendu des particules
        this.renderParticles();
        
        // Affichage de la pause
        if (this.gamePaused) {
            this.renderPauseScreen();
        }
    }
    
    /**
     * Rendu des cacas qui tombent
     */
    renderPoops() {
        this.poops.forEach(poop => {
            this.ctx.save();
            this.ctx.translate(poop.x + this.config.poop.width / 2, poop.y + this.config.poop.height / 2);
            this.ctx.rotate(poop.rotation);
            
            // Dessin pixelisé du caca
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(-this.config.poop.width / 2, -this.config.poop.height / 2, this.config.poop.width, this.config.poop.height);
            
            // Détails du caca
            this.ctx.fillStyle = '#654321';
            this.ctx.fillRect(-8, -10, 6, 6);
            this.ctx.fillRect(-2, -8, 4, 4);
            this.ctx.fillRect(2, -12, 5, 5);
            
            this.ctx.restore();
        });
    }
    
    /**
     * Rendu du joueur
     */
    renderPlayer() {
        const centerX = this.player.x + this.config.player.width / 2;
        
        // Corps du joueur
        this.ctx.fillStyle = '#FFE4B5';
        this.ctx.fillRect(this.player.x + 15, this.player.y + 20, 30, 50);
        
        // Tête
        this.ctx.fillStyle = '#FFDBAC';
        this.ctx.fillRect(this.player.headX, this.player.headY, 30, this.config.player.headHeight);
        
        // Yeux
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(this.player.headX + 5, this.player.headY + 5, 3, 3);
        this.ctx.fillRect(this.player.headX + 22, this.player.headY + 5, 3, 3);
        
        // Bouche
        this.ctx.fillRect(this.player.headX + 12, this.player.headY + 12, 6, 2);
        
        // Bras
        this.ctx.fillStyle = '#FFE4B5';
        this.ctx.fillRect(this.player.x + 5, this.player.y + 25, 10, 25);
        this.ctx.fillRect(this.player.x + 45, this.player.y + 25, 10, 25);
        
        // Mains (zones de capture)
        this.ctx.fillStyle = '#FFDBAC';
        this.ctx.fillRect(this.player.leftHandX, this.player.leftHandY, this.config.player.handWidth, this.config.player.handHeight);
        this.ctx.fillRect(this.player.rightHandX, this.player.rightHandY, this.config.player.handWidth, this.config.player.handHeight);
        
        // Jambes
        this.ctx.fillStyle = '#0000FF';
        this.ctx.fillRect(this.player.x + 18, this.player.y + 60, 12, 20);
        this.ctx.fillRect(this.player.x + 30, this.player.y + 60, 12, 20);
        
        // Affichage des zones de collision en mode debug (optionnel)
        if (false) { // Activer pour debug
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(this.player.headX, this.player.headY, 30, this.config.player.headHeight);
            
            this.ctx.strokeStyle = 'green';
            this.ctx.strokeRect(this.player.leftHandX, this.player.leftHandY, this.config.player.handWidth, this.config.player.handHeight);
            this.ctx.strokeRect(this.player.rightHandX, this.player.rightHandY, this.config.player.handWidth, this.config.player.handHeight);
        }
    }
    
    /**
     * Rendu des particules
     */
    renderParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / 30;
            this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        });
    }
    
    /**
     * Écran de pause
     */
    renderPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.config.canvas.width, this.config.canvas.height);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '32px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSE', this.config.canvas.width / 2, this.config.canvas.height / 2);
        
        this.ctx.font = '12px "Press Start 2P"';
        this.ctx.fillText('Appuyez sur ESPACE ou Pause pour reprendre', this.config.canvas.width / 2, this.config.canvas.height / 2 + 50);
    }
}

// Initialisation du jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    new PoopInMyHandsGame();
});
