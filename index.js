const express = require('express')
const path = require('path')
const fs = require('fs')
const hbs = require('hbs')
const showdown  = require('showdown')

let server
const app = express()
const converter = new showdown.Converter()

app.engine('html', hbs.__express)

const processFileContents = (filePath) => {
    // Read file content and store as a string
    let content = fs.readFileSync(filePath, 'utf8')

    // Convert markdown in string to HTML
    content = converter.makeHtml(content)

    return content
}

const renderPage = (req, res) => {
    const contentPath = path.join(`${__dirname}/content/${req.params.url_path}/index.md`)

    let content
    try {
        content = processFileContents(contentPath)
        res.status(200)
    } catch (error) {
        // Placeholder in case url_path does not lead to a directory
        content = '<h2>Error 404</h2><p>Page not found</p>'
        res.status(404)
    }
    
    res.render(path.join(__dirname + '/template.html'), { content })
}

app.get('/:url_path(*)', renderPage)

server = app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening on port: ` + (process.env.PORT || 3000))
})

const stopServer = () => {
    server.close()
}

module.exports = {
    processFileContents,
    renderPage,
    stopServer
}
