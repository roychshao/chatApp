package com.example.chatapp.controller;

import com.example.chatapp.domain.User;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @PersistenceContext
    private EntityManager em;

    private static final Logger logger = LoggerFactory.getLogger(
        UserController.class
    );

    public UserController() {
        // nothing need to do in the non-argument constructor
    }

    @Transactional
    @PostMapping("/friend/add")
    public ResponseEntity<Void> addFriend(@RequestBody List<User> users) {
        try {
            // users[0] contains the user
            // user[1] contains the friend user is going to add
            User me = em.find(User.class, users.get(0).getUserId());
            User friendToAdd = em.find(User.class, users.get(1).getUserId());

            List<User> myFriends = me.getFriends();
            List<User> friendsOfFriend = friendToAdd.getFriends();

            myFriends.add(friendToAdd);
            friendsOfFriend.add(me);

            me.setFriends(myFriends);
            friendToAdd.setFriends(friendsOfFriend);

            em.merge(me);
            em.merge(friendToAdd);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("addFriend:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }
    }

    @Transactional
    @GetMapping("/friend/{userId}")
    public ResponseEntity<List<User>> getFriends(@PathVariable String userId) {
        try {
            User me = em.find(User.class, userId);

            return ResponseEntity.ok(me.getFriends());
        } catch (Exception e) {
            logger.error("getFriends:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }
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
            logger.error("getUserById:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }
    }

    @Transactional
    @PostMapping("/signin")
    public ResponseEntity<User> signIn(@RequestBody User validateUser) {
        String email = validateUser.getEmail();
        String password = validateUser.getPassword();

        try {
            String hql =
                "FROM User WHERE email = :email AND password = :password";
            TypedQuery<User> query = em.createQuery(hql, User.class);
            query.setParameter("email", email);
            query.setParameter("password", password);

            List<User> users = query.getResultList();
            if (users.size() > 1) throw new IllegalArgumentException(
                "corresponding email and password is not unique."
            ); else if (users.isEmpty()) throw new NullPointerException(
                "user with specific email and password not found."
            );

            return ResponseEntity.ok(users.get(0));
        } catch (Exception e) {
            logger.error("signIn:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }
    }

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User createUser) {
        try {
            if (StringUtils.isNotEmpty(createUser.getUserId())) {
                User newUser = new User(
                    createUser.getUserId(),
                    createUser.getName(),
                    createUser.getGender(),
                    createUser.getAge(),
                    createUser.getEmail(),
                    createUser.getPassword()
                );
                em.persist(newUser);
                return ResponseEntity.ok(newUser);
            } else {
                User newUser = new User(
                    createUser.getName(),
                    createUser.getGender(),
                    createUser.getAge(),
                    createUser.getEmail(),
                    createUser.getPassword()
                );
                em.persist(newUser);
                return ResponseEntity.ok(newUser);
            }
        } catch (Exception e) {
            logger.error("register:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }
    }

    @Transactional
    @PutMapping("/update")
    public ResponseEntity<Void> updateUser(@RequestBody User updatedUser) {
        try {
            em.merge(updatedUser);
        } catch (Exception e) {
            logger.error("updateUser:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
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
            logger.error("deleteUser:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }

        return ResponseEntity.ok().build();
    }
}
