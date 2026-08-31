package com.centroemmanuel.service;
import javax.security.auth.login.LoginException;

import org.springframework.stereotype.Service;
import com.centroemmanuel.repository.UsuarioRepository;
import com.centroemmanuel.service.UsuarioService;
import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.entity.Permiso;

@Service
public class AuthService {
    
    private final UsuarioService usuarioService;

    public AuthService(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    public Usuario Login(String username, String clave) throws LoginException{
        if(!usuarioService.existeUsuario(username)){ throw new LoginException("Usuario no existe");}
        Usuario u = usuarioService.getUsuarioByUsername(username);

        if(!u.getClave().equals(clave)){throw new LoginException("Clave incorrecta");}
    
        return u;
    }

    /*public boolean validarClave(String pClave, Usuario usuario) {
        return pClave.equals(usuario.getClave());  //APLICAR CUANDO LA CLAVE TENGA SEGURIDAD DE HASH
    }*/
}