
import LikeService from '../services/like.service.js';
import { matchedData } from 'express-validator';
import HttpResponse from '../utilities/http.response.js';


export default class LikeController {


  async addLike(req, res) {
    try {
      const user = req.user.id;
      req = matchedData(req);
      const result = await LikeService.create(req.courseId, user);
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
        result.like,
        'Like created successfully',
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

  async deleteLike(req, res) {
    try {
      const user = req.user.id;
      req = matchedData(req);
      const result = await LikeService.delete(req.courseId, user);
      if (!result) {
        return HttpResponse.failure(
          res,
          404,
          'LikeNotFound',
          'Like not found',
        );
      }
      return HttpResponse.success(
        res,
        200,
        result,
        'Like deleted successfully',
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

  async getLikesByUser(req, res) {
    try {
      const user = req.user.id;
      const result = await LikeService.getByUserId(user);
      return HttpResponse.success(
        res,
        200,
        result,
        'Likes retrieved successfully',
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