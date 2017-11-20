export default ({ app, error }) => {
  if (app.store.state.serverInitError) {
    error({ statusCode: 500 })
  }
}
