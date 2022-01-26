'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_Automovel')) ?? []
const setLocalStorage = (dbAutomovel) => localStorage.setItem("db_Automovel", JSON.stringify(dbAutomovel))

// CRUD - create read update delete
const deleteAutomovel = (index) => {
    const dbAutomovel = readAutomovel()
    dbAutomovel.splice(index, 1)
    setLocalStorage(dbAutomovel)
}

const updateAutomovel = (index, Automovel) => {
    const dbAutomovel = readAutomovel()
    dbAutomovel[index] = Automovel
    setLocalStorage(dbAutomovel)
}

const readAutomovel = () => getLocalStorage()

const createAutomovel = (Automovel) => {
    const dbAutomovel = getLocalStorage()
    dbAutomovel.push (Automovel)
    setLocalStorage(dbAutomovel)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('marcaValue').dataset.index = 'new'
}

const saveAutomovel = () => {
    debugger
    if (isValidFields()) {
        const Automovel = {
            marcaValue: document.getElementById('marcaValue').value,
            carValue: document.getElementById('carValue').value,
            tipoValue: document.getElementById('tipoValue').value,
            statusValue: document.getElementById('statusValue').value
        }
        const index = document.getElementById('marcaValue').dataset.index
        if (index == 'new') {
            createAutomovel(Automovel)
            updateTable()
            closeModal()
        } else {
            updateAutomovel(index, Automovel)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (Automovel, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${Automovel.marcaValue}</td>
        <td>${Automovel.carValue}</td>
        <td>${Automovel.tipoValue}</td>
        <td>${Automovel.statusValue}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableAutomovel>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableAutomovel>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbAutomovel = readAutomovel()
    clearTable()
    dbAutomovel.forEach(createRow)
}

const fillFields = (Automovel) => {
    document.getElementById('marcaValue').value = Automovel.marcaValue
    document.getElementById('carValue').value = Automovel.carValue
    document.getElementById('tipoValue').value = Automovel.tipoValue
    document.getElementById('statusValue').value = Automovel.statusValue
    document.getElementById('marcaValue').dataset.index = Automovel.index
}

const editAutomovel = (index) => {
    const Automovel = readAutomovel()[index]
    Automovel.index = index
    fillFields(Automovel)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editAutomovel(index)
        } else {
            const Automovel = readAutomovel()[index]
            const response = confirm(`Tem certeza que deseja excluir o automóvel ${Automovel.marcaValue} ${Automovel.carValue}?`)
            if (response) {
                deleteAutomovel(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarAutomovel')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveAutomovel)

document.querySelector('#tableAutomovel>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)