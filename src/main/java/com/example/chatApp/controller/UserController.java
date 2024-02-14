package com.example.chatApp.controller;

import java.util.List;
import com.example.chatApp.domain.User;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/user")
public class UserController {


    @PersistenceContext
    private EntityManager em;

    public UserController() {
    }

    @Transactional
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
       
        try {
            User user = em.find(User.class, userId);

            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Transactional
    @PostMapping("/signin")
    public ResponseEntity<User> signIn(@RequestBody User validateUser) {
        String email = validateUser.getEmail();
        String password = validateUser.getPassword();

        try {

            String hql = "FROM User WHERE email = :email AND password = :password";
            TypedQuery<User> query = em.createQuery(hql, User.class);
            query.setParameter("email", email);
            query.setParameter("password", password);

            List<User> users = query.getResultList();
            if (users.size() > 1)
                throw new Exception("corresponding email and password is not unique.");

            return ResponseEntity.ok(users.get(0));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User createUser) {
        
        User newUser = new User(createUser.getName(), createUser.getGender(), createUser.getAge(), createUser.getEmail(), createUser.getPassword());

        try {
            em.persist(newUser);

            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Transactional
    @PutMapping("/update")
    public ResponseEntity<Void> updateUser(@RequestBody User updatedUser) {
        
        try {
            
            em.merge(updatedUser);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok().build();
    }

    @Transactional
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser(@RequestBody User deletedUser) {

        try {

            User userToDelete = em.find(User.class, deletedUser.getUserId());
            em.remove(userToDelete);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok().build();
    }

}
