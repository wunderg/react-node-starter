import User from '../models/userModel.js';
import jwt from 'jwt-simple';


const token = (user) => {
  const secret = process.env.SESSION_SECRET;
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.email, iat: timestamp }, secret);
};

export default {

  getNames(req, res) {
    User.find({}, 'name')
      .then(student => res.json(student))
      .catch(err => res.json(err));
  },

  tokenLogin(req, res) {
    return res.json({ name: req.user.email });
  },

  signin(req, res) {
    const email = req.body.email;
    const password = req.body.pass;

    if (!email || !password) {
      return res.status(422).send({ error: 'Must provide email and password' });
    }

    res.json({ id_token: token(req.body) });
  },

  signup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(422).send({ error: 'Must provide email and password' });
    }

    User.findOne({ email }, (err, user) => {
      if (err) {
        return next(err);
      }

      if (user) {
        return res.status(422).send({ error: 'User already exist' });
      }


      const newUser = new User({
        email,
        password
      });

      newUser.save(err2 => {
        if (err2) {
        return next(err);
        }

        console.log('saved');
        return res.json({ id_token: token(req.body) });
      });
    });
  }
};
