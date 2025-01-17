// Função para alternar entre play e pause
function togglePlayPause() {
    const videoPlayer = document.getElementById('videoPlayer');
    const controlBtn = document.getElementById('controlBtn');
    const icon = controlBtn.querySelector('i');

    if (videoPlayer.paused) {
        videoPlayer.play();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause'); // Troca para ícone de pausa
    } else {
        videoPlayer.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play'); // Troca para ícone de play
    }
}

// Função para garantir que o tempo esteja sempre no formato 2 dígitos
function padTime(time) {
    return time < 10 ? '0' + time : time;
}

// Atualiza a barra de progresso e exibe o tempo
const videoPlayer = document.getElementById('videoPlayer');
const progressBar = document.getElementById('progressBar');
const timeDisplay = document.getElementById('timeDisplay');
const progressContainer = document.getElementById('progressContainer');

videoPlayer.addEventListener('timeupdate', function() {
    const currentTime = videoPlayer.currentTime;
    const duration = videoPlayer.duration;
    const progress = (currentTime / duration) * 100;

    progressBar.style.width = progress + '%'; // Atualiza a largura da barra

    // Exibe o tempo atual e total em minutos:segundos
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);

    const formattedCurrentTime = padTime(currentMinutes) + ':' + padTime(currentSeconds);
    const formattedDuration = padTime(durationMinutes) + ':' + padTime(durationSeconds);

    timeDisplay.textContent = formattedCurrentTime + ' / ' + formattedDuration;
});

// Função para permitir que a barra de progresso seja manipulada
progressContainer.addEventListener('click', function(event) {
    if (isControlEnabled) {
        const progressWidth = progressContainer.clientWidth;
        const clickPosition = event.offsetX;
        const newTime = (clickPosition / progressWidth) * videoPlayer.duration;
        videoPlayer.currentTime = newTime;
    }
});

// Variável para habilitar/desabilitar a interação com a barra de progresso
let isControlEnabled = false;

// Função para ativar/desativar a manipulação da barra de progresso
function enableProgressControl() {
    isControlEnabled = !isControlEnabled;
    if (isControlEnabled) {
        progressContainer.style.cursor = 'pointer'; // Torna a barra manipulável
    } else {
        progressContainer.style.cursor = 'none'; // Desabilita a manipulação
    }
}

// Detecta a combinação de teclas CTRL + SHIFT + F12
window.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'F12') {
        enableProgressControl();
    }
});

// Função para ocultar o toast após 5 segundos
setTimeout(function() {
    const toast = document.getElementById('toast');
    toast.style.opacity = '0'; // Torna o toast invisível
    setTimeout(function() {
        toast.style.display = 'none'; // Remove o toast da tela
    }, 500); // Aguarda 0.5s para a animação de opacidade terminar
}, 5000); // Exibe o toast por 5 segundos