const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const jwt = require('jsonwebtoken');

const response = async (req, res) => {
    return res.status(200).send("<h1>Server is running</h1> <p>Port 3001</p>");
}

const registerUser = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    
    if(!password || !email) {
        return res.status(400).json({ message: "Please fill in all fields" });
    } 

    const hash = await bcrypt.hash(password, 10);

    User.findOne({ email: email }).then((user) => {

        if (user == null) {
            try {
                const user = new User({ 
                    ...req.body,
                    password: hash,
                })

                user.save().then((newDoc) => {
                    res.status(200).json({ result: true, User: newDoc });
                  });
            } catch (error) {
                console.log(error);
            }

        } else {
            return res.status(400).json({ message: "User already exists" });
            
        }
        
    })

}

const deleteUser = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    try {
        if(!password || !email) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        User.findOne({ email: email }).then((user) => {
            if(!user) {
                return res.status(400).json({ message: "User does not exist" });
            }

            const hash = bcrypt.compareSync(password, user.password);

            if(hash) {
                User.deleteOne({ id: user.id }).then(() => {
                    res.status(200).json({ result: true, deleted: email });
                })}
        })
    } catch (error) {
        console.log(error);
    }
}

const getUsers = async (req, res) => {

    const name = req.body.name;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }


    if(name) {
        User.find(filter).select("-password").then((users) => {
            if(users.length !== 0) {
                res.status(200).json({ users });
            } else {
                res.status(404).json({ result: false, message: "Users not found" });
            }
        })
    } else {
        User.find({}).then((users) => {
            console.log(users)
            res.status(200).json({ users });
        })  
    }
}


const login = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}).then((user) => {
        
        const hash = bcrypt.compareSync(password, user.password);

        if(hash) {
            const token = jwt.sign(
                { id: user._id, email: user.email, name: user.name }, 
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN } 
              );

            res.status(200).json({ response: true, token: token });

        } else {
            res.status(400).json({ response: false, error: "Login failed" });
        }
    })  
}


const updateUser = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }).select("-password");
      if (!user) {
        return res.status(404).send({ error: "Utilisateur introuvable" });
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  

module.exports = { registerUser, response, deleteUser, getUsers, login, updateUser}