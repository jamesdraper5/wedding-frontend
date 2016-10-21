const express = require('express')
const morgan = require('morgan')
const app = express()

app.set('port', process.env.PORT || 3000);
app.use(morgan('dev')); // log every request to the console
app.disable('x-powered-by'); // reduce chances of Express-specific attacks

// static file serve
app.use(express.static('public'))
app.use(express.static('dist'))
// not found in static files, so default to index.html
app.use((req, res) => res.sendFile(`${__dirname}/index.html`))

app.listen(app.get('port'), () => {
	console.log('Listening on port', app.get('port'));
})
