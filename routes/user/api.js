/**
 * Created by william on 27.06.15.
 */
var User = require('../../models/user').getUserModel();
var Pending = require('../../models/pending').getPendingModel();
var config = require('../../config');
var encryptor = require('../../lib/encryptor');
var mailer = require('../../lib/mailer');


var PURPOSE_PROFILE = 'profile';


/**
 * Get user by id
 * @param req
 * @param res
 * @param context
 */
exports.getUserById = function(req, res, context) {
    console.log(context);
    var id = req.params.id;
    var purpose = req.query.purpose;
    var resultUser;

    // 1. validate the request
    if(!id) {
        return res.status(400).json({ message: 'Bad request.' });
    }

    // 2. find user by id
    User.findById(id).exec().then(function(user) {
        if(user) {
            resultUser = filterUser(user.toObject(), purpose);
            return res.status(200).json(resultUser);
        } else {
            return res.status(404).json({ message: 'User not found.' });
        }
    }, function(err) {
        return res.status(500).json(err);
    });
};

/**
 * Register a new user and send out the activation email
 * @param req
 * @param res
 * @param context
 */
exports.register = function(req, res, context) {
    console.log(context);
    var userData = req.body;
    var url;
    var mailContent;

    // 1. validate the request
    if(userData && userData.email && typeof userData.email === 'string' && userData.password && userData.username) {
        userData.email = userData.email.toLowerCase();
        // 2. check availability of email
        var countPromise = User.count( {email: userData.email} ).exec();
        countPromise.then(function(count) {
            // email availabe
            if(count == 0) {
                // 3. create hashed password
                var hashedPassword = encryptor.createHash(userData.password);
                var hashedEmail = encryptor.createHash(userData.email);
                userData.password = hashedPassword;
                userData.hashCode = new Buffer(hashedEmail).toString('base64');
                // prepare email text;
                url = "http://" + config.server.ip + ":3000/activation/" + userData.hashCode;
                mailContent = "亲爱的用户 " + userData.username + " ：\n\n" +
                    "欢迎加入源艺，开始您与众多IT爱好者分享源码，交流经验和探索发现的旅程。\n" +
                    "请点击下面的链接来激活您的账户：\n" + url + "\n" +
                    "如果您无法通过链接进行跳转，请把这个链接复制粘贴在浏览器的地址栏中\n\n" +
                    "如果您没有在源艺进行注册，可能有人误用了您的邮箱地址，请无视这封邮件。\n\n" +
                    "祝您体验愉快\n" +
                    "源艺\n\n\n" +
                    "Dear " + userData.username + " :\n\n" +
                    "Welcome to CodeCraft and start sharing your coding experience with other programming funs.\n" +
                    "To verify your email address and activate your account, please click on the link below:\n" + url + "\n" +
                    "If clicking on the link doesn't work, try copying and pasting it into your browser.\n\n" +
                    "If you didn't register at CodeCraft, your email address might has been used by others as wrong input, please ignore this email.\n\n" +
                    "Kind regards\n" +
                    "The CodeCraft Team";
                return Pending.update({ email: userData.email }, { username: userData.username, password: hashedPassword, hashCode:  userData.hashCode }).exec();
            }
            // email in use, return message to the client
            else if(count == 1){
                return res.status(200).json({ message: 'Email in use.' });
            }
        }, function(err) {
            return res.status(500).json(err);
        }).then(function(result) {
            if(result && result.nModified > 0) {
                sendEmail(res, userData.email, "来自源艺 codecraft.cn 的激活邀请", mailContent);
            }
            if(result && result.nModified == 0){
                userData.created = new Date();
                return Pending.create(userData).exec();
            }
        }, function(err) {
            return res.status(500).json(err);
        }).then(function(pending) {
            if(pending) {
                sendEmail(res, userData.email, "来自源艺 codecraft.cn 的激活邀请", mailContent);
            }
        }, function(err) {
            return res.status(500).json(err);
        });
    }
    // invalid request
    else {
        return res.status(400).json({ message: 'Bad request.' });
    }
}


/**
 * Supportive functions
 */
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

function sendEmail(res, address, subject, mailContent) {
    var smtpTransport = mailer.smtpTransport;

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "源艺 codecraft.cn <codecraft.cn@gmail.com>",      // sender address
        to: address,                                            // list of receivers
        subject: subject,                                       // Subject line
        text: mailContent                                              // plaintext body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(err, response){
        // if you don't want to use this transport object anymore, uncomment following line
        smtpTransport.close(); // shut down the connection pool, no more messages

        if(err){
            return res.status(500).json(err);
        }else{
            return res.status(200).json({ message: 'Email sent.' });
        }
    });
}