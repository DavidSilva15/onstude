// Função que exibe o modal ao carregar a página
window.onload = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex'; // Exibe o modal

    // Inicializa o slide no modal
    currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });

    // Inicializa a barra de progresso com o primeiro slide
    updateProgressBar();
};

// Selecionar o botão de fechar
const closeModal = document.getElementById('closeModal');

// Fechar o modal ao clicar no botão
closeModal.addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; // Esconde o modal
});

// Função para controlar o slide
let currentSlide = 0;

// Função para mudar o slide
function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    
    // Atualiza a barra de progresso
    updateProgressBar();
}

// Função para atualizar a barra de progresso
function updateProgressBar() {
    const barraProgresso = document.querySelector('.barra-progresso');
    const totalSlides = document.querySelectorAll('.slide').length;
    const progress = ((currentSlide + 1) / totalSlides) * 100; // Porcentagem
    const textElement = document.querySelector('.barra-progresso .text'); // Seleciona o texto dentro da barra
    
    // Atualiza a largura da barra de progresso
    barraProgresso.style.background = `linear-gradient(to right, #0055d2 ${progress}%, transparent 0%)`;
    
    // Atualiza o texto do slide atual/total
    textElement.textContent = `${currentSlide + 1} / ${totalSlides}`;
    
    // Altera a cor do texto dependendo do progresso
    if (progress > 50) {
        textElement.style.color = 'white'; // Texto branco
    } else {
        textElement.style.color = 'black'; // Texto preto
    }
}

// Adicionar evento ao botão Info para exibir o modal
const infoBtn = document.getElementById('info');
infoBtn.addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex'; // Exibe o modal

    // Inicializa o slide no modal
    currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });

    // Inicializa a barra de progresso
    updateProgressBar();
});