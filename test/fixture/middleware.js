module.exports = {
  path: '/api',
  handler(req, res) {
    res.end('url:' + req.url)
  }
}
