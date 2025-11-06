package com.shoppingmallcoco.project.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "PRODUCTOPTIONTABLE")
public class ProductOptionEntity {
	
	@Id
	@Column(name = "OPTIONNO")
	private Integer optionNo;
	
	@Column(name = "OPTIONNAME")
	private String optionName;
	
	@Column(name = "OPTIONVALUE")
	private String optionValue;
	
	@Column(name = "STOCK")
	private int stock;
	
	@Column(name = "ADDPRICE")
	private int addPrice;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "prdNo", nullable = false)
	private ProductEntity product;
}
