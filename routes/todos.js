const {Router} = require('express')
const router = Router()
const multer = require('multer')
const upload = multer({dest:"uploads"})
const fs = require('fs')

var todos = []

const ExpiryTime = 3600 * 1000

router.get('/', (req, res) => {
	res.render('index', {
		title: 'Todo list',
		isIndex: true,
		todos
	})
})

router.get('/create', (req, res) => {
	res.render('create', {
		title: 'Create todo',
		isCreate: true,
		todos
	})
})

router.post('/create', upload.single('Ufile'), async (req, res) => {
	todos.push({
		title: req.body.title,
		file: req.file.path,
		filename: req.file.originalname,
		completed: false,
		CreateDate: new Date(),
		Date: String(new Date().getHours() + ":" + new Date().getMinutes())
	})
	//if (req.file) {
    //	console.log('Uploaded: ', req.file)
	//}
	update()
	res.redirect('/')
})

router.post('/refresh', async (req, res) => {
	update()
	res.redirect('/')
})

router.post('/download', async (req, res) => {
	res.download(req.body.file)
})

async function update() {
	todos.forEach(function(item, i, arr) {
		if (item.completed){
			if (new Date() - item.CreateDate > ExpiryTime) {
				todos.splice(i,1)
				fs.unlink(item.file, (err) => {
					if (err) console.log(err)
				})
			}

		} else {
			fs.readFile(item.file, "utf8", function(err, data){
                if (err) console.log(err) 
	            fs.writeFile(item.file + '.txt', data.toUpperCase(), function(err){
				    if (err) console.log(err) 
				    else {
				    	fs.unlink(item.file, (err) => {
							if (err) console.log(err)
						})
						item.file = item.file + '.txt'
						item.completed = true
					}
				});
			})
		}
	})
}


module.exports = router