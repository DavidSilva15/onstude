let selectedUserId = null;

function showModalRegister(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModalRegister(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// As funções fetchUsers, openEditModal, saveEdit, openDeleteModal e deleteUser permanecem as mesmas.
document.addEventListener('DOMContentLoaded', fetchUsers);


function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

async function fetchUsers() {
    const response = await fetch('/users');
    const users = await response.json();
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.nome}</td>
                    <td>
                        <button class="btnEditModalRegister" onclick="openEditModal(${user.id}, '${user.nome}')"><i class="fas fa-edit"></i>Editar</button>
                        <button class="btnDeleteModalRegister" onclick="openDeleteModal(${user.id})"><i class="fas fa-trash"></i>Excluir</button>
                    </td>
                `;
        userList.appendChild(row);
    });
}

async function filterUsers() {
    const nameFilterInput = document.getElementById('nameFilter');
    if (!nameFilterInput) {
        console.error('Elemento com ID "nameFilter" não encontrado no DOM.');
        return;
    }

    const nameFilter = nameFilterInput.value.toLowerCase(); // Obtém o valor do filtro
    const response = await fetch('/users');
    const users = await response.json();
    const userList = document.getElementById('user-list');
    if (!userList) {
        console.error('Elemento com ID "user-list" não encontrado no DOM.');
        return;
    }

    userList.innerHTML = ''; // Limpa a lista antes de adicionar novos dados

    if (nameFilter === '') {
        // Exibe todos os usuários se o filtro estiver vazio
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nome}</td>
                <td>
                    <button class="btnEditModalRegister" onclick="openEditModal(${user.id}, '${user.nome}')"><i class="fas fa-edit"></i>Editar</button>
                    <button class="btnDeleteModalRegister" onclick="openDeleteModal(${user.id})"><i class="fas fa-trash"></i>Excluir</button>
                </td>
            `;
            userList.appendChild(row);
        });
    } else {
        // Filtra os usuários pelo nome
        const filteredUsers = users.filter(user => user.nome && user.nome.toLowerCase().includes(nameFilter));

        filteredUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nome}</td>
                <td>
                    <button class="btnEditModalRegister" onclick="openEditModal(${user.id}, '${user.nome}')"><i class="fas fa-edit"></i>Editar</button>
                    <button class="btnDeleteModalRegister" onclick="openDeleteModal(${user.id})"><i class="fas fa-trash"></i>Excluir</button>
                </td>
            `;
            userList.appendChild(row);
        });
    }
}

async function clearFilter() {
    const nameFilterInput = document.getElementById('nameFilter');
    if (nameFilterInput) {
        nameFilterInput.value = ''; // Limpa o campo de filtro
    }

    // Chama filterUsers para exibir todos os usuários
    filterUsers();
}

function openEditModal(id, nome) {
    selectedUserId = id;
    document.getElementById('edit-name').value = nome;
    showModal('editModal');
}

async function saveEdit() {
    const newName = document.getElementById('edit-name').value.trim();
    const newPassword = document.getElementById('edit-password').value.trim();

    // Verificar se os campos estão preenchidos
    if (!newName || !newPassword) {
        console.error("Nome e senha são obrigatórios.");
        return alert("Por favor, preencha o nome e a senha.");
    }

    // Validar se o ID do usuário está definido
    if (!selectedUserId) {
        console.error("ID do usuário não definido.");
        return alert("Usuário não selecionado.");
    }

    try {
        // Fazer a requisição PUT ao backend
        const response = await fetch(`/users/${selectedUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: newName, senha: newPassword }),
        });

        // Tratar resposta do servidor
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro na atualização.");
        }

        // Se a atualização for bem-sucedida, exibir o modal de sucesso
        openEditSuccessModal();

        console.log("Usuário atualizado com sucesso!");
        closeModal('editModal'); // Fechar modal de edição
        fetchUsers(); // Atualizar lista de usuários
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error.message);
        alert(`Erro ao atualizar usuário: ${error.message}`);
    }
}

function openDeleteModal(id) {
    selectedUserId = id;
    showModal('deleteModal');
}

async function deleteUser() {
    await fetch(`/users/${selectedUserId}`, { method: 'DELETE' });
    closeModal('deleteModal');
    fetchUsers();
}

// Função para abrir o modal caso o parâmetro "success" esteja presente na URL
window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success') && urlParams.get('success') === 'true') {
        // Exibe o modal de sucesso
        document.getElementById('successModal').style.display = 'block';
    }
};

// Função para fechar o modal e remover o parâmetro da URL
function closeModalSuccess() {
    // Fecha o modal
    document.getElementById('successModal').style.display = 'none';

    // Remove o parâmetro "success=true" da URL sem recarregar a página
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete('success');
    window.history.pushState({}, '', `${window.location.pathname}?${urlParams}`);
}

// Fecha o modal quando clicar fora dele
window.onclick = function (event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function openEditSuccessModal() {
    const modal = document.getElementById('modal-edit-success');
    modal.style.display = 'block'; // Exibir o modal
}

function closeEditSuccessModal() {
    const modal = document.getElementById('modal-edit-success');
    modal.style.display = 'none'; // Fechar o modal
}
