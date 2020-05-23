import User from '../../models/User';

import message from '../../common/message';

export default async (req, res, next) => {
  const checkIsProvider = await User.findOne({
    where: { id: req.userID, provider: true },
  });

  if (!checkIsProvider) {
    return message(res, 401, 'Only providers are authorized');
  }

  return next();
};
