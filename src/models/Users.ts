import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Expressão regular para validar o formato do email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Definir o esquema do Mongoose para o usuário
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email: string) {
        return emailRegex.test(email); // Validação de formato de e-mail
      },
      message: 'O e-mail fornecido está em um formato inválido.'
    }
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Função para fazer hash da senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Criar e exportar o modelo do Mongoose
export const User = mongoose.model('User', userSchema);
