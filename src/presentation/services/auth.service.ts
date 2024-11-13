import { errorMonitor } from 'events';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, UserEntity } from '../../domain';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { bcryptAdapter } from '../../config/bcrypt.adapter';
import { Jwt } from '../../config/jwt.adapter';


export class AuthService{

    //Dependencies Injection (DI)
    constructor(
        
    ){}

   public async registerUser( registerUserDto: RegisterUserDto){
        // Steps to register a new user
        const existUser = await UserModel.findOne({email: registerUserDto.email})
        if(existUser) throw CustomError.badRequest('Email already exist');

        try{
            const user = new UserModel(registerUserDto);
             
            // to encript the password 
            user.password = bcryptAdapter.hash(registerUserDto.password)

            // to save the user in db
            await user.save();



    
            // send confirmation email when user is created

            //const userEntity = UserEntity.fromObject(user);
            const {password, ...restUserEntity} = UserEntity.fromObject(user)


            // to obtain the token- JWT & 
            // maintaining user authentication
            const token = await Jwt.generateToken({ id: user.id })

            if(!token) throw CustomError.internalServer('Error while creating JWT-Token');
    
           
           
           


            return {
                user: restUserEntity,
                token: token,
            }


        }catch(error){
            throw CustomError.internalServer(`${error}`)
        }
        return 'todo Ok!';
    }

    public async loginUser( loginUserDto: LoginUserDto){
        // Steps:
        // findOne() to verify if user exists by email
        const user = await UserModel.findOne({email: loginUserDto.email})

        if(!user) throw CustomError.badRequest('Email not valid');

        // isMatch ? from bcrypt => compare method
        const isMatch = bcryptAdapter.compare( loginUserDto.password, user.password);

        if (!isMatch) throw CustomError.badRequest('Password not valid');
      
        // return object {user, token}
        const {password, ...restUserEntity} = UserEntity.fromObject(user);

        //token -jwt
        const token = await Jwt.generateToken({ id: user.id, email: user.email })

        if(!token) throw CustomError.internalServer('Error while creating JWT-Token');

        return {
            user: restUserEntity,
            token: token,
        }


    }

}