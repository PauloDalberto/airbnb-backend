import House from '../models/House';
import User from '../models/User';

class DashboardController{

  async show(req, res){
    const { user_id } = req.headers;

    const houses = await House.find({ user: user_id })

    return res.json(houses)
  }
}

export default new DashboardController()