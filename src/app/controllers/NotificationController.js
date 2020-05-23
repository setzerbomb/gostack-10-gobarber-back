import Notification from '../schemas/Notification';

import message from '../../app/common/message';

class NotificationController {
  async index(req, res) {
    const notifications = await Notification.find({
      user: req.userID,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const { user: provider } = await Notification.findById(req.params.id);

    if (provider !== req.userID) {
      return message('You can only update notifications that you own');
    }

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
