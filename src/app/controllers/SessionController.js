import jwt from 'jsonwebtoken';
import message from '../common/message';
import UserDAO from '../DAO/UserDAO';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await UserDAO.findUserByEmail(email);

    if (user) {
      if (await user.checkPassword(password)) {
        const { id, name } = user;

        return res.json({
          user: { id, name, email },
          token: jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
          }),
        });
      }
      return message(res, 401, 'Password does not match');
    }
    return message(res, 401, 'User not found');
  }
}

export default new SessionController();
