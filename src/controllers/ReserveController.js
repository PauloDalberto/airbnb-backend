import House from "../models/House";
import Reserve from "../models/Reserve";
import User from "../models/User";

class ReserveController{
  async index(req, res){
    const { user_id } = req.headers;

    const reserves = await Reserve.find({ user: user_id }).populate('house')

    return res.json(reserves);
  }

  async store(req, res){
    const { user_id } = req.headers;
    const { house_id } = req.params;
    const { date } = req.body;

    const house = await House.findById(house_id);
    if(!house){
      return res.status(400).json({ error: 'Essa casa não existe' })
    }

    if(house.status !== true){
      return res.status(400).json({ error: 'Solicitação indisponivel' })
    }

    const user = await User.findById(user_id);
    if(String(house.user) === String(user._id)){
      return res.status(401).json({ error: 'Reserva nao permitida' })
    }

    const reserve = await Reserve.create({
      user: user_id,
      house: house_id,
      date
    });

    const populatedReserve = await Reserve.findById(reserve._id)
      .populate('house')
      .populate('user');

    return res.json(populatedReserve)
  }

  async delete(req, res){
    const { reserve_id } = req.params;

    await Reserve.deleteOne({ _id: reserve_id })

    return res.send();
  }
}

export default new ReserveController();