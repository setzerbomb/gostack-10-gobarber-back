import * as Yup from 'yup';

import message from '../../common/message';
import validate from '../../common/validate';

export default {
  index: async (req, res, next) => {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
    });

    return await validate(req.query, schema, next, (e) => message(res, 400, e));
  },
};
