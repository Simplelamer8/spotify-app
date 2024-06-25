import { Request, Response } from 'express'
import { CreateUserDto } from './dtos/CreateUser.dto'
import AuthService from './auth-service'

class AuthController {
  private authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const createUserDto: CreateUserDto = req.body
      const user = await this.authService.registerUser(createUserDto)
      res.status(201).json(user)
    } catch (err) {
      res.status(500).json({ message: 'Error registering user' })
    }
  }

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body
      const result = await this.authService.loginUser(email, password)
      if (!result) {
        res.status(401).json({ message: 'Invalid email or password' })
        return
      }
      res.status(200).json(result)
    } catch (err) {
      res.status(500).json({ message: 'Error logging in' })
    }
  }

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body
      const result = await this.authService.refreshToken(token)
      if (!result) {
        res.status(401).json({ message: 'Invalid or expired refresh token' })
        return
      }
      res.status(200).json(result)
    } catch (err) {
      res.status(500).json({ message: 'Error refreshing token' })
    }
  }

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const {email, updateProperty, updateValue} = req.body;
    try{
      const result = await this.authService.updateUser(email, updateProperty, updateValue);
      res.status(200).json(result);
    }
    catch(error)
    {
      res.status(500).json(error);
    }
  }

  getGroupmates = async (req: Request, res: Response): Promise<void> => {
    console.log(JSON.stringify(req.body));
    const {userData} = req.body;
    
    try{
      const result = await this.authService.getGroupmates(userData);
      res.status(200).json(result);
    }
    catch(error)
    {
      console.log(error);
    }
  }
}

export default AuthController
