let avaliacao = document.querySelectorAll('.avaliacao');
avaliacao.forEach((avaliacao)=>{
    avaliacao.innerHTML = 'Avaliação';
});

/*let userName = document.querySelectorAll('.userName');
userName.forEach((userName) => {
    userName.innerHTML = `Aluno: Dev David`;
});*/

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