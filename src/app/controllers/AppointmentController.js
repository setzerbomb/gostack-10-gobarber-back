import Appointment from '../models/Appointment';
import UserDAO from '../DAO/UserDAO';

import message from '../common/message';

class AppointmentController {
  async store(req, res) {
    const { provider_id, date } = req.body;

    const isProvider = await UserDAO.find({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return message(
        res,
        401,
        'You can only create appointments with providers'
      );
    }

    const appointment = await Appointment.create({
      user_id: req.userID,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
