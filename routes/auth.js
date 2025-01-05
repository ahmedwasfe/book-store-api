const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, validateRegisterUser, validateLoginUser } = require('../models/User');


/**
 * @desc Register new User
 * @Route /api/auth/register
 * @memberof POST
 * @access public
 */
router.post(
    '/register',
    asyncHandler(async (request, response) => {
        const { error } = validateRegisterUser(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }

        let user = await User.findOne({ email: request.body.email });
        if (user) {
            return response.status(400).json({ message: 'This user already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        request.body.password = await bcrypt.hash(request.body.password, salt);


        user = new User({
            email: request.body.email,
            username: request.body.username,
            password: request.body.password,
            // isAdmin: request.body.isAdmin,
        });

        const result = await user.save();
        const token = user.generateToken();
        const { password, ...other } = result._doc;
        response.status(201).json({ message: 'Register user successfully', user: other, token: token });
    }));

    /**
 * @desc Login User
 * @Route /api/auth/login
 * @memberof POST
 * @access public
 */
router.post(
    '/login',
    asyncHandler(async (request, response) => {
        const { error } = validateLoginUser(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }

        let user = await User.findOne({ email: request.body.email });
        if (!user) {
            return response.status(400).json({ message: 'This user not registered, Please create new account!' });
        }

        const isPasswordMatch = await bcrypt.compare(request.body.password, user.password);
        if(!isPasswordMatch){
            return response.status(400).json({ message: 'Please check your password and try again!' });
        }

        const salt = await bcrypt.genSalt(10);
        request.body.password = await bcrypt.hash(request.body.password, salt);

        const token = user.generateToken();
        const { password, ...other } = user._doc;
        response.status(202).json({ message: 'Login user successfully', user: other, token: token });
    }));


module.exports = router;