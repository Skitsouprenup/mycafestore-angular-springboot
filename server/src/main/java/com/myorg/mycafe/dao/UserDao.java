package com.myorg.mycafe.dao;

import com.myorg.mycafe.models.User;
import com.myorg.mycafe.wrapper.UserWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserDao extends JpaRepository<User, Integer> {

    User findByEmailId(@Param("email") String email);
    /*
    * No need to create a query for this method because JpaRepository
    * automatically provides a select query for this. If we create a method
    * with a name of "find" plus field name. Usually the field name is prefixed by "By" e.g. findByName.
    *  JpaRepository will recognize the method and create a select query looking for the specified field.
    * */
    User findByEmail(String email);
    List<UserWrapper> getUsers();
    List<String> getAdmins();
    @Transactional
    @Modifying
    Integer updateStatus(@Param("status") String status, @Param("id") Integer id);
}
