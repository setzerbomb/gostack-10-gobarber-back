import * as Yup from 'yup';

import message from '../../common/message';
import validate from '../../common/validate';

export default {
  store: async (req, res, next) => {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    return await validate(req.body, schema, next, (e) => message(res, 400, e));
  },
};
