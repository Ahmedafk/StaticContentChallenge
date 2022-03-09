const fs = require('fs')
const express = require('express')
const app = express()
const path = require('path');
const port = 3000

app.engine('html', require('hbs').__express);

app.get('/:url_path(*)', (req, res) => {
    const contentPath = path.join(`${__dirname}/content/${req.params.url_path}/index.md`)
    console.log('contentPath', contentPath)

    let content
    try {
        content = fs.readFileSync(contentPath, 'utf8')
    } catch (error) {
        content = '<h2>Error 404</h2><p>Page not found</p>'
        res.status(404)
    }
    
    res.render(path.join(__dirname + '/template.html'), { content })
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
