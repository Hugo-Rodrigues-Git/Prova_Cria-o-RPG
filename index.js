const { createApp } = Vue;

createApp({
    data() {
        return {
            gameOver: false,
            currentTurn: 'hero', // Define de quem é o turno atual
            gameResultMessage: '',
            hero: {
                name: "Kraytos",
                life: 200,
                maxLife: 200,
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
        attack(isHero) {
            if (isHero && this.currentTurn === 'hero') {
                this.handleAttack(this.villain, this.hero, 25);
                this.endHeroTurn();
            } else if (!isHero && this.currentTurn === 'villain') {
                this.handleAttack(this.hero, this.villain, 20);
                this.endVillainTurn();
            }
        },
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
        usePotion(isHero) {
            if (isHero && this.currentTurn === 'hero') {
                this.hero.life = Math.min(this.hero.life + 30, this.hero.maxLife); // Cura até 30
                this.hero.Percentil = ((this.hero.life / this.hero.maxLife) * 100);
                this.endHeroTurn();
            } else if (!isHero && this.currentTurn === 'villain') {
                this.villain.life = Math.min(this.villain.life + 35, this.villain.maxLife); // Cura até 25
                this.villain.Percentil = ((this.villain.life / this.villain.maxLife) * 100);
                this.endVillainTurn();
            }
        },
        toggleMagicMode(isHero) {
            if (isHero && this.currentTurn === 'hero') {
                console.log("Kraytos ativa o modo mágico!");
                this.handleMagicAttack(this.villain, this.hero, 40, 10);
                this.hero.magicMode = !this.hero.magicMode; // Alterna o modo mágico
                this.endHeroTurn();
            } else if (!isHero && this.currentTurn === 'villain') {
                console.log("Mestre dos Magos ativa o modo mágico!");
                this.handleMagicAttack(this.hero, this.villain, 38, 10);
                this.villain.magicMode = !this.villain.magicMode; // Alterna o modo mágico
                this.endVillainTurn();
            }
        },
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
        handleMagicAttack(target, attacker, targetDmg, selfDmg) {
            let danoAoOponente = this.GenerateRNG(targetDmg);
            let danoAoUsuario = this.GenerateRNG(selfDmg);
            
            target.life -= danoAoOponente;
            target.Percentil = ((target.life / target.maxLife) * 100);

            attacker.life -= danoAoUsuario;
            attacker.Percentil = ((attacker.life / attacker.maxLife) * 100);

            console.log(`${attacker.name} usa magia: ${danoAoOponente} de dano no oponente e ${danoAoUsuario} de dano próprio!`);

            if (target.life <= 0) {
                target.life = 0;
                this.endGame(attacker.name);
            }

            if (attacker.life <= 0) {
                attacker.life = 0;
                this.endGame(target.name);
            }
        },
        GenerateRNG(maxValue) {
            return Math.floor(Math.random() * maxValue);
        },
        endHeroTurn() {
            this.currentTurn = 'villain'; // Muda para o turno do vilão
        },
        endVillainTurn() {
            this.currentTurn = 'hero'; // Muda para o turno do herói
        },
        endGame(winner) {
            this.gameOver = true;
            this.gameResultMessage = `${winner} venceu o jogo!`;
        },
        resetGame() {
            this.hero.life = 200;
            this.hero.Percentil = 100;
            this.villain.life = 200;
            this.villain.Percentil = 100;
            this.currentTurn = 'hero';
            this.gameOver = false;
        }
    }
}).mount('#app');
