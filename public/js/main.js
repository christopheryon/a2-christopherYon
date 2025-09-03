// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
    await createPasswordTable()
  
  const input = document.querySelector( "#yourname" ),
        json = { yourname: input.value },
        body = JSON.stringify( json )

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  })

  const text = await response.text()

  console.log( "text:", text )
}

const getPasswords = async () => {
    const response = await fetch("/passwords", {
        method:"GET"
    })
    return response.text()
}

const createPasswordTable = async () => {
    const table = document.createElement("table")
    const head = table.createTHead()
    const headRow = head.insertRow()
    const headers = ["Username", "Password", "Strength"];
    headers.forEach((thisHeader) => {headRow.appendChild(document.createElement("th")).innerHTML = thisHeader})
    const body = table.createTBody();
    const passwordString = await getPasswords();
    const passwordArray = JSON.parse(passwordString)
    passwordArray.forEach(arrayElt => {
        const bodyRow = body.insertRow()
        bodyRow.insertCell().innerHTML=arrayElt.username
        bodyRow.insertCell().innerHTML=arrayElt.password
        bodyRow.insertCell().innerHTML=arrayElt.strength
    })

    const container = document.getElementById("passwordTable")
    container.innerHTML=""
    container.appendChild(table)
}

window.onload = async function() {
   const button = document.querySelector("button");
  button.onclick = submit;
  await createPasswordTable()
}