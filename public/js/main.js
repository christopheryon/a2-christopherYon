// FRONT-END (CLIENT) JAVASCRIPT HERE

const wrap = (elements, wrapper) => {
    if (elements.length) {
        const firstElement = elements[0]
        firstElement.parentNode.insertBefore(wrapper, firstElement);
        for (const element of elements) {
            if (element !== wrapper) {
                wrapper.appendChild(element);
            }
        }
    } else {
        elements.parentNode.insertBefore(wrapper, elements)
        wrapper.appendChild(elements)
    }
}

const unwrap = (wrapper) => {
    const parent = wrapper.parentNode;
    while (wrapper.firstChild) {
        parent.insertBefore(wrapper.firstChild, wrapper);
    }
    parent.removeChild(wrapper);
}

const savePassword = async (event, username, password, id = -1) => {
    event.preventDefault()
    const json = {username: username, password: password, id: id},
        body = JSON.stringify(json)
    if (username.length === 0) {
        alert("You must have a username!")
        return -1;
    }
    if (password.length === 0) {
        alert("You must have a password!")
        return -1;
    }
    const response = await fetch("/save", {
        method: "POST",
        body
    })
    await createPasswordTable()
}

const createPassword = async (event) => {
    event.preventDefault()
    const newPasswordButton = document.getElementById("newPassword")
    const table = /** @type {HTMLTableElement} */ document.getElementById("passwordTable")
    const rows = table.rows
    for (let i = 0; i < rows.length; i++) {
        const buttons = rows[i].getElementsByTagName("button")
        for (const button of buttons) {
            button.setAttribute("style", "opacity: 0;")
            button.setAttribute("disabled", "")
        }
    }
    const newPasswordRow = table.tBodies.item(0).insertRow()
    newPasswordRow.id = "newPasswordRow"
    const usernameInput = document.createElement("input")
    usernameInput.id = "usernameInput"
    usernameInput.type = "text"
    const passwordInput = document.createElement("input")
    passwordInput.id = "passwordInput"
    passwordInput.type = "text"
    newPasswordRow.insertCell().appendChild(usernameInput)
    newPasswordRow.insertCell().appendChild(passwordInput)
    newPasswordRow.insertCell().append("Make it strong!")
    const newPasswordForm = document.createElement("form")
    wrap(table, newPasswordForm)
    const saveButton = document.createElement("button")
    const saveImage = document.createElement("img")
    saveImage.src = "assets/save.svg"
    //saveButton.appendChild(saveImage)
    saveButton.append("Save")
    saveButton.id = "saveButton"
    saveButton.className = "edit-save-button"
    const functionCell = newPasswordRow.insertCell()
    functionCell.appendChild(saveButton)
    newPasswordButton.setAttribute("style", "display: none")
    saveButton.onclick = async (event) => {
        await savePassword(event, usernameInput.value, passwordInput.value)
        unwrap(newPasswordForm)
    };
    const cancelButton = document.createElement("button")
    cancelButton.onclick = async () => {
        unwrap(newPasswordForm)
        await createPasswordTable()
        newPasswordButton.removeAttribute("style")
    }
    cancelButton.innerHTML = "Cancel"
    functionCell.appendChild(cancelButton)

}

const deletePassword = async (id) => {
    const json = {id: id},
        body = JSON.stringify(json)
    const response = await fetch("/delete", {
        method: "POST",
        body
    })
    await createPasswordTable()
}

const editPassword = async (event, id, rowIndex) => {
    const table = /** @type {HTMLTableElement} */ document.getElementById("passwordTable")
    const rows = table.tBodies.item(0).rows
    const currentRow = rows[rowIndex]
    for (let i = 0; i < rows.length; i++) {
        if (i !== rowIndex) {
            const buttons = rows[i].getElementsByTagName("button")
            for (const button of buttons) {
                button.setAttribute("style", "display: none;")
            }
        }
    }
    const usernameCell = currentRow.children[0].firstChild
    const passwordCell = currentRow.children[1].firstChild
    const editButton = currentRow.children[3].getElementsByClassName("edit-save-button")[0]
    const deleteButton = currentRow.children[3].getElementsByClassName("deleteButton")[0]
    const newPasswordButton = document.getElementById("newPassword")
    newPasswordButton.setAttribute("style", "display:none")
    const usernameField = document.createElement("input")
    usernameField.type = "text"
    usernameField.value = usernameCell.textContent
    const passwordField = document.createElement("input")
    passwordField.type = "text"
    passwordField.value = passwordCell.textContent
    usernameCell.replaceWith(usernameField)
    passwordCell.replaceWith(passwordField)
    const cancelButton = document.createElement("button")
    cancelButton.innerHTML = "Cancel"
    cancelButton.onclick = () => {
        usernameField.replaceWith(usernameCell)
        passwordField.replaceWith(passwordCell)
        cancelButton.replaceWith(deleteButton)
        saveButton.replaceWith(editButton)
        newPasswordButton.removeAttribute("style")
        for (let i = 0; i < rows.length; i++) {
            if (i !== rowIndex) {
                const buttons = rows[i].getElementsByTagName("button")
                for (const button of buttons) {
                    button.removeAttribute("style")
                }
            }
        }
        unwrap(editPasswordForm)
    }
    const saveButton = document.createElement("button")
    saveButton.innerHTML = "Save"
    saveButton.className = "edit-save-button"
    saveButton.onclick = async (event) => {
        if (await savePassword(event, usernameField.value, passwordField.value, id) !== -1) {
            newPasswordButton.removeAttribute("style")
        }
        unwrap(editPasswordForm)
    }
    const editPasswordForm = document.createElement("form")
    wrap(table, editPasswordForm)
    editButton.replaceWith(saveButton)
    deleteButton.replaceWith(cancelButton)
}

const getPasswords = async () => {
    const response = await fetch("/passwords", {
        method: "GET"
    })
    return response.text()
}

const createPasswordTable = async () => {
    const table = document.createElement("table")
    table.id = "passwordTable"
    const head = table.createTHead()
    const headRow = head.insertRow()
    const headers = ["Username", "Password", "Strength"];
    headers.forEach((thisHeader) => {
        headRow.appendChild(document.createElement("th")).innerHTML = thisHeader
    })
    const body = table.createTBody();
    const passwordString = await getPasswords();
    const passwordArray = JSON.parse(passwordString)
    passwordArray.forEach((arrayElt, index) => {
        const bodyRow = body.insertRow()
        bodyRow.insertCell().innerHTML = arrayElt.username
        bodyRow.insertCell().innerHTML = arrayElt.password
        bodyRow.insertCell().innerHTML = arrayElt.strength
        const editButton = document.createElement("button")
        editButton.innerHTML = "Edit"
        editButton.onclick = (event) => editPassword(event, arrayElt.id, index)
        editButton.className = "edit-save-button"
        const functionCell = bodyRow.insertCell()
        functionCell.appendChild(editButton)
        const deleteButton = document.createElement("button")
        deleteButton.onclick = () => deletePassword(arrayElt.id)
        deleteButton.innerHTML = "Delete"
        deleteButton.className = "deleteButton"
        functionCell.appendChild(deleteButton)
    })

    const container = document.getElementById("passwordTableContainer")
    container.innerHTML = ""
    container.appendChild(table)
}

window.onload = async function () {
    const newPasswordButton = document.getElementById("newPassword");
    newPasswordButton.onclick = createPassword
    await createPasswordTable()
}