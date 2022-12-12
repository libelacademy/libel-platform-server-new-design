import { matchedData } from 'express-validator';
import HttpResponse from '../utilities/http.response.js';
import EnrollmentService from '../services/enrollment.service.js';


export default class EnrollmentController {
  async addEnrollment(req, res) {
    try {
      const user = req.user;
      req = matchedData(req);
      const studentId = user.role === 'admin' ? req.student : user.id;
      const result = await EnrollmentService.create(req.courseId, studentId);
      if (!result.created) {
        return HttpResponse.failure(
          res,
          400,
          result.error.name,
          result.error.message,
        );
      }
      return HttpResponse.success(
        res,
        201,
        result.enrollment,
        'Enrollment created successfully',
      );
    } catch (error) {
      return HttpResponse.failure(
        res,
        500,
        error.name,
        error.message,
      );
    }
  }

  async deleteEnrollment(req, res) {
    try {
      req = matchedData(req);
      console.log(req)
      const result = await EnrollmentService.delete(req.id);
      if (!result) {
        return HttpResponse.failure(
          res,
          404,
          'EnrollmentNotFound',
          'Enrollment not found',
        );
      }
      return HttpResponse.success(
        res,
        200,
        result,
        'Enrollment deleted successfully',
      );
    } catch (error) {
      return HttpResponse.failure(
        res,
        500,
        error.name,
        error.message,
      );
    }
  }

  async getEnrollmentsByUser(req, res) {
    try {
      const user = req.user.id;
      const result = await EnrollmentService.getByUserId(user);
      return HttpResponse.success(
        res,
        200,
        result,
        'Enrollments retrieved successfully',
      );
    } catch (error) {
      return HttpResponse.failure(
        res,
        500,
        error.name,
        error.message,
      );
    }
  }
}