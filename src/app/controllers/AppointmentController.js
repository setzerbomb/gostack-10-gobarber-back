import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import message from '../common/message';

import Mail from '../../lib/Mail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    /**
     * limit: limite de dados por página
     * offset: quantos registros devem ser pulados até o index que representa o inicio da proxima página
     * include: retornar dados do relacionamentos
     */
    const appointments = await Appointment.findAll({
      where: { user_id: req.userID, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return message(
        res,
        401,
        'You can only create appointments with providers'
      );
    }

    if (provider_id === req.userID) {
      return message(res, 401, 'You cannot make an appointment with yourself');
    }

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return message(res, 400, 'Past date is not permitted');
    }

    /**
     * Check for availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return message(res, 400, 'Appointment date is not available');
    }

    /**
     * Notify appointment provider
     */
    const { name: clientName } = await User.findByPk(req.userID);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${clientName} para ${formattedDate}}`,
      user: provider_id,
    });

    const appointment = await Appointment.create({
      user_id: req.userID,
      provider_id,
      date: hourStart,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (!appointment) {
      return message(res, 400, 'Appointment not found');
    }
    if (appointment.user_id !== req.userID) {
      return message(
        res,
        401,
        'You don not have permission to cancel this appointment'
      );
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return message(
        res,
        401,
        'You can only cancel appointments with 2 hours in advance'
      );
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      text: 'Você tem um novo cancelamento',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
