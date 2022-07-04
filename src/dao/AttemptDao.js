const SuperDao = require('./SuperDao');
const models = require('../models');

const Attempt = models.Attempt;

class AttemptDao extends SuperDao {
    constructor() {
        super(Attempt);
    }

    async findOne(user_uuid) {
        return Attempt.findOne({ where: { user_uuid } });
    }

    async remove(where) {
        return Attempt.destroy({ where });
    }
}

module.exports = AttemptDao; 
