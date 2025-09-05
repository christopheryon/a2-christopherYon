// FRONT-END (CLIENT) JAVASCRIPT HERE

const savePassword = async (username, password, id = -1) => {
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

    const saveButton = document.createElement("button")
    const saveImage = document.createElement("img")
    saveImage.src = "assets/save.svg"
    saveButton.appendChild(saveImage)
    saveButton.append("Save")
    saveButton.id = "saveButton"
    newPasswordButton.replaceWith(saveButton)
    saveButton.onclick = async () => {
        if (await savePassword(usernameInput.value, passwordInput.value) !== -1){
            saveButton.replaceWith(newPasswordButton)
        }
    };
    const cancelButton = document.createElement("button")
    cancelButton.onclick = async () => {
        await createPasswordTable()
        saveButton.replaceWith(newPasswordButton)
    }
    cancelButton.innerHTML = "Cancel"
    newPasswordRow.insertCell().appendChild(cancelButton)

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
    const editButton = currentRow.children[3].getElementsByClassName("editButton")[0]
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
    }
    const saveButton = document.createElement("button")
    saveButton.innerHTML = "Save"
    saveButton.onclick = async () => {
        await savePassword(usernameField.value, passwordField.value, id)
        if (usernameField.value.length === 0) {
            alert("You must have a username!")
            return;
        }
        if (passwordField.value.length === 0) {
            alert("You must have a password!")
            return;
        }
        const json = {id: id, username: usernameField.value, password: passwordField.value},
            body = JSON.stringify(json)
        const response = await fetch("/save", {
            method: "POST",
            body
        })
        newPasswordButton.removeAttribute("style")
        await createPasswordTable()

    }
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
        editButton.className = "editButton"
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