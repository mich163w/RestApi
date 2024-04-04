const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User Schema - name, username, email, password, date
let userSchema = new Schema(
    {
        name: { type:String, required: true, min: 2, max: 255 },
        username: { type:String, required: true, min: 6, max: 255 },
        email: { type:String, required: true, min: 6, max: 255 },
        password: { type:String, required: true, min: 8, max: 255 }
    }
);

module.exports = mongoose.model("user", userSchema);