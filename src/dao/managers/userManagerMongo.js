
import { usersModel } from '../models/users.model.js' 


export default class UserManager 
extends usersModel
{
    constructor() {
        super();
    }
    
      // Agregar
      async addUser(userData) 
      {
          try 
          {
            await usersModel.create(userData);
            return 'Usuario agregado';
          } catch (error) {
            console.error('Error al agregar el usuario:', error);
            return 'Error al agregar el usuario';
          }
        }
    
      // Actualizar
      async updateUser(id, userData) 
      {
        try 
        {
          const user = await UserManager.findById(id);   
          if (!user) {
            return 'Usuario no encontrado';
          } 
          // Actualiza los campos del usuario
          user.set(userData);
    
          await user.save();
          return 'Usuario actualizado';
        } catch (error) {
          console.error('Error al actualizar el usuario:', error);
          return 'Error al actualizar el usuario';
        }
      }
    
  //Ver todos los usuarios
      async getUsers() 
      {
        try 
        {
          const users = await UserManager.find({});
          return users;
        } catch (error) {
          console.error('Error al obtener los usuarios:', error);
          return [];
        }
      }
    
      // Usuario por ID
      async getUserById(id) 
      {
        try 
        {
      
          const user = await UserManager.findById(id).lean();    
          if (!user) 
          {
            return 'Usuario no encontrado';
          }   
          return user;
        } catch (error) {
          console.error('Error al obtener el usuario:', error);
          return 'Error al obtener el usuario';
        }
      }
      // Elimina un usuario por ID
      async deleteUser(id) 
      {
        try 
        {
          const user = await UserManager.findById(id);  
          if (!user) {
            return 'Usuario no encontrado';
          }
    
          await user.remove();
          return 'Usuario eliminado';
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          return 'Error al eliminar el usuario';
        }
      }
      async validateUser(param) {
        try 
        {
          const user = await UserManager.findOne({email: param});
           if(!user)
           {
             return "Usuario no encontrado" 
           }
          return user;
        } 
        catch (error)
        {
          console.error('Error al validar usuario', error);
          return 'Error al obtener el usuario';
        }
      }
// Validar email

      async findEmail(param) {
        try{
        const user= await UserManager.findOne(param)
        return user
      } catch(error) {
        console.error("error al validar usuario",error);
        return "Error al obtener el usuario";
      }
    }

    }
