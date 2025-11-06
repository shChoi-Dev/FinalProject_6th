package com.shoppingmallcoco.project.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "PRODUCTTABLE")
public class ProductEntity {
	
	@Id
	@Column(name = "PRDNO")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq_generator")
    @SequenceGenerator(name="product_seq_generator", sequenceName="PRODUCT_SEQ", allocationSize=1)
	private Integer prdNo;
	
	@Column(name = "PRDNAME")
	private String prdName;
	
	@Column(name = "PRDPRICE")
	private int prdPrice;
	
	@Lob
	@Column(name = "DESCRIPTION")
	private String description;
	
	@Column(name = "IMAGEURL")
	private String imageUrl;
	
	@Column(name = "HOWTOUSE")
	private String howToUse;
	
	@Column(name = "REG_DATE")
	private LocalDate regDate;
	
	@Column(name = "SKINTYPE")
    private String skinType;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CATEGORY_NO", nullable = false)
	private CategoryEntity category;
	
	@OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
	private List<ProductOptionEntity> options;

}
