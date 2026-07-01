const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const { ConflictError, UnauthorizedError, ValidationError } = require('../shared');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'secret123';
    this.jwtAccessExpire = process.env.JWT_ACCESS_EXPIRE || '15m';
    this.jwtRefreshExpire = process.env.JWT_REFRESH_EXPIRE || '7d';
  }

  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('Email is already registered');
    }

    const user = await userRepository.create(userData);
    const tokens = this.generateTokens(user);
    
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      ...tokens
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      ...tokens
    };
  }

  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtSecret);
      const user = await userRepository.findById(decoded.id);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // For security, don't reveal that the user does not exist
      return { message: 'If that email exists in our system, we have sent a reset code.' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await userRepository.update(user._id, {
      resetPasswordToken,
      resetPasswordExpire
    });

    // In a real application, you would send an email here.
    // For this clone, we'll return the token so it can be verified easily.
    return {
      message: 'Password reset token generated successfully',
      resetToken // Returned for easy testing and debugging
    };
  }

  async resetPassword(resetToken, newPassword) {
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await userRepository.findByResetToken(resetPasswordToken);

    if (!user) {
      throw new ValidationError('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return { message: 'Password reset successful' };
  }

  generateTokens(user) {
    const payload = { id: user._id, email: user.email, role: user.role };
    
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtAccessExpire
    });

    const refreshToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtRefreshExpire
    });

    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService();
