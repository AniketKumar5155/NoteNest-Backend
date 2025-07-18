const validateId = (id) => {
    if(!id || isNaN(id)){
        throw new Error("Invalid Id")
    }
}

export default validateId;