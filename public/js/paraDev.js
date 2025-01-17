const arrayCursos = {
    intro: [
        'aula6',
        'aula7',
        'aula8',
        'aula9',
        'aula10',
        //'aula11',
        //'aula12',
        //'aula13',
        //'aula14',
        //'aula15',
        //'aula16'
    ],
    win: [
        'aula6',
        'aula7',
        'aula8',
        'aula9',
        'aula10',
        'aula11',
        'aula12',
        //'aula13',
        //'aula14',
        //'aula15',
        //'aula16'
    ],
    word: [
        'aula6',
        'aula7',
        'aula8',
        'aula9',
        'aula10',
        'aula11',
        'aula12',
        'aula13',
        //'aula14',
        //'aula15',
        //'aula16'
    ],
    excel: [
        'aula6',
        'aula7',
        'aula8',
        'aula9',
        'aula10',
        'aula11',
        'aula12',
        'aula13',
        'aula14',
        //'aula15',
        //'aula16'
    ],
    depPessoal: [
        'aula6',
        'aula7',
        'aula8',
        'aula9',
        'aula10',
        'aula11',
        'aula12',
        //'aula13',
        //'aula14',
        //'aula15',
        //'aula16'
    ],
    escritaFiscal: [
        'aula6',
        'aula7',
        'aula8',
        'aula9',
        'aula10',
        //'aula11',
        //'aula12',
        //'aula13',
        //'aula14',
        //'aula15',
        //'aula16'
    ]
}

const introTotal = arrayCursos.intro.length;
const winTotal = arrayCursos.win.length;
const wordTotal = arrayCursos.word.length;
const excelTotal = arrayCursos.excel.length;
const depPessoalTotal = arrayCursos.depPessoal.length;
const escritaFiscalTotal = arrayCursos.escritaFiscal.length;


// quantidade intro
function introQuantidade() {
    let numAulas = document.querySelectorAll('.numAulas');
    if (numAulas.length > 0) {
        numAulas[0].innerHTML = `${introTotal + 5}/16`;
    }
}
introQuantidade();

// quantidade win
function winQuantidade() {
    let numAulas = document.querySelectorAll('.numAulas');
    if (numAulas.length > 1) {
        numAulas[1].innerHTML = `${winTotal + 5}/16`;
    }
}
winQuantidade();

// quantidade word
function wordQuantidade() {
    let numAulas = document.querySelectorAll('.numAulas');
    if (numAulas.length > 2) {
        numAulas[2].innerHTML = `${wordTotal + 5}/16`;
    }
}
wordQuantidade();

// quantidade excel
function excelQuantidade() {
    let numAulas = document.querySelectorAll('.numAulas');
    if (numAulas.length > 3) {
        numAulas[3].innerHTML = `${excelTotal + 5}/16`;
    }
}
excelQuantidade();

// quantidade depPessoal
function depPessoalQuantidade() {
    let numAulas = document.querySelectorAll('.numAulas');
    if (numAulas.length > 4) {
        numAulas[4].innerHTML = `${depPessoalTotal + 5}/16`;
    }
}
depPessoalQuantidade();

// quantidade escritaFiscal
function escritaFiscalQuantidade() {
    let numAulas = document.querySelectorAll('.numAulas');
    if (numAulas.length > 5) {
        numAulas[5].innerHTML = `${escritaFiscalTotal + 5}/16`;
    }
}
escritaFiscalQuantidade();

/*let meusCursosBtn = document.querySelectorAll('.meusCursos');
meusCursosBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        window.location.href = './home.html';
    });
});*/

let devsOpt = document.getElementById('dev-opts');
let devsBtn = document.querySelectorAll('.devsBtn');
devsBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        if (devsOpt.style.transform === 'scaleY(1)') {
            // Fechar o acordeão
            devsOpt.style.transform = 'scaleY(0)';
        } else {
            // Abrir o acordeão
            devsOpt.style.transform = 'scaleY(1)';
        }
    });
});