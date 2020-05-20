import jwt from 'jsonwebtoken';
import UserDAO from '../DAO/UserDAO';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await UserDAO.findUserByEmail(email);

    if (user) {
      if (await user.checkPassword(password)) {
        const { id, name } = user;

        console.log(authConfig);

        return res.json({
          user: { id, name, email },
          token: jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
          }),
        });
      }
      return res.status(401).json({ error: 'Password does not match' });
    }

    return res.status(401).json({ error: 'User not found' });
  }
}

export default new SessionController();
