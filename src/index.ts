import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import 'dotenv/config'
import router from './router'

const PORT = Number(process.env.PORT || 3000)

const app = express()

app.use(
  cors({
    credentials: true,
  })
)

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`)
})

app.use('/', router())
