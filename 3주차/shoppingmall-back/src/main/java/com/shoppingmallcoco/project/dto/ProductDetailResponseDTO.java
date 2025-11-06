package com.shoppingmallcoco.project.dto;

import java.util.List;
import com.shoppingmallcoco.project.entity.ProductEntity;
import lombok.Data;
import java.util.Collections;

@Data
public class ProductDetailResponseDTO {

	private Integer prdNo;
	private String prdName;
	private int prdPrice;
	private String description;
    private String howToUse;
	
    // 갤러리 (여러 이미지 처리 로직 추가 필요)
    private List<String> imageUrls;
    
    // 리뷰 통계 (ReviewService에서 받아와야 함)
    private double averageRating = 4.8; 
    private int reviewCount = 3421;
    
    // 옵션 목록 (ProductOption -> DTO 변환 로직 필요)
    // private List<ProductOptionDTO> options;
    
    // 생성자: Entity -> DTO 변환
    public ProductDetailResponseDTO(ProductEntity product) {
    	this.prdNo = product.getPrdNo();
        this.prdName = product.getPrdName();
        this.prdPrice = product.getPrdPrice();
        this.description = product.getDescription();
        this.howToUse = product.getHowToUse();
    	
    	// List.of(null) 오류를 방지하는 null-safe 코드로 변경
        if (product.getImageUrl() != null) {
            this.imageUrls = List.of(product.getImageUrl());
        } else {
            this.imageUrls = Collections.emptyList(); // 👈 null이면 빈 리스트 반환
        }
        
        // (임시) 리뷰 통계
        this.averageRating = 4.8; 
        this.reviewCount = 3421;
    }

	
}
