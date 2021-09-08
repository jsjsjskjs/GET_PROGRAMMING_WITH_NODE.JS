const port = 3000,
http = require('http'),
httpStatus = require('http-status-codes'),
fs = require('fs')

//err 핸들링 재사용 함수
const sendErrorRes = (res) => {
    res.writeHead(httpStatus.NOT_FOUND, {
        "Content-Type": "text/html"
    })
    res.write("<h1>FILE NOT FOUND!!</h1>")
}

http.createServer((req, res) => {
    let url = req.url
    if(url.indexOf('.html') !== -1) {
        res.writeHead(httpStatus.OK, {
            'Content-Type': 'text/html'
        })
        customReadFile(`./views${url}`,res)
    } else if(url.indexOf('.js') !== -1) {
        res.writeHead(httpStatus.OK, {
            'Content-Type': 'text/javascript'
        })
        customReadFile(`./public/js${url}`,res)
    } else if(url.indexOf('.css') !== -1) {
        res.writeHead(httpStatus.OK, {
            'Content-Type': 'text/css'
        })
        customReadFile(`./public/css${url}`,res)
    } else if(url.indexOf('.png') !== -1) {
        res.writeHead(httpStatus.OK, {
            'Content-Type': 'image/png'
        })
        customReadFile(`./public/images${url}`,res)
    } else {
        sendErrorRes(res)
    }

})
.listen(port);
console.log(`The server has started and is listening on port number: ${port}`)

const customReadFile = (filePath, res) => {
    if(fs.existsSync(filePath)) {
        fs.readFile(filePath, (err, data) => {
            if(err) {
                console.log(err)
                sendErrorRes(res)
                return
            }
            res.writeHead(httpStatus.OK, {
                'Content-Type': 'text/html'
            })
            res.write(data)
            res.end()
        })
    } else {
        sendErrorRes(res)
    }
}