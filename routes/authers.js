const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { Auther, validateCreateAuther, validateUpdateAuter } = require('../models/Auther');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken')


/**
 * @desc Get All Authers
 * @Route /api/authers
 * @memberof GET
 * @access public
 */

router.get('/', asyncHandler
    (async (request, response) => {
        // Sort by any thing .sort({firstName: -1})
        // select by anything .select('firstName lastName')
        const results = await Auther.find();
        response.json({ message: 'get all authers', authers: results });
    }));


/**
 * @desc Get All Auther By Id
 * @Route /api/authers/:id
 * @memberof GET
 * @access public
 */

router.get(
    '/:id',
    asyncHandler(
        async (request, response) => {

            const auther = await Auther.findById(request.params.id)
            if (auther) {
                response.status(200).json({
                    message: 'This auther founded',
                    auther: auther
                });
            } else {
                response.status(404).json({
                    message: 'This auther not found',
                    auther: {}
                });
            }

        }
    ));

/**
 * @desc Create new Auther
 * @Route /api/authers/create
 * @memberof POST
 * @access private (Only Admin)
 */
router.post(
    '/create',
    verifyTokenAndAdmin,
    asyncHandler(
        async (request, response) => {
            const { error } = validateCreateAuther(request.body);
            if (error) {
                return response.status(400).json({ message: error.details[0].message });
            }

            const auther = new Auther({
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                nationality: request.body.nationality,
                image: request.body.image
            }
            );

            const result = await auther.save();
            response.status(201).json({ message: 'Add new auther successfully', auther: result });



        }
    ));

/**
 * @desc Update Auther
 * @Route /api/authers/update/:id
 * @memberof PUT
 * @access private (Only Admin)
 */

router.put(
    '/update/:id',
    verifyTokenAndAdmin,
    asyncHandler(
        async (request, response) => {
            const { error } = validateUpdateAuter(request.body);
            if (error) {
                return response.status(400).json({ message: error.details[0].message });
            }

            const result = await Auther.findByIdAndUpdate(request.params.id, {
                $set: {
                    firstName: request.body.firstName,
                    lastName: request.body.lastName,
                    nationality: request.body.nationality,
                    image: request.body.image
                }
            }, { new: true });

            if (result) {
                response.status(200).json({ message: 'Auther has been updated', auther: result });
            } else {
                response.status(404).json({ message: 'Auther not Found' });
            }


        }
    ));


/**
 * @desc Delete Auther
 * @Route /api/authers/delete/:id
 * @memberof DELETE
 * @access private (Only Admin)
 */

router.delete(
    '/delete/:id',
    verifyTokenAndAdmin,
    asyncHandler(
        async (request, response) => {

            const result = await Auther.findById(request.params.id);
            if (result) {
                await Auther.findByIdAndDelete(request.params.id);
                response.status(200).json({ message: 'Auther has been Deleted' });
            } else {
                response.status(404).json({ message: 'Auther not Found' });
            }


        }
    ));

module.exports = router;