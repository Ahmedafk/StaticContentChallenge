const fs = require('fs')
const path = require('path')
const { processFileContents, renderPage, stopServer } = require('.')

const mockRequest = (url_path) => {
    return {
        params: { url_path },
    }
}

const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.render = jest.fn()
    return res
}

function getFiles(dir) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true })
    const files = dirents.map((dirent) => {
        const res = dir + '/' + dirent.name
        return dirent.isDirectory() ? getFiles(res) : dir
    })
    return files.flat()
}

function generateRandString(length) {
    let result = ''
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charsLength = chars.length
    for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charsLength))
    }
    return result.toLowerCase()
}

describe('All valid URLs should return 200 status', () => {
    let paths = getFiles('./content')

    for (const path of paths) {
        const tempPath = path.replace('./content/', '') // Remove the leading "./content"
        test(tempPath + ' should return 200 status', async () => {
            const req = mockRequest(tempPath)
            const res = mockResponse()
            await renderPage(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
        })
    }
})

describe('All valid URLs should return the correct contents', () => {
    let paths = getFiles('./content')

    for (const filePath of paths) {
        const tempPath = filePath.replace('./content/', '') // Remove the leading "./content"
        test(tempPath + ' should return the correct contents', async () => {
            const contentPath = path.join(`${__dirname}/content/${tempPath}/index.md`)
            const content = processFileContents(contentPath)

            const req = mockRequest(tempPath)
            const res = mockResponse()
            await renderPage(req, res)
            expect(res.render).toHaveBeenCalledWith(path.join(__dirname + '/template.html'), { content })
        })
    }
})

describe('Invalid URLs should return 404 status', () => {
    let randPath = ''

    do  {
        // Generate a random path, if generated path exists, re-generate until an non-existant path is generated
        randPath = generateRandString(Math.floor(Math.random() * 10))
    } while (fs.existsSync('./content/' + randPath))

    test(randPath + ' should return 404 status', async () => {
        const req = mockRequest(randPath)
        const res = mockResponse()
        await renderPage(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
    })
})

afterAll(() => {
    stopServer()
})
