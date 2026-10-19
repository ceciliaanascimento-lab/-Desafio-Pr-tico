// Banco de dados em memória (armazenado no localStorage para persistência local)
let equipments = JSON.parse(localStorage.getItem('equipments')) || [
    { id: 1, name: 'Notebook Dell Vostro', category: 'Notebook', serial: 'SN-100201', status: 'Disponível' },
    { id: 2, name: 'Monitor LG 29 IPS', category: 'Monitor', serial: 'SN-300405', status: 'Emprestado' }
];

// Elementos do DOM
const form = document.getElementById('equipment-form');
const equipIdInput = document.getElementById('equip-id');
const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const serialInput = document.getElementById('serial');
const statusInput = document.getElementById('status');
const formTitle = document.getElementById('form-title');
const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const equipmentList = document.getElementById('equipment-list');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderList();
});

// Salvar / Atualizar Equipamento
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = equipIdInput.value;
    const name = nameInput.value.trim();
    const category = categoryInput.value;
    const serial = serialInput.value.trim();
    const status = statusInput.value;

    if (id) {
        // Atualizar
        const index = equipments.findIndex(e => e.id == id);
        if (index !== -1) {
            equipments[index] = { id: Number(id), name, category, serial, status };
        }
    } else {
        // Criar Novo
        const newEquip = {
            id: Date.now(),
            name,
            category,
            serial,
            status
        };
        equipments.push(newEquip);
    }

    saveToStorage();
    resetForm();
    renderList();
});

// Renderizar Tabela com Filtros
function renderList() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedStatus = filterStatus.value;

    equipmentList.innerHTML = '';

    const filtered = equipments.filter(equip => {
        const matchesSearch = equip.name.toLowerCase().includes(searchTerm) || 
                              equip.serial.toLowerCase().includes(searchTerm);
        const matchesStatus = selectedStatus === 'Todos' || equip.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        equipmentList.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum equipamento encontrado.</td></tr>';
        return;
    }

    filtered.forEach(equip => {
        const tr = document.createElement('tr');
        
        let statusClass = 'badge-disponivel';
        if (equip.status === 'Emprestado') statusClass = 'badge-emprestado';
        if (equip.status === 'Manutenção') statusClass = 'badge-manutencao';

        tr.innerHTML = `
            <td>${equip.id}</td>
            <td>${equip.name}</td>
            <td>${equip.category}</td>
            <td>${equip.serial}</td>
            <td><span class="badge ${statusClass}">${equip.status}</span></td>
            <td>
                <button class="btn btn-edit" onclick="editEquip(${equip.id})">Editar</button>
                <button class="btn btn-delete" onclick="deleteEquip(${equip.id})">Excluir</button>
            </td>
        `;
        equipmentList.appendChild(tr);
    });
}

// Editar Equipamento
window.editEquip = function(id) {
    const equip = equipments.find(e => e.id === id);
    if (!equip) return;

    equipIdInput.value = equip.id;
    nameInput.value = equip.name;
    categoryInput.value = equip.category;
    serialInput.value = equip.serial;
    statusInput.value = equip.status;

    formTitle.innerText = 'Editar Equipamento';
    btnSave.innerText = 'Atualizar Equipamento';
    btnCancel.classList.remove('hidden');
};

// Excluir Equipamento
window.deleteEquip = function(id) {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
        equipments = equipments.filter(e => e.id !== id);
        saveToStorage();
        renderList();
    }
};

// Resetar Formulário
btnCancel.addEventListener('click', resetForm);

function resetForm() {
    equipIdInput.value = '';
    form.reset();
    formTitle.innerText = 'Cadastrar Novo Equipamento';
    btnSave.innerText = 'Salvar Equipamento';
    btnCancel.classList.add('hidden');
}

// Filtros em tempo real
searchInput.addEventListener('input', renderList);
filterStatus.addEventListener('change', renderList);

// Persistência
function saveToStorage() {
    localStorage.setItem('equipments', JSON.stringify(equipments));
}