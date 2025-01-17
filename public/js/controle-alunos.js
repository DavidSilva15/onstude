// Altere para a chave de API que você forneceu
const API_KEY = '$2a$10$ELWga9uQrj1gh8a/G/CAse7kprC8vwWI6q0GP4wiQv//IHplmreQO';  // Sua chave de API

const alunosTable = document.getElementById('alunosTable');

// Modal de sucesso
const modalSuccessOverlay = document.getElementById('modal-success-overlay');
function showSuccessModal() {
    modalSuccessOverlay.style.display = 'flex';
}
function closeSuccessModal() {
    modalSuccessOverlay.style.display = 'none';
}

// Modal de confirmação
const modalConfirmationOverlay = document.getElementById('modal-confirmation-overlay');
let deleteIndex = null;

function showConfirmationModal(index) {
    deleteIndex = index;
    modalConfirmationOverlay.style.display = 'flex';
}

function closeConfirmationModal() {
    modalConfirmationOverlay.style.display = 'none';
    deleteIndex = null;
}

function confirmDelete() {
    if (deleteIndex !== null) {
        deleteAluno(deleteIndex);
        closeConfirmationModal();
    }
}

// Função para carregar alunos
async function loadAlunos() {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/6777f3a8ad19ca34f8e5145f', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,  // Chave de API aqui
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar alunos do JSONbin.io');
        }

        const data = await response.json();
        const alunos = data.record.alunos || [];

        alunosTable.innerHTML = '';
        alunos.forEach((aluno, index) => {
            const row = document.createElement('tr');
            row.className = aluno.status === 'Em Andamento' ? 'status-em-andamento' : 'status-concluido';
            row.innerHTML = `
                <td class="tableNome">${aluno.nome}</td>
                <td class="tableHorario">${aluno.horario}</td>
                <td>${aluno.diaSemana}</td>
                <td>${aluno.assunto}</td>
                <td>${aluno.recebeuModulo ? 'Sim' : 'Não'}</td>
                <td>${aluno.status}</td>
                <td class="tableAlunosBtnsContainer">
                    <button class="btnEditar" onclick="editAluno(${index})"><i class="fas fa-edit"></i>Editar</button>
                    <button class="btnExcluir" onclick="showConfirmationModal(${index})"><i class="fas fa-trash"></i>Excluir</button>
                </td>
            `;
            alunosTable.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar alunos', error);
    }
}

// Função para limpar inputs
function limpaInputs() {
    const nome = document.getElementById('nomeCompleto');
    const horario = document.getElementById('horarioAula');
    const diaSemana = document.getElementById('diaSemana');
    const assunto = document.getElementById('assunto');
    const status = document.getElementById('status');

    nome.value = '';
    horario.value = '';
    diaSemana.value = '';
    assunto.value = '';
    status.value = '';
}

// Variável para armazenar o índice do aluno a ser editado
let editIndex = null;

// Função para adicionar ou editar aluno
async function addAluno() {
    const nome = document.getElementById('nomeCompleto').value;
    const horario = document.getElementById('horarioAula').value;
    const diaSemana = document.getElementById('diaSemana').value;
    const assunto = document.getElementById('assunto').value;
    const recebeuModulo = document.getElementById('recebeuModulo').checked;
    const status = document.getElementById('status').value;

    if (!nome || !horario || !diaSemana || !assunto || !status) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/6777f3a8ad19ca34f8e5145f', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,  // Chave de API aqui
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar alunos do JSONbin.io');
        }

        const data = await response.json();
        const alunos = data.record.alunos || [];

        if (editIndex !== null) { // Se estiver editando um aluno existente
            alunos[editIndex] = { nome, horario, diaSemana, assunto, recebeuModulo, status }; // Substitui o aluno no índice correspondente
            editIndex = null; // Limpa o índice de edição após a alteração
        } else { // Se estiver adicionando um novo aluno
            alunos.push({ nome, horario, diaSemana, assunto, recebeuModulo, status });
        }

        // Salva os alunos atualizados no JSONbin.io
        const saveResponse = await fetch('https://api.jsonbin.io/v3/b/6777f3a8ad19ca34f8e5145f', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,  // Chave de API aqui
            },
            body: JSON.stringify({
                alunos: alunos
            }),
        });

        if (!saveResponse.ok) {
            throw new Error('Erro ao salvar alunos no JSONbin.io');
        }

        closeModal();
        limpaInputs();
        loadAlunos();
        showSuccessModal(); // Exibir o modal de sucesso

    } catch (error) {
        console.error('Erro ao adicionar aluno', error);
    }
}

// Função para editar aluno
async function editAluno(index) {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/6777f3a8ad19ca34f8e5145f', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,  // Chave de API aqui
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar alunos do JSONbin.io');
        }

        const data = await response.json();
        const alunos = data.record.alunos || [];

        const aluno = alunos[index];

        // Preenche os campos do modal com os dados do aluno
        document.getElementById('nomeCompleto').value = aluno.nome;
        document.getElementById('horarioAula').value = aluno.horario;
        document.getElementById('diaSemana').value = aluno.diaSemana;
        document.getElementById('assunto').value = aluno.assunto;
        document.getElementById('recebeuModulo').checked = aluno.recebeuModulo;
        document.getElementById('status').value = aluno.status;

        // Armazena o índice do aluno a ser editado
        editIndex = index;
        openModal(); // Abre o modal para edição
    } catch (error) {
        console.error('Erro ao editar aluno', error);
    }
}

// Função para excluir aluno
async function deleteAluno(index) {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/6777f3a8ad19ca34f8e5145f', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,  // Chave de API aqui
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar alunos do JSONbin.io');
        }

        const data = await response.json();
        const alunos = data.record.alunos || [];

        alunos.splice(index, 1); // Remove o aluno do array

        // Salva os alunos atualizados no JSONbin.io
        const saveResponse = await fetch('https://api.jsonbin.io/v3/b/6777f3a8ad19ca34f8e5145f', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,  // Chave de API aqui
            },
            body: JSON.stringify({
                alunos: alunos
            }),
        });

        if (!saveResponse.ok) {
            throw new Error('Erro ao salvar alunos no JSONbin.io');
        }

        loadAlunos(); // Recarrega a lista de alunos
    } catch (error) {
        console.error('Erro ao excluir aluno', error);
    }
}

// Função para ordenar alunos
async function sortAlunos(criterion) {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/6777f3a8ad19ca34f8e5145f', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,  // Chave de API aqui
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar alunos do JSONbin.io');
        }

        const data = await response.json();
        const alunos = data.record.alunos || [];

        alunos.sort((a, b) => {
            if (a[criterion] < b[criterion]) return -1;
            if (a[criterion] > b[criterion]) return 1;
            return 0;
        });

        // Salva os alunos atualizados no JSONbin.io
        const saveResponse = await fetch('https://api.jsonbin.io/v3/b/6777f3a8ad19ca34f8e5145f', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,  // Chave de API aqui
            },
            body: JSON.stringify({
                alunos: alunos
            }),
        });

        if (!saveResponse.ok) {
            throw new Error('Erro ao salvar alunos no JSONbin.io');
        }

        loadAlunos();
    } catch (error) {
        console.error('Erro ao ordenar alunos', error);
    }
}

// Função para manipular alteração no critério de ordenação
function handleSortChange() {
    const criterion = document.getElementById('sortSelect').value;
    if (criterion) {
        sortAlunos(criterion);
    }
}

// Função para carregar e filtrar alunos
async function fetchAndFilterAlunos(filter = "") {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/6777f3a8ad19ca34f8e5145f', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY, // Chave de API aqui
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar alunos do JSONbin.io');
        }

        const data = await response.json();
        let alunos = data.record.alunos || [];

        // Filtra os alunos pelo nome, se um filtro for aplicado
        if (filter) {
            const lowerCaseFilter = filter.toLowerCase();
            alunos = alunos.filter(aluno => aluno.nome.toLowerCase().includes(lowerCaseFilter));
        }

        // Exibe os alunos filtrados no console (ou atualiza o DOM)
        console.log(alunos);

        // Atualize o DOM para exibir os alunos
        const alunosTable = document.getElementById('alunosTable');
        if (!alunosTable) {
            console.error("Elemento com o ID 'alunosTable' não encontrado no DOM.");
            return;
        }

        alunosTable.innerHTML = alunos.map((aluno, index) => `
            <tr>
                <td class="tableNome">${aluno.nome}</td>
                <td class="tableHorario">${aluno.horario}</td>
                <td>${aluno.diaSemana}</td>
                <td>${aluno.assunto}</td>
                <td>${aluno.recebeuModulo ? 'Sim' : 'Não'}</td>
                <td>${aluno.status}</td>
                <td class="tableAlunosBtnsContainer">
                    <button class="btnEditar" onclick="editAluno(${index})"><i class="fas fa-edit"></i>Editar</button>
                    <button class="btnExcluir" onclick="showConfirmationModal(${index})"><i class="fas fa-trash"></i>Excluir</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar alunos', error);
    }
}

// Função para buscar alunos por nome
function handleSearch() {
    const searchInput = document.getElementById('searchInput').value;
    fetchAndFilterAlunos(searchInput);
}

// Adicione o event listener ao botão de busca
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', handleSearch);

// Chamada inicial para carregar todos os alunos
fetchAndFilterAlunos();


// Função para abrir modal
const modalOverlay = document.querySelector('.modal-overlay');
function openModal() {
    modalOverlay.style.display = 'flex'; // Exibir o modal e overlay
}

// Função para fechar modal
function closeModal() {
    modalOverlay.style.display = 'none'; // Ocultar o modal e overlay
}

// Carregar alunos na inicialização
window.onload = loadAlunos;

// Manipulação do acordeão no dev-opts
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

// Navegar para a página de cursos
let meusCursosBtn = document.querySelectorAll('.meusCursos');
meusCursosBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        window.location.href = './home.html';
    });
});

let userName = document.querySelectorAll('.userName');
userName.forEach((userName) => {
    userName.innerHTML = `Aluno: Dev David`;
});


// -------------------------------função para gerar o relatório em XLSX----------------------------------------------
async function generateExcelReport() {
    try {
        // Recupera os dados dos alunos do JSONbin.io
        const response = await fetch('https://api.jsonbin.io/v3/b/6777f3a8ad19ca34f8e5145f', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,  // Use sua chave de API aqui
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar os dados dos alunos do JSONbin.io');
        }

        const data = await response.json();
        const alunos = data.record.alunos || [];

        if (alunos.length === 0) {
            alert('Nenhum dado disponível para gerar o relatório.');
            return;
        }

        // Obtém a data atual formatada
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Formato: YYYY-MM-DD

        // Cria um elemento <table> virtual para gerar o arquivo Excel
        const table = document.createElement('table');
        const headerRow = table.insertRow();

        // Cabeçalhos da tabela
        const headers = ['Nome', 'Horário', 'Dia da Semana', 'Assunto', 'Recebeu Módulo', 'Status'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;

            // Aplica estilos ao cabeçalho
            th.style.backgroundColor = '#252e3d';
            th.style.color = '#fff';
            th.style.textAlign = 'center';
            th.style.padding = '5px';
            headerRow.appendChild(th);
        });

        // Adiciona os dados dos alunos
        alunos.forEach(aluno => {
            const row = table.insertRow();
            row.insertCell().textContent = aluno.nome;
            row.insertCell().textContent = aluno.horario;
            row.insertCell().textContent = aluno.diaSemana;
            row.insertCell().textContent = aluno.assunto;
            row.insertCell().textContent = aluno.recebeuModulo ? 'Sim' : 'Não';
            row.insertCell().textContent = aluno.status;
        });

        // Define estilos para ajustar a largura das colunas
        const columnWidths = [undefined, 15, 15, 15, 15, 15]; // Primeira coluna ajustável, demais fixas
        const colgroup = document.createElement('colgroup');
        columnWidths.forEach((width, index) => {
            const col = document.createElement('col');
            if (width) col.style.width = `${width}px`;
            colgroup.appendChild(col);
        });
        table.prepend(colgroup);

        // Converte a tabela em um arquivo Excel
        const workbook = XLSX.utils.table_to_book(table);
        const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

        // Baixa o arquivo com a data incluída no nome
        const blob = new Blob([s2ab(excelFile)], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Relatório_Alunos_${formattedDate}.xlsx`;
        link.click();

        // Exibe a mensagem de sucesso
        showSuccessMessage();

    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
    }
}

// Função auxiliar para converter string para ArrayBuffer
function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}

// Função para exibir a mensagem de sucesso
function showSuccessMessage() {
    const messageElement = document.getElementById('mensagem-sucesso');
    if (messageElement) {
        messageElement.style.display = 'flex';

        // Após 3 segundos, a mensagem desaparece
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
}



// ------------------------------------------função para gerar o relatório em PDF------------------------------------------------------
async function generatePDFReport() {
    const { jsPDF } = window.jspdf; // Importa jsPDF do objeto global

    try {
        // Recupera os dados dos alunos do JSONbin.io
        const response = await fetch('https://api.jsonbin.io/v3/b/6777f3a8ad19ca34f8e5145f', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,  // Use sua chave de API aqui
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar os dados dos alunos do JSONbin.io');
        }

        const data = await response.json();
        const alunos = data.record.alunos || [];

        if (alunos.length === 0) {
            alert('Nenhum dado disponível para gerar o relatório.');
            return;
        }

        // Instancia um novo documento PDF
        const doc = new jsPDF();

        // Define o título do relatório e configurações básicas
        const title = "Relatório de Alunos";
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(16);
        doc.text(title, 105, 10, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Data: ${currentDate}`, 10, 20);

        // Configura os cabeçalhos da tabela
        const headers = [['Nome', 'Horário', 'Dia da Semana', 'Assunto', 'Recebeu Módulo', 'Status']];

        // Adiciona os dados dos alunos
        const dataTable = alunos.map(aluno => [
            aluno.nome,
            aluno.horario,
            aluno.diaSemana,
            aluno.assunto,
            aluno.recebeuModulo ? 'Sim' : 'Não',
            aluno.status
        ]);

        // Usa a tabela do jsPDF autoTable para gerar o layout da tabela
        doc.autoTable({
            head: headers,
            body: dataTable,
            startY: 30, // Posição inicial no PDF
            styles: {
                headStyles: { fillColor: [37, 46, 61], textColor: [255, 255, 255] }, // Cor de fundo e fonte do cabeçalho
                bodyStyles: { halign: 'center' }, // Centraliza o texto nas células
                columnStyles: { 0: { halign: 'left' } } // Alinha a primeira coluna à esquerda
            },
        });

        // Salva o PDF
        doc.save(`Relatório_Alunos_${currentDate.replace(/\//g, '-')}.pdf`);

        // Exibe a mensagem de sucesso após a geração do relatório
        showSuccessMessage();

    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
    }
}

// Função para exibir a mensagem de sucesso
function showSuccessMessage() {
    const mensagemSucesso = document.getElementById('mensagem-sucesso');
    mensagemSucesso.style.display = 'flex';  // Torna a mensagem visível

    // Faz a mensagem sumir após 3 segundos
    setTimeout(() => {
        mensagemSucesso.style.display = 'none';  // Oculta a mensagem após 3 segundos
    }, 3000); // 3000 milissegundos = 3 segundos
}