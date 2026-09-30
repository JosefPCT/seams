import { validationResult, matchedData } from 'express-validator';
import * as authService from "./auth-service.js";
import * as validation from "../../middleware/validation.js"

export const registerPostRoute = [
  validation.validateUser,
  async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    const { email, password, first_name, last_name } = matchedData(req);
    const registeredUser = await authService.registerUser(email, password, first_name, last_name);

    return res.status(200).json(registeredUser);
  }
]