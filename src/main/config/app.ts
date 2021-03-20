import express from 'express'
import setupMiddlewares from './middlewares'
import setupApolloServer from './apollo-server'
import setupRoutes from './routes'

const app = express()
setupApolloServer(app)
setupMiddlewares(app)
setupRoutes(app)
export default app
