// Configuração de variáveis globais
let isRecording = false;
let recordedSequence = [];
let volumeLevel = 0.5;
let playbackInterval = 250; // Intervalo padrão entre sons

// Ajustar o volume global
const volumeControl = document.querySelector('#volume');
volumeControl.addEventListener('input', (event) => {
    volumeLevel = event.target.value;
    document.querySelectorAll('audio').forEach(audio => {
        audio.volume = volumeLevel;
    });
});

// Ajustar o intervalo de reprodução
const intervalControl = document.createElement('input');
intervalControl.type = 'number';
intervalControl.min = 50;
intervalControl.max = 1000;
intervalControl.step = 50;
intervalControl.value = playbackInterval;
intervalControl.style.marginTop = '10px';
intervalControl.addEventListener('input', (event) => {
    playbackInterval = parseInt(event.target.value);
});

document.querySelector('.controls').appendChild(intervalControl);
const intervalLabel = document.createElement('label');
intervalLabel.textContent = ' Intervalo (ms):';
intervalControl.parentNode.insertBefore(intervalLabel, intervalControl);

// Evento de pressionar teclas
document.body.addEventListener('keydown', (event) => {
    playSound(event.code.toLowerCase());
    if (isRecording) {
        recordedSequence.push(event.code.toLowerCase().replace('key', ''));
    }
});

// Função para tocar som
function playSound(sound) {
    const audioElement = document.querySelector(`#s_${sound}`);
    const keyElement = document.querySelector(`div[data-key="${sound}"]`);

    if (audioElement) {
        if (!audioElement.paused) {
            audioElement.pause();
        }
        audioElement.currentTime = 0;
        audioElement.play();
    }

    if (keyElement) {
        keyElement.classList.add('active');
        setTimeout(() => keyElement.classList.remove('active'), 300);
    }
}

// Composição manual
const playButton = document.querySelector('.composer button');
playButton.addEventListener('click', () => {
    addClickEffect(playButton);
    const input = document.querySelector('#composer').value;
    if (input.trim()) {
        const notes = input.trim().toLowerCase().split('');
        playComposition(notes);
    }
});

// Função para tocar composições
function playComposition(notes) {
    let delay = 0;
    notes.forEach(note => {
        setTimeout(() => {
            playSound(`key${note}`);
        }, delay);
        delay += playbackInterval; // Intervalo configurável entre os sons
    });
}

// Botão de gravação
const recordButton = document.querySelector('#record');
recordButton.addEventListener('click', () => {
    isRecording = !isRecording;
    recordedSequence = isRecording ? [] : recordedSequence;
    recordButton.textContent = isRecording ? 'Gravando...' : 'Gravar';

    if (!isRecording && recordedSequence.length > 0) {
        setTimeout(() => playComposition(recordedSequence), 500);
    }
});

function addClickEffect(button) {
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 300);
}