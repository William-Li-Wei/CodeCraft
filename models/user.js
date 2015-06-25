/**
 * Created by william on 23.06.15.
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var userSchema = new Schema({
    email       		: { type: String, required: true },
    password            : { type: String, required: true },
    role                : { type: String, required: true },
    username            : { type: String, required: true },
    status              : { type: String, required: true },
    created             : { type: Date, required: true },
    updated             : { type: Date, required: true }
}, { collection: "users" });

exports.getUserModel = function() {
    return mongoose.model("User", userSchema);
};
