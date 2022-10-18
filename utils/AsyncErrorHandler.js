//Handling Errors from Asyc
//We accept any function and return
//The execution of the function. We
//catch errors and pass it to next. 

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}