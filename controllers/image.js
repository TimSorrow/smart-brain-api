const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
    apiKey: '019fc412a3f74dd2a8cde6b0abda3b52' //enter your api code
   });

   const handleApiCall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with api'))
   }

const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}