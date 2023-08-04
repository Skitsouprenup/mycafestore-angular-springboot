package com.myorg.mycafe.jwt;

import com.myorg.mycafe.dao.UserDao;
import com.myorg.mycafe.utils.EncryptionUtilities;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Slf4j
@Component
public class CustomerDetailsService implements UserDetailsService {

    @Autowired
    UserDao userDao;

    @Autowired
    EncryptionUtilities encryptionUtilities;

    com.myorg.mycafe.models.User userDetail;

    /*
    * This is manually called in JwtFilter class and
    * automatically called during authentication
    * method.
    * */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //log.info("Find email in loadByUsername method.");
        userDetail = userDao.findByEmailId(username);

        if(userDetail != null) {
            try {
                return new User(
                        userDetail.getEmail(),
                        new BCryptPasswordEncoder()
                                .encode(encryptionUtilities.decryptPassAes(userDetail.getPassword())),
                        new ArrayList<>());
            }catch(Exception e) {
                e.printStackTrace();
                throw new UsernameNotFoundException("Invalid username");
            }
        }
        else throw new UsernameNotFoundException("Username not found!");
    }

    public com.myorg.mycafe.models.User getUserDetail() {
        return userDetail;
    }
}
