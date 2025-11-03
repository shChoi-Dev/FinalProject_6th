import React from 'react';
import { Product } from '../../types/product';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

// Styled-components를 사용한 커스텀 스타일링
const styledCard = styled(Card)`
    /* MUI Card 컴포넌트에 커스텀 스타일 적용 */
    transition: transform 0.2s ease-in-out;
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
`;

const ProductLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

interface ProductCardProps{
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        // Link 컴포넌트로 감싸서 상세 페이지로 이동
        <ProductLink to={`/products/${product.prdNo}`}>
            <StyledCard>
                <CardMedia
                    component="img"
                    height="240"
                    image={product.imageUrl || 'https://via.placeholder.com/240'} // 임시 이미지
                    alt={product.prdName}
                />
                <CardContent>
                    <Typography variant="caption" color="text.secondary">
                        {product.categoryName}
                    </Typography>
                    <Typography variant="body1" component="div" noWrap sx={{ fontWeight: 'bold' }}>
                        {product.prdName}
                    </Typography>
                    <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', marginY: 1 }}>
                        {product.prdPrice.toLocaleString()}원
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                            ⭐ {product.averageRating.toFixed(1)} ({product.reviewCount})
                        </Typography>
                    </Box>
                </CardContent>
            </StyledCard>
        </ProductLink>
    );
};

export default ProductCard;