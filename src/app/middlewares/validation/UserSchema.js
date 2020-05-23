import * as Yup from 'yup';

import message from '../../common/message';
import validate from '../../common/validate';

export default {
  store: async (req, res, next) => {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    return await validate(req.body, schema, next, (e) => message(res, 400, e));
  },
  update: async (req, res, next) => {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirmation: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    return await validate(req.body, schema, next, (e) => message(res, 400, e));
  },
};
