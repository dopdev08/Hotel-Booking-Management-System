package com.projecthotel.khanhsky_hotel.model;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @JsonIgnore
    @ManyToMany(mappedBy = "roles")
    private Collection<User> users = new HashSet<>();

    public Role(String name) {
        this.name = name;
    }

    // ===== LOGIC QUẢN LÝ QUAN HỆ (KHÔNG ĐỔI) =====
    public void assignRoleToUser(User user){
        user.getRoles().add(this);
        this.users.add(user);
    }

    public void removeUserFromRole(User user){
        user.getRoles().remove(this);
        this.users.remove(user);
    }

    public void removeAllUsersFromRole(){
        if (this.users != null){
            List<User> roleUsers = this.users.stream().toList();
            roleUsers.forEach(this::removeUserFromRole);
        }
    }

    // ===== GETTERS =====
    public Long getId() {
        return id;
    }

    public String getName() {
        return name != null ? name : "";
    }

    public Collection<User> getUsers() {
        return users;
    }

    // ===== QUAN TRỌNG: equals & hashCode =====
    // Giúp Hibernate không hiểu nhầm entity detached
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Role)) return false;
        Role role = (Role) o;
        return Objects.equals(name, role.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
