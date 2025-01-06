import User from "../models/User";
import * as yup from 'yup';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class SessionControler{
  async store(req, res){
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().min(6)
    })

    const { email, password } = req.body;

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Ocorreu um erro ao validar informações' })
    }

    let emailExists = await User.findOne({ email });

    if(emailExists){
      return res.status(422).json({ msg: "O email já existe" })
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
      email, 
      password: passwordHash
    })

    try{
      await user.save()
      res.status(201).json({ msg: "Usuario criado com sucesso" })
    } catch(error){
      res.status(500).json({ msg: error })
    }
  }

  async login(req, res) {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
    });
  
    const { email, password } = req.body;
  
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Ocorreu um erro ao validar informações" });
    }
  
    let user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).json({ msg: "O usuário não existe" });
    }
  
    const checkPassword = await bcrypt.compare(password, user.password);
  
    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha Inválida" });
    }
  
    try {
      const secret = process.env.SECRET;
  
      const token = jwt.sign({ id: user._id }, secret);
  
      // eslint-disable-next-line no-unused-vars
      const { password, ...userWithoutPassword } = user.toObject();

      res.status(200).json({
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
  
}

export default new SessionControler();