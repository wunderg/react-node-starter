export default (app, express, staticPath) => {
  const appRouter = new express.Router();

  app.use('/', appRouter);

  appRouter.get('*', (req, res) => {
    res.sendFile('index.html', {
      root: staticPath
    });
  });
}
