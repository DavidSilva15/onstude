let meusCursos = document.querySelectorAll('.meus-cursos');
meusCursos.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        window.location.href = '../home.html';
    });
});