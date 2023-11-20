
requestTime= function(req, res, next){
    //req => req.header, params, body 
    req.requestTime = new Date().toISOString();
    next()}

    module.exports = requestTime;