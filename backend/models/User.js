const bcrypt = require('bcryptjs');

class User {
  constructor(db) {
    this.collection = db.collection('users');
  }

  async createUser(email, password, name) {
    try {
      // Check if user already exists
      const existingUser = await this.collection.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user document
      const user = {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collection.insertOne(user);
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return { ...userWithoutPassword, _id: result.insertedId };
    } catch (error) {
      throw error;
    }
  }

  async authenticateUser(email, password) {
    try {
      const user = await this.collection.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await this.collection.updateOne(
        { _id: user._id },
        { $set: { lastLogin: new Date() } }
      );

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.collection.findOne({ _id: userId });
      if (!user) {
        throw new Error('User not found');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, updates) {
    try {
      const result = await this.collection.updateOne(
        { _id: userId },
        { $set: { ...updates, updatedAt: new Date() } }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
