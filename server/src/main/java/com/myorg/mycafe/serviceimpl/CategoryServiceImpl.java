package com.myorg.mycafe.serviceimpl;

import com.google.common.base.Strings;
import com.myorg.mycafe.constants.CafeConstants;
import com.myorg.mycafe.dao.CategoryDao;
import com.myorg.mycafe.jwt.JwtFilter;
import com.myorg.mycafe.models.Category;
import com.myorg.mycafe.service.CategoryService;
import com.myorg.mycafe.utils.CafeUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    JwtFilter jwtFilter;

    @Override
    public ResponseEntity<String> addCategory(Map<String, String> requestMap) {
        try {
            if(jwtFilter.hasRole("admin")) {
                if(CafeUtilities.validateRequestMapIdAndName(requestMap, false)) {
                    Category newCategory = categoryDao.save(getCategoryFromMap(requestMap, false));
                    String responseBody =
                            "{\"id\":\""+ newCategory.getId() + "\", "
                            + "\"name\":\"" + newCategory.getName() + "\"}";
                    return CafeUtilities.getResponse(responseBody, HttpStatus.OK);
                }
                String responseBody = "{\"message\": \""+ "Invalid Data." +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
            }
            else {
                String responseBody = "{\"message\": \""+ "Unauthorized Access." +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.UNAUTHORIZED);
            }
        }
        catch(Exception e) {
            e.printStackTrace();
        }

        String responseBody = "{\"message\": \""+ CafeConstants.STATUS_500 +"\"}";
        return CafeUtilities.getResponse(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Category>> getCategories(String filterValue) {
        try {
            if(!Strings.isNullOrEmpty(filterValue) && filterValue.equalsIgnoreCase("true"))
                return new ResponseEntity<>(categoryDao.getCategories(), HttpStatus.OK);
            else return new ResponseEntity<>(categoryDao.findAll(), HttpStatus.OK);
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateCategory(Map<String, String> requestMap) {
        try {
            if(jwtFilter.hasRole("admin")) {
                if(CafeUtilities.validateRequestMapIdAndName(requestMap, true)) {
                    Optional<Category> opt = categoryDao.findById(Integer.parseInt(requestMap.get("id")));
                    String responseBody;

                    if(opt.isPresent()) {
                        Category editedCategory =
                                categoryDao.save(getCategoryFromMap(requestMap, true));
                        responseBody =
                                "{\"id\":\""+ editedCategory.getId() + "\", " +
                                "\"name\":\"" + editedCategory.getName() + "\"}";
                    }
                    else {
                        responseBody = "{\"message\": \""+ "Category doesn't exist." +"\"}";
                    }
                    return CafeUtilities.getResponse(responseBody, HttpStatus.OK);
                }
            }
            else {
                String responseBody = "{\"message\": \""+ "Unauthorized Access." +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.UNAUTHORIZED);
            }
        }
        catch(Exception e) {
            e.printStackTrace();
        }

        String responseBody = "{\"message\": \""+ CafeConstants.STATUS_500 +"\"}";
        return CafeUtilities.getResponse(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private Category getCategoryFromMap(Map<String, String> requestMap, boolean updateCategory) {
        Category category = new Category();

        //This is executed if the category already exists in the database
        //and going to be updated.
        if(updateCategory) category.setId(Integer.parseInt(requestMap.get("id")));
        category.setName(requestMap.get("name"));

        return category;
    }
}
