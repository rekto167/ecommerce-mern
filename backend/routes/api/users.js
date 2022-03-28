const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator')

const User = require('../../models/User');

// @router  POST api/users
// @desc    Registration user
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter valid email').isEmail(),
    check('password', 'Enter password min 6 character').isLength({min:6})
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password} = req.body

    try {
        // check user
        let user = await User.findOne({email});
        // action if user is already exists
        if(user){
            return res.status(400).json({errors: [{msg: 'User already exists'}]});
        }

        const avatar = gravatar.url(email, {
            s:'200',
            p:'pg',
            d:'mm'
        })

        // create record user
        user = new User({name, email, avatar, password});

        // hashing password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // saving users
        await user.save();

        const payload = {
            user:{
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtToken'),
            {expiresIn: 360000},
            (err, token) => {
                if(err) throw err;
                res.json({token})
            }
        )

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;