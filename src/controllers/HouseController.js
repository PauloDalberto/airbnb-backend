import House from '../models/House';
import User from '../models/User';
import * as yup from 'yup';

class HouseController{

  async index(req, res){
    const { status } = req.query;

    const houses = await House.find({ status })

    return res.json(houses)
  }

  async store(req, res){
    const schema = yup.object().shape({
      description: yup.string().required(),
      location: yup.string().required(), 
      price: yup.number().required(),
      status: yup.boolean().required()
    })

    const { filename } = req.file
    const { description, price, location, status } = req.body;
    const { user_id } = req.headers

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Falha na validação' })
    }

    const house = await House.create({
      user: user_id,
      thumbnail: filename,
      description,
      location,
      price,
      status
    })

    return res.json(house)
  }

  async uptade(req, res){
    const schema = yup.object().shape({
      description: yup.string().required(),
      location: yup.string().required(), 
      price: yup.number().required(),
      status: yup.boolean().required()
    })

    const { filename } = req.file;
    const { house_id } = req.params;
    const { description, price, location, status } = req.body;
    const { user_id } = req.headers

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Falha na validação' })
    }

    const user = await User.findById(user_id);
    const houses = await House.findById(house_id);

    if (String(user._id) !== String(houses.user)) {
      return res.status(401).json({ error: 'error nao autorizado' });
    }    

    await House.updateOne({ _id: house_id }, {
      user: user_id,
      thumbnail: filename,
      description,
      location,
      price,
      status
    })

    return res.send();
  }

  async delete(req, res){
    const { house_id } = req.params;
    const { user_id } = req.headers;

    const user = await User.findById(user_id);
    const houses = await House.findById(house_id);

    if (String(user._id) !== String(houses.user)) {
      return res.status(401).json({ error: 'error nao autorizado' });
    }    

    await House.deleteOne({ _id: house_id })

    return res.send();
  }
}

export default new HouseController();