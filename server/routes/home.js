const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    if (typeof request.yar.get('displayError') === 'undefined') {
      return h.view('home')
    } else {
      let errMess = request.yar.get('displayError')
      request.yar.set('displayError', {})
      // return h.view('home', request.yar.get('displayError'))
      return h.view('home', errMess)
    }
  }
}, {
  method: 'POST',
  path: '/',
  handler: async (request, h) => {
    const { location } = request.payload
    return h.redirect(`/location?q=${location}`)
  },
  options: {
    validate: {
      payload: {
        location: joi.string().required()
      },
      failAction: (request, h, err) => {
        return h.view('home', { errorMessage: 'Please enter a valid location' }).takeover()
      }
    }
  }
}]
