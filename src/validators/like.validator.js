
import results from '../utilities/results.validator.js';
import { check } from 'express-validator';


export const course = [
  check('courseId').exists().withMessage('Course is required'),
  check('courseId').not().isEmpty().withMessage('Course is required'),
  check('courseId').isMongoId().withMessage('Course must be a valid Id'),
  (req, res, next) => results(req, res, next),
]