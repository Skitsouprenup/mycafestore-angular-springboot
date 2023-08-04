package com.myorg.mycafe.utils;

import jakarta.mail.internet.MimeMessage;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailUtils {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String emailAdmin;

    public void sendSimpleMessage(
            String to,
            String subject,
            String messageBody,
            @NonNull List<String> ccList) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(emailAdmin);
        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(messageBody);
        mailMessage.setCc(ccList.toArray(new String[0]));
        javaMailSender.send(mailMessage);
    }

    public void sendHtmlFormattedMessage(String to, String subject, String password) {
        String htmlMsg =
                "<p>"+
                        "<b>Your Login Details For Cafe Management System</b><br />"+
                        "<b>Your Email: </b>"+ to + "<br />" +
                        "<b>Your Password: </b>" + password + "<br />" +
                        "<a href=\"http://localhost:4200\">Click here to login</a>" +
                "</p>";

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(emailAdmin);
            helper.setTo(to);
            helper.setSubject(subject);

            message.setContent(htmlMsg, "text/html");
            javaMailSender.send(message);

        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}
