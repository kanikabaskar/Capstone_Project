package com.training.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.training.business.bean.MaterialCategoryBean;
import com.training.service.MaterialService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping("/")
    public String home() {
        return "Material Service deployed successfully";
    }

    @GetMapping("/health")
    public String health() {
        return "Material Service is UP";
    }

    @GetMapping("/material/controller/getMaterialCategories")
    public ResponseEntity<List<MaterialCategoryBean>> getMaterialCategories() {
        List<MaterialCategoryBean> list =
                materialService.getMaterialCategories();

        return ResponseEntity.ok(list);
    }

    @GetMapping("/material/controller/getMaterialCategoryById/{categoryId}")
    public ResponseEntity<MaterialCategoryBean> getMaterialCategoryById(
            @PathVariable("categoryId") String categoryId) {

        MaterialCategoryBean materialCategoryBean =
                materialService.getMaterialCategoryById(categoryId);

        return ResponseEntity.ok(materialCategoryBean);
    }
}