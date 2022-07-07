class SuperDao {

    constructor(model) {
        this.Model = model;
    }

    async findAll() {
        return this.Model.findAll();
    }

    async findById(id) {
        return this.Model.findOne({ where: { id } });
    }

    async findOneByWhere(where, attributes = null, order = ['id', 'desc']) {
        if (attributes === null) {
            return this.Model.findOne({
                where,
                order: [order],
            });
        }

        return this.Model.findOne({
            where,
            attributes,
            order: [order],
        });
    }

    async updateWhere(data, where) {
        return this.Model.update(data, { where });
    }

    async updateById(data, id) {
        return this.Model.update(data, { where: { id } });
    }

    async create(data) {
        const newData = new this.Model(data);
        return newData.save();
    }

    async findByWhere(
        where,
        attributes = null,
        order = ['id', 'asc'],
        limit = null,
        offset = null
    ) {
        if (attributes !== null) {
            return this.Model.findAll({
                where,
                order: [order],
                limit,
                offset
            });
        }

        return this.Model.findAll({
            where,
            attributes,
            order: [order],
            limit,
            offset
        });
    }

    async deleteByWhere(where) {
        return this.Model.destroy({ where });
    }

    async bulkCreate(data) {
        return this.Model.bulkCreate(data);
    }

    async getCountByWhere(where) {
        return this.Model.count({ where });
    }

    async incrementCountInFieldByWhere(fieldName, where, incrementValue = 1) {
        const instance = await this.Model.findOne({ where });
        if (!instance) {
            return false;
        }

        let increment = await instance.increment(fieldName, { by: incrementValue });

        return increment;
    }

    async decrementCountInFieldByWhere(fieldName, where, decrementValue = 1) {
        const instance = await this.Model.findOne({ where });
        if (!instance) {
            return false;
        }

        let decrement = await instance.decrement(fieldName, { by: decrementValue });

        return decrement;
    }
}

module.exports = SuperDao;
