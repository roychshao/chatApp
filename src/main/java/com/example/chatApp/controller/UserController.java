package com.example.chatApp.controller;

import com.example.chatApp.domain.User;
import com.example.chatApp.config.hibernateConfig;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.hibernate.*;
import org.hibernate.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final SessionFactory factory;

    @Autowired
    public UserController(SessionFactory factory) {
        this.factory = factory;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        
        try (Session session = factory.openSession()) {
            
            session.beginTransaction();
            User user = session.get(User.class, userId);
            session.getTransaction().commit();
            session.close();

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

    @PostMapping("/signin")
    public ResponseEntity<User> signIn(@RequestBody User validateUser) {
        String email = validateUser.getEmail();
        String password = validateUser.getPassword();

        try (Session session = factory.openSession()) {

            session.beginTransaction();
            String hql = "FROM User WHERE email = :email AND password = :password";
            Query<User> query = session.createQuery(hql, User.class);
            query.setParameter("email", email);
            query.setParameter("password", password);

            // expect the result is unique
            User user = query.uniqueResult();

            session.getTransaction().commit();
            session.close();

            System.out.println("User " + user.getId() + " signin");
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User createUser) {
        
        User newUser = new User(createUser.getName(), createUser.getGender(), createUser.getAge(), createUser.getEmail(), createUser.getPassword());

        try (Session session = factory.openSession()) {
            
            session.beginTransaction();
            session.persist(newUser);
            session.getTransaction().commit();
            session.close();

            System.out.println("User " + newUser.getId() + " created");
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("/update")
    public ResponseEntity<Void> updateUser(@RequestBody User updatedUser) {
        
        try (Session session = factory.openSession()) {
            
            session.beginTransaction();
            session.merge(updatedUser);
            session.getTransaction().commit();
            session.close();

            System.out.println("User " + updatedUser.getId() + " updated");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser(@RequestBody User deletedUser) {

        try (Session session = factory.openSession()) {

            session.beginTransaction();
            session.merge(deletedUser);
            session.remove(deletedUser);
            session.getTransaction().commit();
            session.close();

            System.out.println("User " + deletedUser.getId() + " deleted");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok().build();
    }

}
