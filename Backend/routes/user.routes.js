const express = require("express")
const { UserModel } = require("../models/user.model")
const { authenticate } = require("../middleware/auth.middleware");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userRouter = express.Router()


userRouter.post("/register", async (req, res) => {
    const { name, email, password ,phone,profession} = req.body
    try {
        const user = await UserModel.find({ email })
        console.log(user)
        if (user.length > 0) {
            res.send({ "msg": "user already exist" })
        } else {
            bcrypt.hash(password, 5, async function (err, hash) {
                if (err) {
                    res.send({ "msg": "Something went wrong" })
                } else {
                    const user = new UserModel({ name, email, password: hash ,phone,profession})
                    await user.save()
                    res.status(201).send({ "msg": "new User has been register" })
                }
            })
        }
    } catch (error) {
        res.send({ "msg": "Something went wrong", "error": error.message })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, function (err, result) {
                if (result) {
                    let token = jwt.sign({ userID: user[0]._id }, "masai", { expiresIn: "1h" })
                    res.status(201).send({ "msg": "Sucessfully Login", "token": token, "user": user[0]._id ,"name":user[0].name})
                }else{
                    res.send({ "msg": "Wrong Password" })
                }
            })
        } else {
            res.send({ "msg": "User Not Found With this Email" })
        }
    } catch (error) {
        res.send({ "msg": "Something Went wrong", "error": error.message })
    }
})

// Get all users

// userRouter.get("/", async (req, res) => {
//     try {
//         const users = await UserModel.find();
//         res.status(200).send(users);
//     } catch (error) {
//         res.send({ msg: "Something went wrong", error: error.message });
//     }
// });

userRouter.get("/", async (req, res) => {
    const { id, name, email, phone, profession } = req.query;

    try {
        let query = {};

        if (id) {
            query._id = id;
        }
        if (name) {
            query.name = new RegExp(name, 'i'); // Case-insensitive search
        }
        if (email) {
            query.email = new RegExp(email, 'i'); // Case-insensitive search
        }
        if (phone) {
            query.phone = new RegExp(phone, 'i'); // Case-insensitive search
        }
        if (profession) {
            query.profession = new RegExp(profession, 'i'); // Case-insensitive search
        }

        const users = await UserModel.find(query);
        if (users.length > 0) {
            res.status(200).send(users);
        } else {
            res.status(404).send({ msg: "No users found" });
        }
    } catch (error) {
        res.send({ msg: "Something went wrong", error: error.message });
    }
});


// Edit a user by ID
userRouter.put("/:id", authenticate, async (req, res) => {
     console.log(req.body.user)
    const { id } = req.params;
    const { name, email, phone, profession } = req.body;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(id, { name, email, phone, profession }, { new: true });
        if (updatedUser) {
            res.status(200).send({ msg: "User updated successfully", user: updatedUser });
        } else {
            res.status(404).send({ msg: "User not found" });
        }
    } catch (error) {
        res.send({ msg: "Something went wrong", error: error.message });
    }
});

// Delete a user by ID
userRouter.delete("/:id",authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (deletedUser) {
            res.status(200).send({ msg: "User deleted successfully" });
        } else {
            res.status(404).send({ msg: "User not found" });
        }
    } catch (error) {
        res.send({ msg: "Something went wrong", error: error.message });
    }
});


module.exports = { userRouter }