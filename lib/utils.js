var errors = require("./errors");

exports.GetTotalPages = function (totalRecords, pageSize) {
    if (pageSize == 0) return 0;
    var totalPages = Math.floor(totalRecords / pageSize);
    if (totalRecords % pageSize != 0) totalPages += 1;
    return totalPages;
}

exports.FormatSearchString = function (searchString) {
    if (searchString == null) return '%%';
    return '%' + searchString.replace(/ /g, '%') + '%';
}

exports.ConvertParamToArray = function (param, dataType) {
    return param.replace('[', '').replace(']', '').split(',').map(dataType);
}

exports.ResultError = function (message, code) {
    return {
        "success": false,
        "message": message,
        "code": code
    };
}

exports.ResultServiceError = function (message) {
    return {
        "success": false,
        "message": errors.SERVICE_01 + message,
        "code": "SERVICE_01"
    };
}

exports.ResultSuccess = function (data = null) {
    if (data == null)
        return {
            "success": true
        };
    else
        return {
            "success": true,
            "data": data
        };
}

exports.ResponseWithToken = function (req, res, result) {
    if (req.token) {
        result.token = req.token;
    }

    res.json(result);
}