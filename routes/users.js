const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, validateUpdateUser } = require('../models/User');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middlewares/verifyToken');

/**
 * @desc Update User Data
 * @Route /api/users/update/:id
 * @memberof PUT
 * @access private
 */

router.put('/update/:id', verifyTokenAndAuthorization, asyncHandler(
    async (request, response) => {

        const { error } = validateUpdateUser(request.body);
        if (error) {
            response.status(400).json({ message: error.details[0].message });
        }

        console.log(request.headers);


        if (request.body.password) {
            const salt = await bcrypt.getSalt(10);
            request.body.password = await bcrypt.hash(request.body.password, salt);
        }

        const userUpdated = await User.findByIdAndUpdate(request.params.id, {
            $set: {
                email: request.body.email,
                password: request.body.password,
                username: request.body.username,

            }
        }, { new: true }).select('-password');
        response.status(200).json({ message: 'Updated user successfully', user: userUpdated });
    }));

/**
* @desc Get All Users Data
* @Route /api/users/
* @memberof GET
* @access private (Only Admin)
*/

router.get('/', verifyTokenAndAdmin, asyncHandler(async (request, response) => {
    const users = await User.find().select('-password');
    response.status(200).json({message: 'Get all users', users: users});
}));


/**
* @desc Get User Data By Id
* @Route /api/users/;id
* @memberof GET
* @access private (Only Admin, && user himself)
*/

router.get('/:id', verifyTokenAndAuthorization, asyncHandler(async (request, response) => {
    const user = await User.findById(request.params.id).select('-password');
    if(user) {
        response.status(200).json({message: 'Get user data', user: user});
    }else {
        response.status(404).json({message: 'User not found'});
    }
}));

/**
* @desc Delete User Data By Id
* @Route /api/users/;id
* @memberof DELETE
* @access private (Only Admin, && user himself)
*/

router.delete('/delete-user/:id', verifyTokenAndAuthorization, asyncHandler(async (request, response) => {
    const user = await User.findById(request.params.id);
    if(user) {
        await User.findByIdAndDelete(request.params.id);
        response.status(200).json({message: 'Delete user data successfully'});
    }else {
        response.status(404).json({message: 'User not found'});
    }
}));

module.exports = router