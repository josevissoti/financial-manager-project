package com.project.services;

import com.project.domains.Usuario;
import com.project.domains.dtos.UsuarioDTO;
import com.project.domains.enums.FuncaoPessoa;
import com.project.repositories.UsuarioRepository;
import com.project.services.exceptions.DataIntegrityViolationException;
import com.project.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder encoder;

    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll().stream()
                .map(obj -> new UsuarioDTO(obj))
                .collect(Collectors.toList());
    }

    public Usuario findById(Long id) {
        Optional<Usuario> obj = usuarioRepository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. ID: " + id));
    }

    public Usuario findByCpf(String cpf) {
        Optional<Usuario> obj = usuarioRepository.findByCpf(cpf);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. CPF: " + cpf));
    }

    public Usuario findByEmail(String email) {
        Optional<Usuario> obj = usuarioRepository.findByEmail(email);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. Email: " + email));
    }

    public Usuario create(UsuarioDTO objDto) {
        objDto.setIdUsuario(null);
        objDto.setSenha(encoder.encode(objDto.getSenha()));
        ValidaPorCPFeEmail(objDto);
        Usuario newObj = new Usuario(objDto);
        return usuarioRepository.save(newObj);
    }

    public Usuario update(Long id, UsuarioDTO objDto) {
        objDto.setIdUsuario(id);
        Usuario oldObj = findById(id);
        ValidaPorCPFeEmail(objDto);

        if (objDto.getSenha() != null && !objDto.getSenha().isEmpty()) {
            objDto.setSenha(encoder.encode(objDto.getSenha()));
        } else {
            objDto.setSenha(oldObj.getSenha());
        }

        oldObj = new Usuario(objDto);
        return usuarioRepository.save(oldObj);
    }

    public void delete(Long id) {
        Usuario obj = findById(id);
        if (obj.getContas().size() > 0 && obj.getCategoriaLancamentos().size() > 0 && obj.getLancamentos().size() > 0) {
            throw new DataIntegrityViolationException("Usuário não pode ser deletado pois possui vinculos cadastrados");
        }
        usuarioRepository.deleteById(id);
    }

    public Usuario promoteToAdmin(Long id) {
        Usuario usuario = findById(id);
        usuario.addFuncaoPessoa(FuncaoPessoa.ADMIN);
        return usuarioRepository.save(usuario);
    }

    private void ValidaPorCPFeEmail(UsuarioDTO objDto) {
        Optional<Usuario> obj = usuarioRepository.findByCpf(objDto.getCpf());
        if (obj.isPresent() && obj.get().getIdPessoa() != objDto.getIdUsuario()) {
            throw new DataIntegrityViolationException("CPF já cadastrado no sistema");
        }

        obj = usuarioRepository.findByEmail(objDto.getEmail());
        if (obj.isPresent() && obj.get().getIdPessoa() != objDto.getIdUsuario()) {
            throw new DataIntegrityViolationException("Email já cadastrado no sistema");
        }
    }
}