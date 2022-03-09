const express = require('express')
const path = require('path')
const fs = require('fs')
const hbs = require('hbs')
const showdown  = require('showdown')

const app = express()
const converter = new showdown.Converter()

app.engine('html', hbs.__express)

app.get('/:url_path(*)', (req, res) => {
    const contentPath = path.join(`${__dirname}/content/${req.params.url_path}/index.md`)

    let content
    try {
        // Read file content and store as a string
        content = fs.readFileSync(contentPath, 'utf8')

        // Convert markdown in string to HTML
        content = converter.makeHtml(content)
    } catch (error) {
        // Placeholder in case url_path does not have content
        content = '<h2>Error 404</h2><p>Page not found</p>'
        res.status(404)
    }
    
    res.render(path.join(__dirname + '/template.html'), { content })
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening`)
})
