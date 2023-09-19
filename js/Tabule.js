'use strict' /** use strict nemusí povolit JS chyby v kódu. */

class Tabule {
    
    constructor(){
        const poznamkyZeStorage = localStorage.getItem('poznamky');
        this.poznamky = poznamkyZeStorage ? JSON.parse(poznamkyZeStorage) : [];

        this.nazevInput = document.getElementById('nazev');
        this.popisInput = document.getElementById('popis');
        this.pridatPoznamku = document.getElementById('pridat');
        this.vypisElement = document.getElementById('tabulePoznamky');
        this.pocetZnakuElement = document.getElementById('pocetZnaku');
        
        this._nastavUdalosti();
    }

    _nastavUdalosti() {
        this.pridatPoznamku.onclick = () => {
            if (this.popisInput.value !== '' && this.nazevInput.value.length !== 0) {
                const poznamka = new Poznamka(this.nazevInput.value, this.popisInput.value);
                this.poznamky.push(poznamka);
                this.ulozPoznamky();
                this.vypisPoznamky();
                this.popisInput.value = '';
                this.nazevInput.value = '';
                this.aktualizujPocetZnaku();
            } else {
                alert('K uložení musíte vyplnit název a popis poznámky.');
            }
        };

        this.popisInput.addEventListener('input', () => {
            this.aktualizujPocetZnaku();
        });
    }

    aktualizujPocetZnaku() {
        const maxDelka = 400;
        const pocetZnaku = this.popisInput.value.length;

        if (pocetZnaku > maxDelka) {
            this.popisInput.value = this.popisInput.value.substring(0, maxDelka);
        }

        this.pocetZnakuElement.textContent = `${pocetZnaku}/${maxDelka}`;
    }
    
    
    vypisPoznamky() {
        this.vypisElement.innerHTML = '';

        for (const poznamka of this.poznamky) {
            
            const poznamky = document.createElement('div');
            poznamky.className = 'poznamky';
            poznamky.innerHTML = `<div class="poznamka">${poznamka.nazev}</div><p>${poznamka.popis}</p>`;

            const upravitPoznamku = (poznamka) => {
                const noveUdaje = prompt('Upravte název a popis, které oddělte dvojtečkou (:)', `${poznamka.nazev}: ${poznamka.popis}`);
                if (noveUdaje !== null) {
                    const [novyNazev, novyPopis] = noveUdaje.split(':').map(str => str.trim());
                    poznamka.nazev = novyNazev;
                    poznamka.popis = novyPopis;
                    
                    tabule.ulozPoznamky();
                    tabule.vypisPoznamky();
                }
            }

            const ikonaUpravit = document.createElement('button');
            ikonaUpravit.innerHTML = '<img src="ikony/ikonaUpravit.svg" id="upravit" alt="Upravit poznámku">';
            ikonaUpravit.onclick = () => {
                upravitPoznamku(poznamka);
            };

            const ikonaOdstranit = document.createElement('button');
            ikonaOdstranit.innerHTML = '<img src="ikony/ikonaOdstranit.svg" id="odstranit" alt="Odstranit poznámku">';
            ikonaOdstranit.onclick = () => { 
                if (confirm('Opravdu chcete odstranit poznámku?')) {
                    this.poznamky = this.poznamky.filter(p => p !== poznamka);
                    this.ulozPoznamky();
                    this.vypisPoznamky();
                }
            };

            poznamky.appendChild(ikonaUpravit);
            poznamky.appendChild(ikonaOdstranit);

            this.vypisElement.appendChild(poznamky);
                
        }
                
    }

    ulozPoznamky() {
        localStorage.setItem('poznamky', JSON.stringify(this.poznamky));
     }

    _pridejIkonu(text, akce, doElementu) {
        const ikona = document.createElement('button');
        ikona.innerText = text;
        ikona.onclick = akce;
        doElementu.appendChild(ikona);
    }
}