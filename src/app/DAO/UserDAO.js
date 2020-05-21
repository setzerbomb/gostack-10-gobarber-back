import User from '../models/User';

class UserDAO {
  async store(data) {
    return await User.create(data);
  }

  async find(query) {
    return await User.findOne(query);
  }

  async findByID(id) {
    return await User.findByPk(id);
  }

  async delete() {}

  async list() {}

  async findUserByEmail(email) {
    return await User.findOne({
      where: {
        email,
      },
    });
  }
}

export default new UserDAO();
