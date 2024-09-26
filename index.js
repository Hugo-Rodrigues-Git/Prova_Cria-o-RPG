const { createApp } = Vue;

createApp({
    data() {
        return {
            gameOver: false,
            currentTurn: 'hero', // Define de quem é o turno atual
            gameResultMessage: '',
            hero: {
                name: "Kraytos",
                life: 175,
                maxLife: 175,
                Percentil: 100,
                blocking: false,
                magicMode: false,
            },
            villain: {
                name: "Mestre dos Magos",
                life: 200,
                maxLife: 200,
                Percentil: 100,
                blocking: false,
                magicMode: false,
            }
        };
    },
    methods: {
        // Método de ataque
        attack(isHero) {
            if (isHero && this.currentTurn === 'hero') {
                this.handleAttack(this.villain, this.hero, 20);
                this.endHeroTurn();
            } else if (!isHero && this.currentTurn === 'villain') {
                this.handleAttack(this.hero, this.villain, 15);
                this.endVillainTurn();
            }
        },
        // Método de defesa
        defend(isHero) {
            if (isHero && this.currentTurn === 'hero') {
                this.hero.blocking = true;
                console.log("Kraytos está defendendo!");
                this.endHeroTurn();
            } else if (!isHero && this.currentTurn === 'villain') {
                this.villain.blocking = true;
                console.log("Mestre dos Magos está defendendo!");
                this.endVillainTurn();
            }
        },
        // Uso de poção
        usePotion(isHero) {
            if (isHero && this.currentTurn === 'hero') {
                this.handleHealing(this.hero, 25);
                this.endHeroTurn();
            } else if (!isHero && this.currentTurn === 'villain') {
                this.handleHealing(this.villain, 30);
                this.endVillainTurn();
            }
        },
        // Método para alternar modo mágico
        toggleMagicMode(isHero) {
            if (isHero && this.currentTurn === 'hero') {
                this.hero.magicMode = !this.hero.magicMode;
                this.endHeroTurn();
            }
        },
        // Função auxiliar para ataque
        handleAttack(target, attacker, maxDmg) {
            if (target.blocking) {
                console.log("Ataque bloqueado!");
                target.blocking = false; 
            } else {
                let dano = this.GenerateRNG(maxDmg);
                target.life -= dano;
                target.Percentil = ((target.life / target.maxLife) * 100);
                if (target.life <= 0) {
                    target.life = 0;
                    this.endGame(attacker.name);
                }
            }
        },
        // Função auxiliar para cura
        handleHealing(character, healAmount) {
            character.life += this.GenerateRNG(healAmount);
            if (character.life > character.maxLife) {
                character.life = character.maxLife;
            }
            character.Percentil = ((character.life / character.maxLife) * 100);
        },
        // Gera um valor aleatório
        GenerateRNG(maxValue) {
            return Math.floor(Math.random() * maxValue);
        },
        // Finaliza o turno do herói e passa para o vilão
        endHeroTurn() {
            this.currentTurn = 'villain';
            this.villainAction();
        },
        // Finaliza o turno do vilão e passa para o herói
        endVillainTurn() {
            this.currentTurn = 'hero';
        },
        // Ações automáticas do vilão
        villainAction() {
            let actions = ['attack', 'defend', 'usePotion'];
            const action = actions[this.GenerateRNG(actions.length)];
            this[action](false);
        },
        // Finalizar o jogo
        endGame(winner) {
            this.gameOver = true;
            this.gameResultMessage = `${winner} venceu o jogo!`;
        },
        // Reiniciar o jogo
        resetGame() {
            this.hero.life = 175;
            this.hero.Percentil = 100;
            this.villain.life = 200;
            this.villain.Percentil = 100;
            this.currentTurn = 'hero';
            this.gameOver = false;
        }
    }
}).mount('#app');
