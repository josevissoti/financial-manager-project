package com.project.services;

import com.project.domains.Admin;
import com.project.domains.dtos.AdminDTO;
import com.project.repositories.AdminRepository;
import com.project.services.exceptions.DataIntegrityViolationException;
import com.project.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder encoder;

    public List<AdminDTO> findAll() {
        return adminRepository.findAll().stream()
                .map(obj -> new AdminDTO(obj))
                .collect(Collectors.toList());
    }

    public Admin findById(Long id) {
        Optional<Admin> obj = adminRepository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. ID: " + id));
    }

    public Admin findByCpf(String cpf) {
        Optional<Admin> obj = adminRepository.findByCpf(cpf);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. CPF: " + cpf));
    }

    public Admin findByEmail(String email) {
        Optional<Admin> obj = adminRepository.findByEmail(email);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. Email: " + email));
    }

    public Admin create(AdminDTO objDto) {
        objDto.setIdAdmin(null);
        objDto.setSenha(encoder.encode(objDto.getSenha()));
        ValidaPorCPFeEmail(objDto);
        Admin newObj = new Admin(objDto);
        return adminRepository.save(newObj);
    }

    public Admin update(Long id, AdminDTO objDto) {
        objDto.setIdAdmin(id);
        Admin oldObj = findById(id);
        ValidaPorCPFeEmail(objDto);
        oldObj = new Admin(objDto);
        return adminRepository.save(oldObj);
    }

    public void delete(Long id) {
        Admin obj = findById(id);
        if (obj.getContas().size() > 0 && obj.getCategoriaLancamentos().size() > 0 && obj.getLancamentos().size() > 0) {
            throw new DataIntegrityViolationException("Admin não pode ser deletado pois possui vinculos cadastrados");
        }
        adminRepository.deleteById(id);
    }

    private void ValidaPorCPFeEmail(AdminDTO objDto) {
        Optional<Admin> obj = adminRepository.findByCpf(objDto.getCpf());
        if (obj.isPresent() && obj.get().getIdPessoa() != objDto.getIdAdmin()) {
            throw new DataIntegrityViolationException("CPF já cadastrado no sistema");
        }

        obj = adminRepository.findByEmail(objDto.getEmail());
        if (obj.isPresent() && obj.get().getIdPessoa() != objDto.getIdAdmin()) {
            throw new DataIntegrityViolationException("Email já cadastrado no sistema");
        }
    }

}
