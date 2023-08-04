package com.myorg.mycafe.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;

import java.io.Serial;
import java.io.Serializable;

/*
* name in named query must the in this format:
* <class-name-associated-with-DAO.DAO-method>
* */
@NamedQuery(
        name = "User.findByEmailId",
        query = "SELECT u FROM User u WHERE u.email=:email"
)

//This query wraps each result in the resultset within UserWrapper class
//And store them in a Collection that is the return type of the selected method.
@NamedQuery(
        name = "User.getUsers",
        query = "SELECT new com.myorg.mycafe.wrapper.UserWrapper"+
                "(u.id, u.name, u.contactNumber, u.email, u.status) "+
                "FROM User u WHERE u.role='user' OR u.role='User'"
)

@NamedQuery(
        name = "User.getAdmins",
        query = "SELECT email FROM User u WHERE u.role='admin'"
)

@NamedQuery(
        name = "User.updateStatus",
        query = "UPDATE User u SET u.status=:status WHERE u.id=:id"
)


@Data
@Entity
@Table(name="user")
public class User implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id;

    @Column(length = 200)
    private String name;

    private String contactNumber;
    private String email;
    private String password;
    private String status;

    @Column(nullable = false)
    private String role = "user";
}
