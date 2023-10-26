import UserManager from "../dao/managers/userManagerMongo.js" 
import { Router } from "express"

const userRouter = Router()
const user = new UserManager()


userRouter.post("/register",(req, res) => {
    try 
    {
        let newUser = req.body
        user.addUser(newUser)
        res.redirect("/login")
    } catch (error) 
    {
        res.status(500).send("Error al acceder al perfil: " + error.message);
    }
})

userRouter.post("/login", async (req, res) => {
    try 
    {
        let email = req.body.email       
        const data = await user.validateUser(email)      
        if(data.password === req.body.password)
        {   
            if(data.rol === 'admin'){
                req.session.emailUsuario = email
                req.session.nomUsuario = data.first_name
                req.session.apeUsuario = data.last_name
                req.session.rolUsuario = data.rol
                res.redirect("/profile")
            }
            else{
                req.session.emailUsuario = email
                req.session.rolUsuario = data.rol
                res.redirect("/api/products" )
            }
        
        }
        else
        {
            res.redirect("../../login")
        }

    } 
    catch (error) 
    {
        res.status(500).send("Error al acceder al perfil: " + error.message);
    }
})

userRouter.get("/logout", async (req, res) => {
    req.session.destroy((error) =>{
        if(error)
        {
            return res.json({ status: 'Logout Error', body: error})
        }
        res.redirect('../../login')
    })    
})

export default userRouter