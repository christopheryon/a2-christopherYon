const http = require("http"),
    fs = require("fs"),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you"re testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require("mime"),
    dir = "public/",
    port = 3000

const calculateStrength = (password) => {
    let possibleCharacters = 0;
    const lowercase = /[a-z]/
    const uppercase = /[A-Z]/
    const nums = /\d/
    const specials = /[!"#$%&'()*+,\-.\/\\:;<=>?@\[\]^_`{|}~ ]/
    if (lowercase.test(password)) {
        possibleCharacters += 26
    }
    if (uppercase.test(password)) {
        possibleCharacters += 26
    }
    if (nums.test(password)) {
        possibleCharacters += 10
    }
    if (specials.test(password)) {
        possibleCharacters += 33
    }
    const entropy = Math.log2(Math.pow(possibleCharacters, password.length))
    if (entropy < 25) {
        return "Terrible"
    } else if (entropy < 50) {
        return "Weak"
    } else if (entropy < 75) {
        return "Decent"
    } else {
        return "Great!"
    }
}

const passwordStore = [
    {"id": 1, "username": "mycoolusername", "password": "myverystrongpassword", "strength": ""},
    {"id": 2, "username": "godofdestruction", "password": "password!", "strength": ""},
    {"id": 3, "username": "isthistaken", "password": "password1", "strength": ""},
]

let idCounter = 4;

for (const passwordStoreElement of passwordStore) {
    passwordStoreElement.strength=calculateStrength(passwordStoreElement.password)
}


const server = http.createServer(function (request, response) {
    if (request.method === "GET") {
        handleGet(request, response)
    } else if (request.method === "POST") {
        handlePost(request, response)
    }
})


const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1)

    if (request.url === "/") {
        sendFile(response, "public/index.html")
    } else {
        sendFile(response, filename)
    }
}

const handlePost = function (request, response) {
    let dataString = ""

    request.on("data", function (data) {
        dataString += data
    })

    request.on("end", function () {
        console.log(JSON.parse(dataString))

        // ... do something with the data here!!!

        response.writeHead(200, "OK", {"Content-Type": "text/plain"})
        response.end("test")
    })
}

const sendFile = function (response, filename) {
    const type = mime.getType(filename)

    fs.readFile(filename, function (err, content) {

        // if the error = null, then we"ve loaded the file successfully
        if (err === null) {

            // status code: https://httpstatuses.com
            response.writeHeader(200, {"Content-Type": type})
            response.end(content)

        } else {

            // file not found, error code 404
            response.writeHeader(404)
            response.end("404 Error: File Not Found")

        }
    })
}

server.listen(process.env.PORT || port)
