import UserDAO from '../DAO/UserDAO';

class UserController {
  async store(req, res) {
    if (await UserDAO.findUserByEmail(req.body.email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, provider } = await UserDAO.store(req.body);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    return res.json({ e: 'a' });
  }
}

export default new UserController();
