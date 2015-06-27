/**
 * Created by william on 27.06.15.
 */
var User = require('../../models/user').getUserModel();


var PURPOSE_PROFILE = 'profile';


/**
 * Get user by id
 * @param req
 * @param res
 * @param context
 * @returns {*|{encode, decode, is, equals, pattern}}
 */
exports.getUserById = function(req, res, context) {
    console.log(context);
    var id = req.params.id;
    var purpose = req.query.purpose;
    var resultUser;

    // 1. validate request
    if(!id) {
        return res.status(400).json('Bad request');
    }

    // 2. find user by id
    User.findById(id).then(function(user) {
        if(user) {
            resultUser = filterUser(user.toObject(), purpose);
            return res.status(200).json(resultUser);
        } else {
            return res.status(404).json('User not found');
        }
    }, function(err) {
        return res.status(500).json(err);
    });
};

function filterUser(user, purpose) {
    var filteredUser = {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status
    };
    switch(purpose) {
        case PURPOSE_PROFILE:
            filteredUser.createdAt = user.createdAt;
            filteredUser.createdBy = user.createdBy;
            filteredUser.updatedAt = user.updatedAt;
            filteredUser.updatedBy = user.updatedBy;
            break;
    }
    return filteredUser;
}