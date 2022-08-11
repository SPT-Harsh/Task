const port = 8000;
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')

var author = []
var book = []

app.get('/', function(req, res) {
    file_data = `Application Started \n`
    fs.writeFileSync('./log_report.txt', file_data)
    res.write('ok')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))
// AUTHOR
app.get('/author', function(req, res) {
    file_data = 'getting data of author \n'
    fs.appendFileSync('./log_report.txt', file_data)

    if(author.length === 0) {
        res.status(404).send('No author found')
        return res.end()
    }
    var auth_name = 'Author Data: ' + '\n'
    for(var aut_count = 0; aut_count < author.length; ++aut_count){
        auth_name = auth_name + author[aut_count] + '\n'
    }

    res.write(auth_name)
    return res.end()
})
app.get('/author/:id', function(req, res) {
    file_data = `getting data of author ${req.query.id} \n`
    fs.appendFileSync('./log_report.txt', file_data)

    auth_body = req.query.id
    book_data = ''
    author.forEach(auth_id => {
        if(auth_id === auth_body){
            for(var count = 0; count < book.length; count++){
                if(book[count] === auth_id){
                    book_data = book[count+1] + '\n'
                }
            }
        }
    })
    if(book_data === ''){
        res.status(404).json({ error: 'No Books Published by this Author' })
        res.end()
    }else{
        res.write(book_data)
        res.end()
    }
})
app.post('/author', function(req, res){
    
    auth_body = req.body
    var auth_id = Math.floor( Math.random()*10000000000 )
    file_data = `adding data of author ${auth_id} \n`
    fs.appendFileSync('./log_report.txt', file_data)
    // Adding very first author
    if(author.length === 0){
        var my_str = `{${Number(auth_id)} : ${String(auth_body.name)}}`
        
        auth_obj = JSON.stringify(my_str)
        auth_obj = JSON.parse(auth_obj)
        auth_obj =  my_str
        author.push(auth_obj)
        res.write('author added successfully')
        return res.end();
    }
    auth_present = false
    author.forEach(element => {
        if (element.id === auth_id || element.name === auth_body.name) {
            auth_present = true
        }        
    })
    if (!auth_present) {
        var my_str = `{${Number(auth_id)} : ${String(auth_body.name)}}`
        auth_obj =  JSON.stringify(my_str)
        console.log('transfering data');
        auth_obj =  my_str
        console.log('pushing data');
        author.push(auth_obj)
        res.write('author added successfully')
        return res.end();
    }else{
        res.write('author already present')
        return res.end();
    }
})

app.delete('/author/:id', (req, res) => {
    file_data = `Deleting data of author ${req.query.id} \n`
    fs.appendFileSync('./log_report.txt', file_data)
    var auth_id = req.params.id
    console.log(auth_id)
    author = author.filter(author => author.auth_id != auth_id)
    console.log(author)
    console.log(author.filter(author => author != auth_id))
    res.end()
})







// BOOK
app.get('/book', (req, res) => {
    file_data = `getting data of books \n`
    fs.appendFileSync('./log_report.txt', file_data)
    var book_data = ''
    // console.log(`book length : ${book.length}`)
    for(count = 0; count < book.length; count++){
        if(count+1 % 3 == 0){
            book_data += book[count] + '\n'
        }
        else{
            book_data += book[count] + ' '
        }
    }
    // console.log(`book data ${book_data}`)
    if(book_data == ''){
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.write("404 Not Found")
    }else{
        res.write(book_data)
    }
    
    res.end()
})
app.get('/book/:id', (req, res) => {
    var book_data = ''
    var id = req.params.id
    
    file_data = `getting data of book ${id} \n`
    fs.appendFileSync('./log_report.txt', file_data)

    for(count = 0; count < book.length; count++){
        if(count+3 % 3 == 0){
            if(id == book[count]){
                book_data +=  'Name : ' + book[count-1] + '\n'
                book_data += 'author: ' + book[count-2] + '\n'
            }
        }
    }
    if(book_data == ''){
        res.status(404)
        res.end('404 Book not found')
    }else{
        res.write(book_data)
        res.end()
    }
})
app.post('/book', (req, res) => {
    book_body = req.body
    var book_id = Math.floor( Math.random()*100000000000000 )
    auth_id = book_body.auth_id
    // var my_str = `{${Number(book_body.auth_id)}}`
    // console.log(`book body ${book_body}`)
    
    file_data = `Adding data of book \n`
    fs.appendFileSync('./log_report.txt', file_data)

    // auth_id = 17564093746
    
    var auth_present = false
    author.forEach(element => {
        if (element.id === auth_id) {
            auth_present = true
        }        
    })
    if (!auth_present) {
        res.write(`author with ID ${auth_id} is not found`)
        return res.end();
    }else{
        if(book.length == 0){
            var book_data = [Number(auth_id), String(book_body.name), book_id]
            book.push(book_data)
            res.write('book added successfully')
            return res.end();
        }
        for(count = 0; count < book.length; count++){
            if(count+1 % 3 == 0){
                if (book[count] = book_id) {
                    res.write(`book with id ${book_id} is already present`)
                    return res.end()
                }
            }
        }
        var book_data = [Number(auth_id), String(book_body.name), book_id]
        book.push(book_data)
        res.write('book added successfully')
        return res.end();
    }
})
app.delete('/book/:id', (req, res) => {
    
    var book_id = req.params.id
    file_data = `deleting data of book ${book_id} \n`
    fs.appendFileSync('./log_report.txt', file_data)
    book = book.filter(book =>book.book_id != book_id)
    console.log(book)
    console.log(book.filter(book => book.book_id != book_id))
    res.end()
})





app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
