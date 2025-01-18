const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/course-controller');
const { validationSchema } = require('../middleware/validationSchema');
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');


router.route('/')
        .get(coursesController.getAllCourses)
        .post( validationSchema(), coursesController.addCourse)

router.route('/:courseId')
        .get(coursesController.getOneCourse)
        .patch(coursesController.updateCourse)
        .delete(verifyToken, allowedTo("ADMIN"), coursesController.deleteCourse)


module.exports = router;