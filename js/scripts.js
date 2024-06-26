// Funções para mostrar as seções específicas
function showItemFormSection() {
    document.getElementById('itemFormSection').style.display = 'block';
    document.getElementById('requisicaoFormSection').style.display = 'none';
    document.getElementById('requisicoesListSection').style.display = 'none';
    document.getElementById('itensListSection').style.display = 'none';
}

function showRequisicaoFormSection() {
    document.getElementById('itemFormSection').style.display = 'none';
    document.getElementById('requisicaoFormSection').style.display = 'block';
    document.getElementById('requisicoesListSection').style.display = 'none';
    document.getElementById('itensListSection').style.display = 'none';
    loadItemsForDropdown();
}

function showRequisicoesListSection() {
    document.getElementById('itemFormSection').style.display = 'none';
    document.getElementById('requisicaoFormSection').style.display = 'none';
    document.getElementById('requisicoesListSection').style.display = 'block';
    document.getElementById('itensListSection').style.display = 'none';
    loadRequisicoes(); // Carregar requisições quando a seção for mostrada
}

function showItensListSection() {
    document.getElementById('itemFormSection').style.display = 'none';
    document.getElementById('requisicaoFormSection').style.display = 'none';
    document.getElementById('requisicoesListSection').style.display = 'none';
    document.getElementById('itensListSection').style.display = 'block';
    loadItensList(); // Carregar itens quando a seção for mostrada
}

// Configurações iniciais ao carregar a página
window.onload = function() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('itemFormSection').style.display = 'none';
    document.getElementById('requisicaoFormSection').style.display = 'none';
    document.getElementById('requisicoesListSection').style.display = 'none';
    document.getElementById('itensListSection').style.display = 'none';
    document.querySelector('.navbar').style.display = 'none'; // Esconde a barra de navegação inicialmente
};

// Carregar itens para dropdown no formulário de requisição
function loadItemsForDropdown() {
    fetch('http://localhost:8080/api/items')
        .then(response => response.json())
        .then(items => {
            const itemSelect = document.getElementById('requisicaoItem');
            itemSelect.innerHTML = '';
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.nome} - ${item.descricao}`;
                itemSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar itens:', error));
}

// Carregar lista de requisições
function loadRequisicoes() {
    fetch('http://localhost:8080/api/requisicoes')
        .then(response => response.json())
        .then(data => {
            const requisicoesList = document.getElementById('requisicoesList');
            requisicoesList.innerHTML = '';
            data.forEach(requisicao => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `<strong>Descrição:</strong> ${requisicao.descricao}, <strong>Item:</strong> ${requisicao.item.nome}, <strong>Status:</strong> ${requisicao.status}`;

                const editarButton = document.createElement('button');
                editarButton.textContent = 'Editar';
                editarButton.className = 'btn btn-primary mx-2';
                editarButton.addEventListener('click', () => editRequisicao(requisicao.id));

                const atenderButton = document.createElement('button');
                atenderButton.textContent = 'Atender';
                atenderButton.className = 'btn btn-info mx-2';
                atenderButton.addEventListener('click', () => atenderRequisicao(requisicao.id));

                const fecharButton = document.createElement('button');
                fecharButton.textContent = 'Fechar';
                fecharButton.className = 'btn btn-warning mx-2';
                fecharButton.addEventListener('click', () => fecharRequisicao(requisicao.id));

                const deletarButton = document.createElement('button');
                deletarButton.textContent = 'Deletar';
                deletarButton.className = 'btn btn-danger mx-2';
                deletarButton.addEventListener('click', () => deleteRequisicao(requisicao.id));

                listItem.appendChild(editarButton);
                listItem.appendChild(atenderButton);
                listItem.appendChild(fecharButton);
                listItem.appendChild(deletarButton);

                requisicoesList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Erro ao carregar as requisições:', error));
}

// Função para adicionar ou atualizar um item
document.getElementById('itemForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const itemId = document.getElementById('itemId').value;
    const name = document.getElementById('itemName').value;
    const descricao = document.getElementById('itemDescricao').value;

    const itemData = { nome: name, descricao: descricao };
    const url = itemId ? `http://localhost:8080/api/items/${itemId}` : 'http://localhost:8080/api/items';
    const method = itemId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
    })
        .then(response => response.json())
        .then(() => {
            alert('Item salvo com sucesso!');
            clearItemForm();
            loadItensList();
        })
        .catch(error => console.error('Erro ao salvar o item:', error));
});

// Função para adicionar uma nova requisição
document.getElementById('requisicaoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const descricao = document.getElementById('requisicaoDescricao').value;
    const itemId = document.getElementById('requisicaoItem').value;

    const requisicaoData = { descricao: descricao, status: "Aberto", item: { id: itemId } };
    const url = 'http://localhost:8080/api/requisicoes';

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requisicaoData)
    })
        .then(response => response.json())
        .then(() => {
            alert('Requisição salva com sucesso!');
            clearRequisicaoForm();
            loadRequisicoes(); // Recarregar lista após ação
        })
        .catch(error => console.error('Erro ao salvar a requisição:', error));
});

// Função para limpar os campos do formulário de requisição
function clearRequisicaoForm() {
    document.getElementById('requisicaoDescricao').value = '';
    document.getElementById('requisicaoItem').selectedIndex = 0; // Define a primeira opção como selecionada
}

// Função para limpar formulário de itens
function clearItemForm() {
    document.getElementById('itemId').value = '';
    document.getElementById('itemName').value = '';
    document.getElementById('itemDescricao').value = '';
}

// Função para deletar um item
function deleteItem(id) {
    if (confirm('Tem certeza que deseja deletar este item?')) {
        fetch(`http://localhost:8080/api/items/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    alert('Item deletado com sucesso!');
                    loadItensList(); // Recarrega a lista de itens após a exclusão
                } else {
                    throw new Error('Falha ao deletar o item');
                }
            })
            .catch(error => console.error('Erro ao deletar item:', error));
    }
}

// Função para deletar uma requisição
function deleteRequisicao(id) {
    if (confirm('Tem certeza que deseja deletar esta requisição?')) {
        fetch(`http://localhost:8080/api/requisicoes/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    alert('Requisição deletada com sucesso!');
                    loadRequisicoes();
                }
            })
            .catch(error => console.error('Erro ao deletar requisição:', error));
    }
}

// Função para editar uma requisição
function editRequisicao(requisicaoId) {
    fetch(`http://localhost:8080/api/requisicoes/${requisicaoId}`)
        .then(response => response.json())
        .then(requisicao => {
            document.getElementById('updateRequisicaoId').value = requisicao.id;
            document.getElementById('updateRequisicaoDescricao').value = requisicao.descricao;

            // Abrir modal
            new bootstrap.Modal(document.getElementById('updateRequisicaoModal')).show();
        })
        .catch(error => console.error('Erro ao carregar a requisição para edição:', error));
}

// Função para fechar uma requisição
function fecharRequisicao(requisicaoId) {
    const url = `http://localhost:8080/api/requisicoes/${requisicaoId}/fechado`;

    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(() => {
            loadRequisicoes(); // Recarrega a lista de requisições após a ação
        })
        .catch(error => console.error('Erro ao fechar a requisição:', error));
}

// Função para atender uma requisição
function atenderRequisicao(requisicaoId) {
    const url = `http://localhost:8080/api/requisicoes/${requisicaoId}/atendimento`;

    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(() => {
            loadRequisicoes(); // Recarrega a lista de requisições após a ação
        })
        .catch(error => console.error('Erro ao atender a requisição:', error));
}

// Função para atualizar uma requisição
function updateRequisicao() {
    const id = document.getElementById('updateRequisicaoId').value;
    const descricao = document.getElementById('updateRequisicaoDescricao').value;

    const requisicaoData = { descricao: descricao };

    fetch(`http://localhost:8080/api/requisicoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requisicaoData)
    })
        .then(() => {
            alert('Requisição atualizada com sucesso!');
            loadRequisicoes();
            bootstrap.Modal.getInstance(document.getElementById('updateRequisicaoModal')).hide();
        })
        .catch(error => console.error('Erro ao atualizar a requisição:', error));
}

// Função para carregar e mostrar a lista de todos os itens
function loadItensList() {
    fetch('http://localhost:8080/api/items')
        .then(response => response.json())
        .then(items => {
            const itensList = document.getElementById('itensList');
            itensList.innerHTML = ''; // Limpar lista antes de adicionar novos itens

            items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `<strong>Nome:</strong> ${item.nome}, <strong>Descrição:</strong> ${item.descricao}`;

                const editarButton = document.createElement('button');
                editarButton.textContent = 'Editar';
                editarButton.className = 'btn btn-primary mx-2';
                editarButton.onclick = () => editItem(item.id);

                const deletarButton = document.createElement('button');
                deletarButton.textContent = 'Deletar';
                deletarButton.className = 'btn btn-danger mx-2';
                deletarButton.onclick = () => deleteItem(item.id);

                listItem.appendChild(editarButton);
                listItem.appendChild(deletarButton);

                itensList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Erro ao carregar itens:', error));
}

// Função para editar um item
function editItem(itemId) {
    fetch(`http://localhost:8080/api/items/${itemId}`)
        .then(response => response.json())
        .then(item => {
            document.getElementById('updateItemId').value = item.id;
            document.getElementById('updateItemName').value = item.nome;
            document.getElementById('updateItemDescricao').value = item.descricao;

            new bootstrap.Modal(document.getElementById('updateItemModal')).show();
        })
        .catch(error => console.error('Erro ao carregar item para edição:', error));
}

// Função para atualizar um item
function updateItem() {
    const id = document.getElementById('updateItemId').value;
    const nome = document.getElementById('updateItemName').value;
    const descricao = document.getElementById('updateItemDescricao').value;

    const itemData = {
        nome: nome,
        descricao: descricao
    };

    fetch(`http://localhost:8080/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na atualização do item');
            }
            return response.json();
        })
        .then(() => {
            alert('Item atualizado com sucesso!');
            loadItensList();
            bootstrap.Modal.getInstance(document.getElementById('updateItemModal')).hide();
        })
        .catch(error => {
            console.error('Erro ao atualizar o item:', error);
            alert('Erro ao atualizar o item.');
        });
}

// Função de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            conta: username,
            senha: password
        }),
        credentials: 'include' // Garante que os cookies sejam enviados
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // Ler a resposta como texto
            } else {
                throw new Error('Falha na autenticação');
            }
        })
        .then(message => {
            alert(message); // Mostrar mensagem de sucesso
            document.getElementById('loginSection').style.display = 'none'; // Esconder a seção de login
            document.getElementById('itensListSection').style.display = 'block'; // Mostrar a seção de itens
            document.querySelector('.navbar').style.display = 'flex'; // Mostrar a barra de navegação
        })
        .catch(error => {
            console.error('Erro no login:', error);
            alert('Erro no login. Por favor, verifique seu usuário e senha.');
        });
});

// Função de logout
async function logout() {
    const response = await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include' // Garante que os cookies sejam enviados
    });

    if (response.ok) {
        alert('Logout realizado com sucesso.');
        document.getElementById('loginSection').style.display = 'block'; // Mostra a seção de login
        document.getElementById('itensListSection').style.display = 'none'; // Esconde a seção de itens
        document.querySelector('.navbar').style.display = 'none'; // Esconde a barra de navegação
    } else {
        const message = await response.text();
        console.error('Erro no logout:', message);
        alert('Erro no logout.');
    }
}
