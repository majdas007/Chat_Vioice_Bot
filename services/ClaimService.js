var claim = require('../models/ClaimSchema');
var user = require('../models/UserSchema');
const responseHandler = require('../services/Responsehandler');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: "a4bb3e5b",
    apiSecret: "gc9AzS7WFYRMGBoX"
});
const from = '21624390420';
const to = '21624390420';
const text = 'Your claim has been successful sent to admin';
var data = [];
var dataTreated = [];
var dataNotTreated = [];
var dataAllTreated = [];
exports.sendClaim = (req, res, next) => {
    const newclaim = {
        Title: req.body.Title,
        Content: req.body.Content,
        Type: req.body.Type,
        Degre: req.body.Degre,
        Date: req.body.Date,
        Treated: req.body.Treated,
        State: req.body.State,
        User: req.user._id
    }
    claim.create(newclaim).then(
        claim => {
            // nexmo.message.sendSms(from, to, text, (err, responseData) => {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         if (responseData.messages[0]['status'] === "0") {
            //             console.log("Message sent successfully.");
            //         } else {
            //             console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            //         }
            //     }
            // })
            responseHandler.resHandler(true, claim, "sucessful claim sended", res, 200)
        }
    ).catch(error => responseHandler.resHandler(false, null, `error : ${error}`, res, 500))
}

exports.treatClaim = (req, res, next) => {
    claim.findById(req.params.idClaim).then(
        claim => {
            if (claim.Treated === false) {
                claim.Treated = true;
                claim.State = 'Treated';
            }
            else {
                claim.Treated = false;
                claim.State = 'Not Treated';
            }
            claim.User = req.user._id
            claim.save()
            responseHandler.resHandler(true, claim, "sucessful claim updated", res, 200)
        }
    ).catch(error => responseHandler.resHandler(false, null, `error : ${error}`, res, 500))
}

exports.followUpClaim = (req, res, next) => {
    claim.find({User: req.user._id}).then(
        claims => {

            claims.forEach(function (claim) {
                data.push({Title: claim.Title, Content: claim.Content, Type: claim.Type, State: claim.State});
            });
            responseHandler.resHandler(true, data, "claims detected", res, 200)
        }
    ).catch(error => responseHandler.resHandler(false, null, `error : ${error}`, res, 500))
}

exports.findAllClaimsByTreated = (req, res, next) => {
    claim.find().then(
        claims => {
            claims.forEach(function (claim) {
                if (claim.State === 'Treated') {
                    dataTreated.push({
                        Title: claim.Title,
                        Content: claim.Content,
                        Type: claim.Type,
                        State: claim.State,
                        Degre: claim.Degre
                    });
                }
                else {
                    dataNotTreated.push({
                        Title: claim.Title,
                        Content: claim.Content,
                        Type: claim.Type,
                        State: claim.State,
                        Degre: claim.Degre
                    });
                }
            });
            dataAllTreated = dataTreated.concat(dataNotTreated);

            responseHandler.resHandler(true, dataAllTreated, "claims detected", res, 200)

        }
    ).catch(error => responseHandler.resHandler(false, null, `error : ${error}`, res, 500))
}
