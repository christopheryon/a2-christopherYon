// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function (event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()
    await createPasswordTable()

    const input = document.querySelector("#yourname"),
        json = {yourname: input.value},
        body = JSON.stringify(json)

    const response = await fetch("/submit", {
        method: "POST",
        body
    })

    const text = await response.text()

    console.log("text:", text)
}

const savePassword = async (event) => {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()


    const username = document.getElementById("usernameInput"),
        password = document.getElementById("passwordInput"),
        json = {username: username.value, password: password.value},
        body = JSON.stringify(json)

    const response = await fetch("/save", {
        method: "POST",
        body
    })

    const text = await response.text()
    await createPasswordTable()
    const newPasswordButton = document.createElement("button")
    newPasswordButton.innerHTML = "New Password"
    newPasswordButton.id = "newPassword"
    newPasswordButton.onclick = createPassword
    const saveButton = document.getElementById("saveButton")
    saveButton.replaceWith(newPasswordButton)
}

const createPassword = async (event) => {
    event.preventDefault()
    const newPasswordButton = document.getElementById("newPassword")
    const table = /** @type {HTMLTableElement} */ document.getElementById("passwordTable")
    const row = table.tBodies.item(0).insertRow()
    row.id = "newPasswordRow"
    const usernameInput = document.createElement("input")
    usernameInput.id = "usernameInput"
    usernameInput.type = "text"
    const passwordInput = document.createElement("input")
    passwordInput.id = "passwordInput"
    passwordInput.type = "text"
    row.insertCell().appendChild(usernameInput)
    row.insertCell().appendChild(passwordInput)
    const saveButton = document.createElement("button")
    saveButton.innerHTML = "Save"
    saveButton.id = "saveButton"
    newPasswordButton.replaceWith(saveButton)
    saveButton.onclick = savePassword;


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
    passwordArray.forEach(arrayElt => {
        const bodyRow = body.insertRow()
        bodyRow.insertCell().innerHTML = arrayElt.username
        bodyRow.insertCell().innerHTML = arrayElt.password
        bodyRow.insertCell().innerHTML = arrayElt.strength
    })

    const container = document.getElementById("passwordTableContainer")
    container.innerHTML = ""
    container.appendChild(table)
}

window.onload = async function () {
    const button = document.getElementById("oldSubmit");
    button.onclick = submit;
    const newPasswordButton = document.getElementById("newPassword");
    newPasswordButton.onclick = createPassword
    await createPasswordTable()
}