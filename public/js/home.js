let btnAcessar = document.querySelectorAll('.btnAcessar');
let links = [
    //'../intro/intro.html',
    //'./win/win.html',
    //'./word/word.html',
    './excel/excel.html',
    './powerpoint/powerpoint.html',
    './dep-pessoal/dep-pessoal.html',
    './escrita-fiscal/escrita-fiscal.html'
];

btnAcessar.forEach((curso, index) => {
    curso.addEventListener('click', () => {
        window.location.href = links[index];
    });
});

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

let meusCursosBtn = document.querySelectorAll('.meus-cursos');
meusCursosBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        window.location.href = '/profile';
    });
});

let meusCursosMobile = document.querySelectorAll('.meus-cursos-mobile');
meusCursosMobile.forEach((btn) => {
    btn.addEventListener('click', () => {
        window.location.href = '/profile';
    });
});

let userName = document.querySelectorAll('.userName');
userName.forEach((userName) => {
    userName.innerHTML = `David Silva`;
});

const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');

// Fechar o modal ao clicar no botão
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Mostrar o modal automaticamente ao carregar a página
window.onload = () => {
    modal.style.display = 'flex';
};

let meusCursosBtnMobile = document.querySelectorAll('.meus-cursos-btn');
meusCursosBtnMobile.forEach((btn) => {
    btn.addEventListener('click', () => {
        window.location.href = '/profile';
    });
});

let controleAlunos = document.querySelectorAll('.controle-alunos');
controleAlunos.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        window.location.href = '../controle-alunos/controle-alunos.html';
    });
});

let cursosDisponiveis = document.querySelectorAll('.cursos-disponiveis');
cursosDisponiveis.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        window.location.href = '../devs/devs.html';
    });
});