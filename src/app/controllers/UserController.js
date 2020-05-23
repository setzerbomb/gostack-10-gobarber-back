import UserDAO from '../DAO/UserDAO';
import message from '../common/message';

class UserController {
  async store(req, res) {
    if (await UserDAO.findUserByEmail(req.body.email)) {
      return message(res, 400, 'User already exists');
    }

    const { id, name, email, provider } = await UserDAO.create(req.body);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await UserDAO.findByPk(req.userID);

    if (email && email !== user.email) {
      if (await UserDAO.findUserByEmail(email)) {
        return message(res, 400, 'User already exists');
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return message(res, 401, 'Password does not match');
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
