import { Body, Controller, Get, Post, Put, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO, UpdateProfileDTO } from './dto/user.dto';

@Controller('user')
@UseInterceptors(TransformInterceptor)
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: RegisterDTO) {
        return await this.authService.register(body)
    }

    @Post('auth')
    async login(@Body() body: LoginDTO) {
        return await this.authService.auth(body)
    }

    @UseGuards(AuthGuard(['user']))
    @Put('profile')
    async updateProfile(@Request() req, @Body() body: UpdateProfileDTO) {
        const USER = req.user

        return await this.authService.updateProfile(USER.uid, body)
    }

    @UseGuards(AuthGuard(['user']))
    @Get('profile')
    async getProfile(@Request() req) {
        const USER = req.user

        return await this.authService.profile(USER.uid)
    }
}
