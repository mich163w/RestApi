const router = require('express').Router();
const wine = require('../models/wine');

//CRUD operations


// /api/wine/
//Create wine - POST
router.post('/', /* verifyToken, */ (req, res) => {
    
    data = req.body; //req.body.name, req.body.year, req.body.country, req.body.price, req.body.inStock

    wine.insertMany(data) 
    .then(data => {res.send(data); })
    .catch(err => {res.status(500).send( { message: err.message }); })
});

// /api/wine/
//Read all wine - GET
// (hvis denne virker, poster den aoutomatisk en ekstra i localhost:XXXX/api/wine og indsættes i databsen, 
// hver gang man ændrer name eller price i postman)
router.get('/',(req, res) => {
    wine.find()
    .then(data => {res.send(data); })
    .catch(err => {res.status(500).send( { message: err.message }); })
});

// /api/wine/instock
// Read all wine in stock - GET
router.get("/instock", (req, res) => {
    wine.find({ inStock: true })
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( { message: err.message }); })
}) //500 Internal Server Error

// Read specific wine - GET
// /api/wine/:id --> (http://localhost:5501/api/wine/65c493601c35f4468e4df3a5) så finder den det enkelte produkt i id'et fra databasen
router.get('/:id',(req, res) => {
    wine.findById(req.params.id)
    .then(data => {res.send(data); })
    .catch(err => {res.status(500).send( { message: err.message }); })
});

//Update specific wine - PUT
//Her kan et id fra et andet produkt feks sættes ind i local:5501/api/wine/65c493601c35f4468e4df3a5 og dermed ændre det
router.put('/:id',(req, res) => {
    const id = req.params.id; //id fra URL

    wine.findByIdAndUpdate(id, req.body)
    .then(data => { 
        if (!data) {
            res.status(404).send( { message: "Ehh, cannot update the wine with id=" + id + ". Maybe wine was not found."});
        }
        else {
            res.send( { message: "Wuhuu, the Wine was succesfully updated."});
        }
    })
    .catch(err => { res.status(500).send( { message: "Error updating the wine with id=" + id }); })
})


//Delete - DELETE
router.delete('/:id', /* verifyToken, */ (req, res) => {
    const id = req.params.id;

    wine.findByIdAndDelete(id)
    .then(data => { 
        if (!data) {
            res.status(404).send( { message: "Cannot delete the wine with id=" + id + ". Maybe wine was not found."});
        }
        else {
            res.send( { message: "The Wine was succesfully deleted."});
        }
    })
    .catch(err => { res.status(500).send( { message: "There was an error deleting the wine with id=" + id }); })
})


module.exports = router;